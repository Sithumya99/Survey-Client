import { Flow } from "../../Classes/flow.class"
import { Section } from "../../Classes/section.class";
import { Survey } from "../../Classes/survey.class";
import { Column } from "../../Interfaces/BasicInterfaces.interface";
import { BasicdataFacade } from "./BasicdataFacade.facade";

describe('BasicdataFacade', () => {

    it('map Flows to Columns', () => {

        let testFlow1 = new Flow('TomSur1', 1, [{questionNo: -1, answerNo: -1}, {questionNo: 1, answerNo: 1}, {questionNo: -1, answerNo: -1}], [1, 2, 3]);
        let testFlow2 = new Flow('TomSur1', 2, [{questionNo: -1, answerNo: -1}, {questionNo: 1, answerNo: 2}, {questionNo: 1, answerNo: 1}], [1, 3, 4]);
        let testFlow3 = new Flow('TomSur1', 3, [{questionNo: -1, answerNo: -1}, {questionNo: 1, answerNo: 2}, {questionNo: 1, answerNo: 2}], [1, 3, 5]);

        let testSection1 = new Section('TomSur1', 1);
        let testSection2 = new Section('TomSur1', 2);
        let testSection3 = new Section('TomSur1', 3);
        let testSection4 = new Section('TomSur1', 4);
        let testSection5 = new Section('TomSur1', 5);

        
        let flows: Flow[] = [testFlow1, testFlow2, testFlow3];
        let sections: Section[] = [testSection1, testSection2, testSection3, testSection4, testSection5];
        let columns: Column[] = [
            {
                section: testSection1,
                flows: [1, 2, 3],
                children: [
                    {
                        section: testSection2,
                        flows: [1],
                        children: [
                            {
                                section: testSection3,
                                flows: [1],
                                children: []
                            }
                        ]
                    },
                    {
                        section: testSection3,
                        flows: [2, 3],
                        children: [
                            {
                                section: testSection4,
                                flows: [2],
                                children: []
                            },
                            {
                                section: testSection5,
                                flows: [3],
                                children: []
                            }
                        ]
                    }
                ]
            }
        ];

        spyOn(BasicdataFacade, 'getSectionById').and.callFake((sectionId: number) => {
            return sections[sectionId - 1];
        });

        expect(BasicdataFacade.mapFlowsToColumns(flows)).toEqual(columns);
    })
})