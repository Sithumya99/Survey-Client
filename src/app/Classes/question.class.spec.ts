import { IQuestion } from "../Interfaces/BasicInterfaces.interface";
import { Question } from "./question.class";

describe('Question', () => {
    let testQuestion: Question;

    beforeEach(() => {
        testQuestion = new Question(1, 'TomSur1', 1, 'checkbox', 0);
    });

    it('set questionString', () => {
        let question = "What is your gender?";
        testQuestion.setQuestionString(question);
        expect(testQuestion.questionString).toBe(question);
    })

    it('copy values', () => {
        let copyValue: IQuestion = {
            surveyId: 'TomSur1',
            sectionId: 1,
            questionId: 1,
            questionType: 'checkbox',
            questionString: 'What are your hobbies?',
            options: [{option: 'reading', percentage: 100}, {option: 'watching movies', percentage: 0}],
            noOfResponses: 1
        };
        testQuestion.copy(copyValue);
        expect(testQuestion.questionString).toBe(copyValue.questionString);
        expect(testQuestion.options).toBe(copyValue.options);
        expect(testQuestion.noOfResponses).toBe(copyValue.noOfResponses);
    })

    it('add option', () => {
        testQuestion.addOption("chocolate");
        expect(testQuestion.options.length).toBe(1);
        expect(testQuestion.options[0].option).toBe("chocolate");
    })
});