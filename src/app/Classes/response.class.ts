import { BasicdataFacade } from "../Facades/Basicdata/BasicdataFacade.facade";
import { ConditionInterface, IResponse } from "../Interfaces/BasicInterfaces.interface";

export class Response {
    surveyId: string;
    answers: IResponse[] = [];

    constructor(surveyId: string, answers: IResponse[]) {
        this.surveyId = surveyId;
        this.answers = answers;
    }

    getConditionsBySectionId(sectionId: number): ConditionInterface[] {
        let conditions: ConditionInterface[] = [];
        let currentSection = BasicdataFacade.getSectionById(sectionId);
        for (let i = 0; i < this.answers.length; i++) {
            let answer = this.answers[i];
            if (answer.sectionId == sectionId) {
                let currentQuestion = currentSection!.questions.find(q => q.questionId == answer.questionId);
                if (currentQuestion!.questionType !== 'open') {
                    conditions.push({
                        questionNo: answer.questionId,
                        answerNo: +answer.answer
                    });
                }
            }
        }
        return conditions;
    }
}