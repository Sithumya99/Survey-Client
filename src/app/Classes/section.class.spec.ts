import { Question } from "./question.class";
import { Section } from "./section.class"

describe('Section', () => {
    let testSection: Section;

    beforeEach(() => {
        testSection = new Section('TomSur1', 1);
    })

    it('copy values', () => {
        testSection.copy({
            surveyId: 'TomSur1',
            sectionId: 1,
            sectionTitle: 'test section',
            sectionDescription: 'test section',
            noOfQuestions: 0,
            questions: []
        });

        expect(testSection.sectionTitle).toBe('test section');
        expect(testSection.sectionDescription).toBe('test section');
    })

    it('set values', () => {
        let testQuestion = new Question(1, 'TomSur1', 1, 'checkbox', 1);
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

        testSection.setValues('Hobbies', 'title');
        expect(testSection.sectionTitle).toBe('Hobbies');

        testSection.setValues('Information about hobbies', 'description');
        expect(testSection.sectionDescription).toBe('Information about hobbies');

        testSection.setValues('Which of the following hobbies do you enjoy in your free time?', 'questionString', 0);
        expect(testSection.questions[0].questionString).toBe('Which of the following hobbies do you enjoy in your free time?');
    })

    it('validate', () => {
        expect(testSection.validate()).toBeFalse();

        let testQuestion = new Question(1, 'TomSur1', 1, 'checkbox', 1);
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

        expect(testSection.validate()).toBeTrue();
    })
})