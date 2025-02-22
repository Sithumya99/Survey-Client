import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { IChat, IQuestionClarification, IQuestionOptions, IResponseRelevanceRequest, Role } from "../../Interfaces/BasicInterfaces.interface";
import { Question } from "../../Classes/question.class";
import { BasicdataFacade } from "../../Facades/Basicdata/BasicdataFacade.facade";
import { ChatbotFacade } from "../../Facades/Chatbot/ChatbotFacade.facade";

@Component({
    selector: 'app-chatbot',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './chatbot.component.html',
    styleUrl: './chatbot.component.scss'
})

export class ChatbotComponent implements OnInit {
    currentQuestion: Question | undefined;
    conversation: IChat[] = [];
    isClarification: boolean = false;
    isEnd: boolean = false;
    dynamicPlaceholder: string = "";
    isActive: boolean = false;
    inputElText: string = "";

    constructor(private cdr: ChangeDetectorRef) {
        this.setPlaceholder();
        ChatbotFacade.getChat$().subscribe(chat => {
            this.conversation = chat;
        });

        ChatbotFacade.getCurrentQuestion$().subscribe(que => {
            this.currentQuestion = que;
            this.setIsActive();
        });

        ChatbotFacade.getIsEnd().subscribe(end => {
            this.isEnd = end;
        });
    }

    ngOnInit(): void {
        ChatbotFacade.getChat$().subscribe(chat => {
            this.conversation = [...chat];
            this.cdr.detectChanges();
        });

        ChatbotFacade.getCurrentQuestion$().subscribe(que => {
            this.currentQuestion = que;
            this.setIsActive();
        });

        ChatbotFacade.getIsEnd().subscribe(end => {
            this.isEnd = end;
        });
    }

    getIsActive(): boolean {
        return this.isActive;
    }

    getChat(): IChat[] {
        return this.conversation;
    }

    setIsActive(): void {
        this.isActive = this.currentQuestion!.questionType == "open" || this.isClarification;
    }

    isContentQuestion(field: IChat): boolean {
        return field.content instanceof Question;
    }

    clarification() {
        this.isClarification = true;
        this.setPlaceholder();
        this.setIsActive();
    }

    isAnswer(field: IChat): boolean {
        return field.role == Role.user;
    }

    isQuestion(field: IChat): boolean {
        return field.role == Role.bot;
    }

    setPlaceholder(): void {
        if (this.isClarification) {
            this.dynamicPlaceholder = "Ask SurveyBot for Clarification...";
        } else {
            this.dynamicPlaceholder = "Enter your answer...";
        }
    }

    getQuestionId(field: IChat): string {
        if (field.content instanceof Question) {
            return field.content.questionId + '/' + field.content.sectionId;
        }
        return '-1';
    }

    // isChecked(field: IChat, option: string): boolean {
    //     if (field.content instanceof Question) {
    //         let optionIndex = field.content.options.findIndex(op => op.option == option);
    //         let answer = ChatbotFacade.getQuestionAnswer(field.content.sectionId, field.content.questionId);
    //         if (answer[0] !== -1) {
    //             if (field.content.questionType == 'checkbox') {
    //                 for (let a = 0; a < answer.length; a++) {
    //                     if (answer[a] == optionIndex) {
    //                         return true;
    //                     }
    //                 }
    //             } else if (field.content.questionType == 'radio') {
    //                 if (answer[0] == optionIndex) {
    //                     return true;
    //                 }
    //             }
    //         }
    //     }
    //     return false;
    // }

    clickPress(event: Event) {
        if ((event instanceof KeyboardEvent && (event as KeyboardEvent).key == 'Enter') || (event instanceof MouseEvent)) {
            if (this.inputElText !== "") {
                if (this.isClarification) {
                    //get clarification answer
                    let clarify: IQuestionClarification = { 
                        systemQuestion: this.currentQuestion!.questionString,
                        userQuestion: this.inputElText
                    };
                    ChatbotFacade.getClarification(clarify);
                    this.isClarification = false;
                    this.setPlaceholder();
                    this.setIsActive();
                } else {
                    //if open question valiadte response relevance
                    if (this.currentQuestion!.questionType == 'open') {
                        let survey = BasicdataFacade.getCurrentSurvey();
                        let resRelevance: IResponseRelevanceRequest = {
                            context: survey!.surveyTitle + ":" + survey!.surveyDescription,
                            question: this.currentQuestion!.questionString,
                            userResponse: this.inputElText
                        };
                        ChatbotFacade.getResponseRelevance(resRelevance);
                    }
                }
            }
            this.inputElText = "";
        }
    }

    saveChanges(field: IChat, option: string) {
        if (field.content instanceof Question) {
            let question: Question = field.content;
            let optionIndex = question.options.findIndex(op => op.option == option);
            ChatbotFacade.updateResponse({
                sectionId: question.sectionId,
                questionId: question.questionId,
                answer: optionIndex.toString()
            });
            ChatbotFacade.goToNextQuestion();
        }
    }

    saveTextChanges(event: Event) {
        let value = (event.target as HTMLInputElement).value;
        this.inputElText = value;
    }

    isRadio(field: IChat): boolean {
        if (field.content instanceof Question) {
            if (field.content.questionType == 'radio') {
                return true;
            }
        }
        return false;
    }

    isCheckbox(field: IChat): boolean {
        if (field.content instanceof Question) {
            if (field.content.questionType == 'checkbox') {
                return true;
            }
        }
        return false;
    }

    isOpen(field: IChat): boolean {
        if (field.content instanceof Question) {
            if (field.content.questionType == 'open') {
                return true;
            }
        }
        return false;
    }

    getQuestionString(field: IChat): string {
        if (field.content instanceof Question) {
            return field.content.questionString;
        }
        return "";
    }

    getOptions(field: IChat): IQuestionOptions[] {
        if (field.content instanceof Question) {
            return field.content.options;
        }
        return [];
    }

    saveResponse() {
        ChatbotFacade.submitResponse();
    }
}