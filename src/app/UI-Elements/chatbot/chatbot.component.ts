import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { IChat, IQuestionClarification, IResponseRelevanceRequest, Role } from "../../Interfaces/BasicInterfaces.interface";
import { Question } from "../../Classes/question.class";
import { BasicdataFacade } from "../../Facades/Basicdata/BasicdataFacade.facade";
import { ChatbotFacade } from "../../Facades/Chatbot/ChatbotFacade.facade";

@Component({
    selector: 'app-chatbot',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './chatbot.component.html'
})

export class ChatbotComponent implements OnInit {
    currentQuestion: Question | undefined;
    conversation: IChat[] = [];
    isClarification: boolean = false;
    isEnd: boolean = false;

    ngOnInit(): void {
        ChatbotFacade.getChat$().subscribe(chat => {
            this.conversation = chat;
        });

        ChatbotFacade.getCurrentQuestion$().subscribe(que => {
            this.currentQuestion = que;
        });

        ChatbotFacade.getIsEnd().subscribe(end => {
            this.isEnd = end;
        });
    }

    getChat(): IChat[] {
        return this.conversation;
    }

    isActive(): boolean {
        return this.currentQuestion!.questionType == "open" || this.isClarification;
    }

    isContentQuestion(field: IChat): boolean {
        return field.content instanceof Question;
    }

    clarification() {
        this.isClarification = true;
    }

    isAnswer(field: IChat): boolean {
        return field.role == Role.user;
    }

    isQuestion(field: IChat): boolean {
        return field.role == Role.bot;
    }

    getPlaceholder(): string {
        if (this.isClarification) {
            return "Ask SurveyBot for Clarification...";
        } else {
            return "Enter your answer...";
        }
    }

    clickPress(event: Event) {
        let inputElm = event.target as HTMLInputElement;

        if ((event instanceof KeyboardEvent && (event as KeyboardEvent).key == 'Enter') || (event instanceof MouseEvent)) {
            if (inputElm.value.trim() !== "") {
                if (this.isClarification) {
                    //get clarification answer
                    let clarify: IQuestionClarification = { 
                        systemQuestion: this.currentQuestion!.questionString,
                        userQuestion: inputElm.value
                    };
                    ChatbotFacade.getClarification(clarify);
                    this.isClarification = false;
                } else {
                    //if open question valiadte response relevance
                    if (this.currentQuestion!.questionType == 'open') {
                        let survey = BasicdataFacade.getCurrentSurvey();
                        let resRelevance: IResponseRelevanceRequest = {
                            context: survey!.surveyTitle + ":" + survey!.surveyDescription,
                            question: this.currentQuestion!.questionString,
                            userResponse: inputElm.value
                        };
                        ChatbotFacade.getResponseRelevance(resRelevance);
                    }
                }
            }
            inputElm.value = "";
        }
    }

    saveResponse() {
        //maintain global response object
        //call save response
    }
}