import { Observable } from "rxjs";
import { ChatbotImplementation } from "./ChatbotImplementation.implementation";
import { IChat, IQuestionClarification, IResponseRelevanceRequest } from "../../Interfaces/BasicInterfaces.interface";
import { Question } from "../../Classes/question.class";

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
}