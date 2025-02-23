import { IGetSurveyResponse } from "../Interfaces/BasicInterfaces.interface";
import { Survey } from "./survey.class"
import { Response } from "./response.class";
import { Question } from "./question.class";
import { Section } from "./section.class";
import { Flow } from "./flow.class";

describe('Survey', () => {
    let testSurvey: Survey;
    let surveyCopy: IGetSurveyResponse;

    beforeEach(() => {
        testSurvey = new Survey('TomSur1', 'Tom');
        surveyCopy = {
            surveyId: 'TomSur1',
            owner: 'Tom',
            surveyTitle: 'Hobbies of Students',
            surveyDescription: 'collect data about hobbies enjoyed by students',
            noOfResponses: 1,
            responses: [
                {
                    surveyId: 'TomSur1',
                    answers: [{sectionId: 1, questionId: 1, answer: '1'}]
                }
            ],
            requiresLogin: false,
            sections: [
                {
                    surveyId: 'TomSur1',
                    sectionId: 1,
                    sectionTitle: 'test section',
                    sectionDescription: 'test section',
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
                        }
                    ]
                }
            ],
            flows: [],
            startSection: ''
        };
    })

    it('copy values', () => {
        testSurvey.copy(surveyCopy);
        expect(testSurvey.surveyTitle).toBe('Hobbies of Students');
        expect(testSurvey.surveyDescription).toBe('collect data about hobbies enjoyed by students');
        expect(testSurvey.responses.length).toBe(1);
        expect(testSurvey.sections.length).toBe(1);
    })

    it('set flows', () => {
        let testFlows = [new Flow(surveyCopy.surveyId, 1, [{questionNo: -1, answerNo: -1}], [1])];
        testSurvey.setFlows(testFlows);
        expect(testSurvey.flows.length).toBe(1);
    })

    it('set no of questions in sections', () => {
        surveyCopy.sections[0].noOfQuestions = 0;
        testSurvey.copy(surveyCopy);
        testSurvey.validate();
        expect(testSurvey.sections[0].noOfQuestions).toBe(1);
    })
})