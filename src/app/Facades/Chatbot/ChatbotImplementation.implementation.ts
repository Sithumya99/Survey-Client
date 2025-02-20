import { BehaviorSubject, Observable } from "rxjs";
import { IChat, IQuestionClarification, IResponseRelevanceRequest, Role } from "../../Interfaces/BasicInterfaces.interface";
import { CommunicationService } from "../../Services/CommunicationService.service";
import { MessageFacade } from "../Message/MessageFacade.facade";
import { HttpErrorResponse } from "@angular/common/http";
import { UserProfileFacade } from "../UserProfile/UserProfileFacade.facade";
import { Question } from "../../Classes/question.class";
import { BasicdataFacade } from "../Basicdata/BasicdataFacade.facade";

export class ChatbotImplementation {
    private chat: BehaviorSubject<IChat[]> = new BehaviorSubject<IChat[]>([]);
    private currentQuestion: BehaviorSubject<Question | undefined> = new BehaviorSubject<Question | undefined>(undefined); 
    private isEnd: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    getChat$(): Observable<IChat[]> {
        return this.chat.asObservable();
    }

    setChat$(chatMsgs: IChat[]) {
        this.chat.next(chatMsgs);
    }

    getCurrentQuestion$(): Observable<Question | undefined> {
        return this.currentQuestion.asObservable();
    }

    setCurrentQuestion$(question: Question) {
        this.currentQuestion.next(question);
    }

    getIsEnd(): Observable<boolean> {
        return this.isEnd.asObservable();
    }

    setIsEnd(value: boolean) {
        this.isEnd.next(value);
    }

    getClarification(clarificationDetails: IQuestionClarification): Promise<void> {
        return new Promise((resolve, reject) => {
            CommunicationService.http.postFromSurveyServer("getclarification", {username: UserProfileFacade.getUser()!.username, clarificationDetails}).subscribe(
                async (result) => {
                    let chat = this.chat.value;
                    chat.push({
                        role: Role.bot,
                        content: result.answer
                    });
                    this.setChat$(chat);
                    resolve(result);
                },
                async (err: HttpErrorResponse) => {
                    MessageFacade.setErrorMsg$(err.error.message);
                    reject(err);
                }
            )
        });
    }

    getResponseEvaluation(questionDetails: IResponseRelevanceRequest): Promise<void> {
        return new Promise((resolve, reject) => {
            CommunicationService.http.postFromSurveyServer("getresponseevaluation", { username: UserProfileFacade.getUser()!.username, questionDetails}).subscribe(
                async (result) => {
                    if (result.flag == 0) {
                        //irrelevant response
                        let chatMsgs = this.chat.value;
                        chatMsgs.push({
                            role: Role.bot,
                            content: "Please provide a relevant and specific response to the question"
                        });
                        chatMsgs.push({
                            role: Role.bot,
                            content: this.currentQuestion.value!
                        })
                        this.setChat$(chatMsgs);
                    } else {
                        //relevant response
                        let chatMsgs = this.chat.value;
                        chatMsgs.push({
                            role: Role.user,
                            content: questionDetails.userResponse
                        });

                        let currentQuestion = this.currentQuestion.value;
                        let nextQuestion = BasicdataFacade.getNextQuestion(currentQuestion!.sectionId, currentQuestion!.questionId);
                        if (nextQuestion) {
                            //set next question
                            chatMsgs.push({
                                role: Role.bot,
                                content: nextQuestion
                            })
                            this.setCurrentQuestion$(nextQuestion);
                            this.setChat$(chatMsgs);
                        } else {
                            //end of survey
                            chatMsgs.push({
                                role: Role.bot,
                                content: "You have answered all questions. Press Submit to save response."
                            })
                            this.setChat$(chatMsgs);
                            this.setIsEnd(true);
                        }
                    }
                    resolve(result);
                },
                async (err: HttpErrorResponse) => {
                    MessageFacade.setErrorMsg$(err.error.message);
                    reject(err);
                }
            )
        });
    }
}