import { Observable } from "rxjs";
import { ChatbotImplementation } from "./ChatbotImplementation.implementation";
import { IChat, IQuestionClarification, IResponse, IResponseRelevanceRequest, Role } from "../../Interfaces/BasicInterfaces.interface";
import { Question } from "../../Classes/question.class";
import { BasicdataFacade } from "../Basicdata/BasicdataFacade.facade";
import { Survey } from "../../Classes/survey.class";
import { Section } from "../../Classes/section.class";
import { Flow } from "../../Classes/flow.class";

export class ChatbotFacade {
    private static impl: ChatbotImplementation = new ChatbotImplementation();

    public static getChat$(): Observable<IChat[]> {
        return this.impl.getChat$();
    }

    public static setChat$(chatMsgs: IChat[]) {
        this.impl.setChat$(chatMsgs);
    }

    public static getCurrentQuestion$(): Observable<Question | undefined> {
        return this.impl.getCurrentQuestion$();
    }

    public static setCurrentQuestion$(question: Question) {
        this.impl.setCurrentQuestion$(question);
    }

    public static getIsEnd(): Observable<boolean> {
        return this.impl.getIsEnd();
    }

    public static setIsEnd(value: boolean) {
        this.impl.setIsEnd(value);
    }

    public static async getClarification(clarificationDetails: IQuestionClarification) {
        await this.impl.getClarification(clarificationDetails);
    }

    public static async getResponseRelevance(questionDetails: IResponseRelevanceRequest) {
        await this.impl.getResponseEvaluation(questionDetails);
    }

    public static initChat() {
        let survey = BasicdataFacade.getCurrentSurvey();
        let startSection = BasicdataFacade.getSectionById(+survey!.startSection);
        let chat: IChat[] = [
            {
                role: Role.bot,
                content: "Hello! My name is SurveyBot and I will be guiding you through the survey."
            },
            {
                role: Role.bot,
                content: startSection!.questions[0]
            }
        ];
        this.impl.createNewResponse();
        this.impl.setCurrentFlow(survey!.flows[0]);
        this.impl.setCurrentQuestion$(startSection!.questions[0]);
        this.impl.setChat$(chat);
        this.impl.setIsEnd(false);
    }

    public static updateResponse(res: IResponse) {
        this.impl.updateResponse(res);
    }

    public static goToNextQuestion() {
        this.impl.goToNextQuestion();
    }

