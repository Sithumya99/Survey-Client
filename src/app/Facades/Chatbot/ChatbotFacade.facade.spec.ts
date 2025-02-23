import { Flow } from "../../Classes/flow.class";
import { Question } from "../../Classes/question.class";
import { Response } from "../../Classes/response.class";
import { Section } from "../../Classes/section.class"
import { Survey } from "../../Classes/survey.class";
import { IGetSurveyResponse } from "../../Interfaces/BasicInterfaces.interface";
import { BasicdataFacade } from "../Basicdata/BasicdataFacade.facade";
import { ChatbotFacade } from "./ChatbotFacade.facade";
import { ChatbotImplementation } from "./ChatbotImplementation.implementation";

describe('ChatbotFacade', () => {

    let moackChatbotImpl: jasmine.SpyObj<any>;
    let testSurvey = new Survey('TomSur1', 'Tom');
    let testSection1: Section;
    let testSection2: Section;
    let testSection3: Section;
    let testFlow1: Flow;
    let testFlow2: Flow;
    let testResponse: Response;
    let nextQuestion: Question;

    beforeEach(() => {
        let testSurveyCopy: IGetSurveyResponse = {
            surveyId: 'TomSur1',
            owner: 'Tom',
            surveyTitle: 'Hobbies of Students',
            surveyDescription: 'collect data about hobbies enjoyed by students',
            noOfResponses: 1,
            responses: [
                {
                    surveyId: 'TomSur1',
                    answers: []
                }
            ],
            requiresLogin: false,
            sections: [
                {
                    surveyId: 'TomSur1',
                    sectionId: 1,
                    sectionTitle: 'test section 1',
                    sectionDescription: 'test section 1',
                    noOfQuestions: 1,
                    questions: [
                        {
                            surveyId: 'TomSur1',
                            sectionId: 1,
                            questionId: 1,
                            questionType: 'checkbox',
                            questionString: 'What are your hobbies?',
                            noOfResponses: 1,
                            options: [{option: 'reading', percentage: 0}, {option: 'writing', percentage: 0}, {option: 'sleeping', percentage: 0}]
                        },
                        {
                            surveyId: 'TomSur1',
                            sectionId: 1,
                            questionId: 2,
                            questionType: 'radio',
                            questionString: 'Do you have any hobbies',
                            noOfResponses: 1,
                            options: [{option: 'yes', percentage: 0}, {option: 'no', percentage: 0}]
                        }
                    ]
                },
                {
                    surveyId: 'TomSur1',
                    sectionId: 2,
                    sectionTitle: 'test section 2',
                    sectionDescription: 'test section 2',
                    noOfQuestions: 1,
                    questions: [
                        {
                            surveyId: 'TomSur1',
                            sectionId: 2,
                            questionId: 1,
                            questionType: 'radio',
                            questionString: 'Answer yes or no',
                            noOfResponses: 1,
                            options: [{option: 'yes', percentage: 0}, {option: 'no', percentage: 0}]
                        }
                    ]
                },
                {
                    surveyId: 'TomSur1',
                    sectionId: 3,
                    sectionTitle: 'test section 3',
                    sectionDescription: 'test section 3',
                    noOfQuestions: 1,
                    questions: [
                        {
                            surveyId: 'TomSur1',
                            sectionId: 3,
                            questionId: 1,
                            questionType: 'radio',
                            questionString: 'Do you like ice cream?',
                            noOfResponses: 1,
                            options: [{option: 'yes', percentage: 0}, {option: 'no', percentage: 0}]
                        }
                    ]
                }
            ],
            flows: [
                {
                    surveyId: 'TomSur1',
                    flowId: 1,
                    conditions: [{questionNo: -1, answerNo: -1}],
                    sectionFlow: [1]
                },
                {
                    surveyId: 'TomSur1',
                    flowId: 2,
                    conditions: [{questionNo: -1, answerNo: -1}],
                    sectionFlow: [1]
                }
            ],
            startSection: ''
        };

        testSurvey = new Survey('TomSur1', 'Tom');
        testSurvey.copy(testSurveyCopy);
        testSection1 = testSurvey.sections[0];
        testSection2 = testSurvey.sections[1];
        testSection3 = testSurvey.sections[2];
        testFlow1 = testSurvey.flows[0];
        testFlow2 = testSurvey.flows[1];
        testResponse = testSurvey.responses[0];

        spyOn(BasicdataFacade, 'getCurrentSurvey').and.returnValue(testSurvey);
        spyOn(BasicdataFacade, 'getSectionById').and.callFake((sectionId: number) => {
            return testSurvey.sections[sectionId - 1];
        });
        moackChatbotImpl = jasmine.createSpyObj('ChatbotImplementation', ['getCurrentFlow', 'getCurrentResponse', 'setCurrentFlow']);
        (ChatbotFacade as any).impl = moackChatbotImpl;
        moackChatbotImpl.getCurrentResponse.and.returnValue(testResponse);
    });

    it('get next question -> not last question of section', () => {
        moackChatbotImpl.getCurrentFlow.and.returnValue(testFlow1);
        nextQuestion = testSurvey.sections[0].questions[1];
        expect(ChatbotFacade.nextQuestion(1, 1)).toBe(nextQuestion);
    })

    it('get next question -> is last question of section -> end of flow', () => {
        moackChatbotImpl.getCurrentFlow.and.returnValue(testFlow1);
        expect(ChatbotFacade.nextQuestion(1, 2)).toBe(undefined);
    })

    it('get next question -> is last question of section -> not end of flow -> condition exists and is satisfied', () => {
        //extend 1st flow to have 2 sections and a condition for 2nd section
        testFlow1.extendFlow({questionNo: 2, answerNo: 0}, testSection2.sectionId);
        testResponse.answers.push({sectionId: 1, questionId: 2, answer: '0'});  //ensure condition is satisfied
        moackChatbotImpl.getCurrentFlow.and.returnValue(testFlow1);
        nextQuestion = testSection2.questions[0];  //get the 1st question of the next section in flow
        expect(ChatbotFacade.nextQuestion(1, 2)).toBe(nextQuestion);
    })

    it('get next question -> is last question of section -> not end of flow -> condition exists but not satisfied -> matching flows do not exist', () => {
        //extend 1st flow so that its not the end of the flow(currently in 1st question 2nd section)
        testFlow1.extendFlow({questionNo: 2, answerNo: 1}, testSection2.sectionId);
        testFlow1.extendFlow({questionNo: 1, answerNo: 1}, testSection3.sectionId);
        testResponse.answers.push({sectionId: 2, questionId: 1, answer: '0'}); //ensure condition is not satisfied
        moackChatbotImpl.getCurrentFlow.and.returnValue(testFlow1);
        expect(ChatbotFacade.nextQuestion(2, 1)).toBe(undefined);
    })

    it('get next question -> is last question of section -> not end of flow -> condition exists but not satisfied -> matching flow satisfies condition', () => {
        //extend flows such that not end of flow
        testFlow1.extendFlow({questionNo: 2, answerNo: 1}, testSection2.sectionId);
        testFlow2.extendFlow({questionNo: 2, answerNo: 0}, testSection3.sectionId);
        testResponse.answers.push({sectionId: 1, questionId: 2, answer: '0'});  //ensure condition satisfied in 2nd flow
        let newFlow: Flow = testFlow1;
        moackChatbotImpl.getCurrentFlow.and.callFake(() => {
            return newFlow;
        });
        moackChatbotImpl.setCurrentFlow.and.callFake((flow: Flow) => {
            newFlow = flow;
        });
        nextQuestion = testSection3.questions[0];
        expect(ChatbotFacade.nextQuestion(1, 2)).toBe(nextQuestion);
    })

    it('get next question -> is last question of section -> not end of flow -> condition exists but not satisfied -> matching flow satisfies condition by any condition', () => {
        //extend flows such that not end of flow
        testFlow1.extendFlow({questionNo: 2, answerNo: 1}, testSection2.sectionId);
        testFlow2.extendFlow({questionNo: -1, answerNo: -1}, testSection3.sectionId);  //ensure condition satisfied in 2nd flow
        testResponse.answers.push({sectionId: 1, questionId: 2, answer: '0'});
        let newFlow: Flow = testFlow1;
        moackChatbotImpl.getCurrentFlow.and.callFake(() => {
            return newFlow;
        });
        moackChatbotImpl.setCurrentFlow.and.callFake((flow: Flow) => {
            newFlow = flow;
        });
        nextQuestion = testSection3.questions[0];
        expect(ChatbotFacade.nextQuestion(1, 2)).toBe(nextQuestion);
    })

    it('get next question -> is last question of section -> not end of flow -> condition exists but not satisfied -> matching flows exists but not satisfies', () => {
        //extend flows such that not end of flow
        testFlow1.extendFlow({questionNo: 2, answerNo: 1}, testSection2.sectionId);
        testFlow2.extendFlow({questionNo: 1, answerNo: 1}, testSection3.sectionId);
        testResponse.answers.push({sectionId: 1, questionId: 2, answer: '0'}); //ensure no flow is satisfied
        moackChatbotImpl.getCurrentFlow.and.returnValue(testFlow1);
        expect(ChatbotFacade.nextQuestion(1, 2)).toBe(undefined);
    })

    it('get next question -> is last question of section -> not end of flow -> condition is any -> no matching flows', () => {
        //extend flows such that not end of flow
        testFlow1.extendFlow({questionNo: -1, answerNo: -1}, testSection2.sectionId);
        testResponse.answers.push({sectionId: 1, questionId: 2, answer: '0'});
        moackChatbotImpl.getCurrentFlow.and.returnValue(testFlow1);
        nextQuestion = testSection2.questions[0];
        expect(ChatbotFacade.nextQuestion(1, 2)).toBe(nextQuestion);
    })

    it('get next question -> is last question of section -> not end of flow -> condition is any -> matching flow is satisfied', () => {
        //extend flows such that not end of flow
        testFlow1.extendFlow({questionNo: -1, answerNo: -1}, testSection2.sectionId);
        testFlow2.extendFlow({questionNo: 2, answerNo: 0}, testSection3.sectionId);
        testResponse.answers.push({sectionId: 1, questionId: 2, answer: '0'});  //ensure flow2 is satisfied
        let newFlow: Flow = testFlow1;
        moackChatbotImpl.getCurrentFlow.and.callFake(() => {
            return newFlow;
        });
        moackChatbotImpl.setCurrentFlow.and.callFake((flow: Flow) => {
            newFlow = flow;
        });
        nextQuestion = testSection3.questions[0];
        expect(ChatbotFacade.nextQuestion(1, 2)).toBe(nextQuestion);
    })

    it('get next question -> is last question of section -> not end of flow -> condition is any -> matching flows exist but not satisfied', () => {
        //extend flows such that not end of flow
        testFlow1.extendFlow({questionNo: -1, answerNo: -1}, testSection2.sectionId);
        testFlow2.extendFlow({questionNo: 1, answerNo: 0}, testSection3.sectionId);
        testResponse.answers.push({sectionId: 1, questionId: 2, answer: '0'});
        moackChatbotImpl.getCurrentFlow.and.returnValue(testFlow1);
        nextQuestion = testSection2.questions[0];
        expect(ChatbotFacade.nextQuestion(1, 2)).toBe(nextQuestion);
    })
})