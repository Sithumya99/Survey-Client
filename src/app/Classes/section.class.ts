import { MessageFacade } from "../Facades/Message/MessageFacade.facade";
import { IConnectedFlow } from "../Interfaces/BasicInterfaces.interface";
import { Question } from "./question.class";

export class Section {
    surveyId: string;
    sectionId: number;
    sectionTitle: string = "";
    sectionDescription: string = "";
    noOfQuestions: number;
    questions: Question[] = [];
    connectedFlows: IConnectedFlow[] = [];

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