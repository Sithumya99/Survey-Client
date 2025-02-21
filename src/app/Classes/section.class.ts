import { MessageFacade } from "../Facades/Message/MessageFacade.facade";
import { IConnectedFlow, IQuestion, ISection } from "../Interfaces/BasicInterfaces.interface";
import { Question } from "./question.class";

export class Section {
    surveyId: string;
    sectionId: number;
    sectionTitle: string = "";
    sectionDescription: string = "";
    noOfQuestions: number;
    questions: Question[] = [];

    constructor(surveyId: string, sectionId: number) {
        this.surveyId = surveyId;
        this.sectionId = sectionId;
        this.noOfQuestions = 0;
    }

    setValues(value: any, field: string, index?: number) {
        switch(field) {
            case 'title':
                this.sectionTitle = value;
                break;
            case 'description':
                this.sectionDescription = value;
                break;
            case 'questionString':
                this.questions[index!].questionString = value;
        }
    }

    copy(copy: ISection) {
        this.sectionTitle = copy.sectionTitle;
        this.sectionDescription = copy.sectionDescription;
        this.noOfQuestions = copy.noOfQuestions;
        this.questions = [];
        let jsonQuestions: IQuestion[] = copy.questions;
        for (let i = 0; i < jsonQuestions.length; i++) {
            let jsonq = jsonQuestions[i];
            let question = new Question(this.sectionId, this.surveyId, jsonq.questionId, jsonq.questionType);
            question.copy(jsonq);
            this.questions.push(question);
        }
    }

    validate(): boolean {
        if (this.surveyId == "") {
            MessageFacade.setErrorMsg$("Invalid survey id");
            return false;
        }
        if (this.sectionTitle == "") {
            MessageFacade.setErrorMsg$("Section must have a title");
            return false;
        }
        if (this.questions.length == 0) {
            MessageFacade.setErrorMsg$("Section must have atleast one question");
            return false;
        }
        return true;
    }
}