    public static nextQuestion(sectionId: number, questionId: number): Question | undefined {
        let nextQuestion: Question | undefined;
        let survey = BasicdataFacade.getCurrentSurvey();
        let currentSection: Section = BasicdataFacade.getSectionById(sectionId)!;
        let currentFlow: Flow = this.impl.getCurrentFlow()!;
        let currentSectionIndex = currentFlow!.sectionFlow.findIndex(sf => sf == sectionId);

        //if in last question of section
        if (currentSection.questions[currentSection.questions.length - 1].questionId == questionId) {
            //current question is the last question of the current section -> need to get next section -> flow's current section condition must be satisfied to go to next section

            //check flow end or not
            if (currentSectionIndex !== currentFlow!.sectionFlow.length - 1) {
                //not end of flow
                let conditionForCurrentSection = currentFlow!.conditions[currentSectionIndex + 1];
                let userResponse = this.impl.getCurrentResponse();
    
                //check if answers for current section match condition for current section -> if current section condition of current flow satisfied
                if (conditionForCurrentSection.questionNo !== -1) {
                    //condition exists -> check if current flow is satisfied
                    let responsesAsConditions = userResponse!.getConditionsBySectionId(sectionId);
                    let isConditionSatisfied: boolean = false;

                    for (let i = 0; i < responsesAsConditions.length; i++) {
                        let condition = responsesAsConditions[i];
                        if (condition.questionNo == conditionForCurrentSection.questionNo && condition.answerNo == conditionForCurrentSection.answerNo) {
                            isConditionSatisfied = true;
                            break;
                        }
                    }
    
                    //if condition satisfied
                    if (!isConditionSatisfied) {
                        //condition is not satisfied -> find new flow
                        
                        //find new flows that satisfies all previous conditions
                        let existingConditionSatisfiedFlows: Flow[] = [];
                        for (let i = 0; i < survey!.flows.length; i++) {
                            if (survey!.flows[i].flowId !== currentFlow.flowId) {
                                let isMatch = currentFlow.doConditionsMatch(survey!.flows[i], currentSectionIndex);
                                if (isMatch) existingConditionSatisfiedFlows.push(survey!.flows[i]);
                            }
                        }

                        if (existingConditionSatisfiedFlows.length == 0) {
                            //condition exists on current flow and is not satisfied
                            //no other matching flows -> end survey
                            return nextQuestion; //undefined
                        } else {
                            //other matching flows exist -> find if any flows, where flow's current condition is satisfied
                            let finalMtachingFlows: Flow[] = [];
                            for (let f = 0; f < existingConditionSatisfiedFlows.length; f++) {
                                let checkFlow = existingConditionSatisfiedFlows[f];
                                let checkCondition = checkFlow.conditions[currentSectionIndex + 1];
                                if (checkCondition.questionNo !== -1) {
                                    for (let i = 0; i < responsesAsConditions.length; i++) {
                                        let condition = responsesAsConditions[i];
                                        if (condition.questionNo == checkCondition.questionNo && condition.answerNo == checkCondition.answerNo) {
                                            finalMtachingFlows.push(checkFlow);
                                            break;
                                        }
                                    }
                                }
                            }

                            if (finalMtachingFlows.length > 0) {
                                //some matching flow(s) exists where current section condition is satisfied from responses
                                this.impl.setCurrentFlow(finalMtachingFlows[0]);
                            } else {
                                //no matching flows where current section condition is not any and is satisfied
                                //check for flows where current section condition is any
                                for (let f = 0; f < existingConditionSatisfiedFlows.length; f++) {
                                    let checkFlow = existingConditionSatisfiedFlows[f];
                                    let checkCondition = checkFlow.conditions[currentSectionIndex + 1];
                                    if (checkCondition.questionNo == -1) {
                                        //if any condition -> take the flow
                                        finalMtachingFlows.push(checkFlow);
                                        break;
                                    }
                                }

                                if (finalMtachingFlows.length > 0) {
                                    //flows with any for current section condition exists
                                    this.impl.setCurrentFlow(finalMtachingFlows[0]);
                                } else {
                                    //no flows with even any condition -> end of survey
                                    return nextQuestion; //undefined
                                }
                            }
                        }
                    }
                    //else current section condition of current flow satisfied
                } else {
                    //condition in current flow is any -> check if there's any other flow with condition that matches answer
                    //find new flow that satisfies all previous conditions
                    let existingConditionSatisfiedFlows: Flow[] = [];
                    for (let i = 0; i < survey!.flows.length; i++) {
                        if (survey!.flows[i].flowId !== currentFlow.flowId) {
                            let isMatch = currentFlow.doConditionsMatch(survey!.flows[i], currentSectionIndex);
                            if (isMatch) existingConditionSatisfiedFlows.push(survey!.flows[i]);
                        }
                    }

                    if (existingConditionSatisfiedFlows.length !== 0) {
                        //flows exist with all previous conditions matching -> check if any flow has currensectioncondition that matches the responsesasconditions
                        let responsesAsConditions = userResponse!.getConditionsBySectionId(sectionId);
                        let finalMtachingFlows: Flow[] = [];
                        for (let f = 0; f < existingConditionSatisfiedFlows.length; f++) {
                            let checkFlow = existingConditionSatisfiedFlows[f];
                            let checkCondition = checkFlow.conditions[currentSectionIndex + 1];
                            if (checkCondition.questionNo !== -1) {
                                for (let i = 0; i < responsesAsConditions.length; i++) {
                                    let condition = responsesAsConditions[i];
                                    if (condition.questionNo == checkCondition.questionNo && condition.answerNo == checkCondition.answerNo) {
                                        finalMtachingFlows.push(checkFlow);
                                        break;
                                    }
                                }
                            }
                        }

                        //check final flows
                        if (finalMtachingFlows.length == 0) {
                            //found no flows that match the current section condition
                            //check for flows with any condition for current section condition
                            for (let f = 0; f < existingConditionSatisfiedFlows.length; f++) {
                                let checkFlow = existingConditionSatisfiedFlows[f];
                                let checkCondition = checkFlow.conditions[currentSectionIndex + 1];
                                if (checkCondition.questionNo == -1) {
                                    //if any condition -> take the flow
                                    finalMtachingFlows.push(checkFlow);
                                    break;
                                }
                            }

                            if (finalMtachingFlows.length > 0) {
                                this.impl.setCurrentFlow(finalMtachingFlows[0]);
                            } else {
                                //if no matching flows -> end survey
                                return nextQuestion; //undefined
                            }
                        } else {
                            //flow(s) with satisfied current section condition exists
                            this.impl.setCurrentFlow(finalMtachingFlows[0]);
                        }
                        
                    }
                    //else no other flows satisfy previous conditions -> stay in current flow
                }
    
                //refresh currentflow
                currentFlow = this.impl.getCurrentFlow()!;
                let nextSection = BasicdataFacade.getSectionById(currentFlow.sectionFlow[currentSectionIndex + 1]);
                nextQuestion = nextSection!.questions[0]; //nextQuestion not undefined
                
                return nextQuestion; 
            } else {
                //end of flow -> end survey
                return nextQuestion; //undefined
            }
        } else {
            //current question is not the last question of the section -> go to next question
            nextQuestion = currentSection.questions.find(q => q.questionId == questionId + 1);
            return nextQuestion;
        }
    }
}