import { IQuestion, IQuestionOptions } from "../Interfaces/BasicInterfaces.interface";

export class Question {
    sectionId: number;
    surveyId: string;
    questionId: number;
    questionString: string = "";
    questionType: string;
    options: IQuestionOptions[] = [];
    noOfResponses: number;

    constructor(sectionId: number, surveyId: string, questionId: number, questionType: string, noOfResponses: number = 0) {
        this.sectionId = sectionId;
        this.surveyId = surveyId;
        this.questionId = questionId;
        this.questionType = questionType;
        this.noOfResponses = noOfResponses;
    }

    setQuestionString(question: string) {
        this.questionString = question;
    }

    copy(copy: IQuestion) {
        this.questionString = copy.questionString;
        this.options = copy.options;
        this.noOfResponses = copy.noOfResponses;
    }

    addOption(option: string) {
        this.options.push({
            option: option,
            percentage: 0
        });
    }
}