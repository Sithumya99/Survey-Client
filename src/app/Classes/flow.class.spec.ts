import { Flow } from "./flow.class";

describe('Flow', () => {
    let testFlow: Flow;

    beforeEach(() => {
        testFlow = new Flow('TomSur1', 1, [{ questionNo: -1, answerNo: -1}, { questionNo: 1, answerNo: 1}], [1, 2]);
    })

    it('addCondition should add new condition', () => {
        let testCondition = {questionNo: 2, answerNo: 1};
        testFlow.addCondition(testCondition);
        expect(testFlow.conditions.length).toBe(3);
        expect(testFlow.conditions[2]).toBe(testCondition);
    })

    it('addSection should add a new section', () => {
        testFlow.addSection(3);
        expect(testFlow.sectionFlow.length).toBe(3);
        expect(testFlow.sectionFlow[2]).toBe(3);
    })

    it('extendFlow should add new condition and section', () => {
        let testCondition = { questionNo: 2, answerNo: 1};
        testFlow.extendFlow(testCondition, 3);
        expect(testFlow.conditions.length).toBe(3);
        expect(testFlow.conditions[2]).toBe(testCondition);
        expect(testFlow.sectionFlow.length).toBe(3);
        expect(testFlow.sectionFlow[2]).toBe(3);
    })

    it('doConditionsMatch should check if the provided flow matches with current flow upto index', () => {
        let matchFlow = new Flow('TomSur1', 2, [{ questionNo: -1, answerNo: -1}, {questionNo: 1, answerNo: 1}], [1, 2]);

        expect(testFlow.doConditionsMatch(matchFlow, 0)).toBeTrue();  //on 1st/start section
        testFlow.extendFlow({questionNo: 2, answerNo: 1}, 4);
        matchFlow.extendFlow({questionNo: 2, answerNo: 2}, 3);
        expect(testFlow.doConditionsMatch(matchFlow, 1)).toBeTrue();  //on 2nd section(index = 1)
    })

    it('doConditionsMatch -> check flow length is shorter/equal to index', () => {
        let matchFlow = new Flow('TomSur1', 2, [{questionNo: -1, answerNo: -1}], [1]);
        expect(testFlow.doConditionsMatch(matchFlow, 0)).toBeFalse();  //matchFlow.conditions.length - 1 = 1 - 1 <= index = 0
    })

    it('doConditionsMatch -> condition or section not matching', () => {
        let matchFlow = new Flow('TomSur1', 2, [{ questionNo: -1, answerNo: -1}, {questionNo: 1, answerNo: 2}, {answerNo: 1, questionNo: 1}], [1, 2, 3]);
        testFlow.extendFlow({questionNo: 1, answerNo: 2}, 3);
        expect(testFlow.doConditionsMatch(matchFlow, 1)).toBeFalse()  //testFlow.conditions[1] !== matchFlow.conditions[1]

        matchFlow = new Flow('TomSur1', 2, [{ questionNo: -1, answerNo: -1}, {questionNo: 1, answerNo: 1}, {answerNo: 1, questionNo: 1}], [1, 3, 4]);
        expect(testFlow.doConditionsMatch(matchFlow, 1)).toBeFalse();  //testFlow.sectionFlow[1] !== matchFlow.sectionFlow[1]
    })
});