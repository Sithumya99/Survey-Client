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
}