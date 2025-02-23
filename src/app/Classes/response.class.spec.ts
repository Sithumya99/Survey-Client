import { BasicdataFacade } from "../Facades/Basicdata/BasicdataFacade.facade"
import { Question } from "./question.class"
import { Response } from "./response.class"
import { Section } from "./section.class"

describe('Response', () => {
  
    it('get answers as conditions for section', () => {
        let testQuestion = new Question(1, 'TomSur1', 1, 'checkbox', 1);
        let testSection = new Section('TomSur1', 1);

        testQuestion.copy({
            surveyId: 'TomSur1',
            sectionId: 1,
            questionId: 1,
            questionType: 'checkbox',
            questionString: 'What are your hobbies?',
            noOfResponses: 1,
            options: [{option: 'reading', percentage: 0}, {option: 'writing', percentage: 0}, {option: 'sleeping', percentage: 0}]
        });
        testSection.copy({
            surveyId: 'TomSur1',
            sectionId: 1,
            sectionTitle: 'test section',
            sectionDescription: 'test section',
            noOfQuestions: 1,
            questions: [testQuestion]
        });
        spyOn(BasicdataFacade, 'getSectionById').and.returnValue(testSection);

        let testResponse = new Response('TomSur1', [{sectionId: 1, questionId: 1, answer: '1'}]);
        expect(testResponse.getConditionsBySectionId(1)).toEqual([{questionNo: 1, answerNo: 1}]);

        testResponse = new Response('TomSur1', [{sectionId: 1, questionId: 1, answer: '1/2'}]);
        expect(testResponse.getConditionsBySectionId(1)).toEqual([{questionNo: 1, answerNo: 1}, {questionNo: 1, answerNo: 2}]);
    })

})
