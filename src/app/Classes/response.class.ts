
export class Response {
    surveyId: string;
    answers: string[] = [];

    constructor(surveyId: string, answers: string[]) {
        this.surveyId = surveyId;
        this.answers = answers;
    }
}