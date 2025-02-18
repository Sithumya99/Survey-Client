import { Observable } from "rxjs";
import { Flow } from "../../Classes/flow.class";
import { Survey } from "../../Classes/survey.class";
import { Column, IQuestionClarification, IResponseRelevanceRequest, pages } from "../../Interfaces/BasicInterfaces.interface";
import { UserProfileFacade } from "../UserProfile/UserProfileFacade.facade";
import { BasicdataImplementation } from "./BasicdataImplementation.implementation";
import { Section } from "../../Classes/section.class";

export class BasicdataFacade {

    private static impl: BasicdataImplementation = new BasicdataImplementation();

    public static getSectionById(sectionId: number): Section | undefined {
        let survey = this.impl.getCurrentSurvey();
        return survey!.sections.find(s => s.sectionId == sectionId);
    }

    public static getFlowById(flowId: number): Flow | undefined {
        let survey = this.impl.getCurrentSurvey();
        return survey!.flows.find(f => f.flowId == flowId);
    }

    public static getNextFlowId(): number {
        let survey = this.impl.getCurrentSurvey();
        if (survey!.flows.length == 0) {
            return 1;
        } else {
            return survey!.flows[-1].flowId + 1;
        }
    }

    public static mapFlowsToColumns(flows: Flow[]): Column[] {
        let flowIds: number[] = flows.map(f => f.flowId);
        const root: Column = {
            section: this.getSectionById(flows[0].sectionFlow[0])!,
            flows: flowIds,
            children: []
        };
        let columns: Column[] = [root];

        flows.forEach((flow) => {
            let currentLevel = root.children;

            for( let i = 1; i < flow.sectionFlow.length; i++) {
                let sectionId = flow.sectionFlow[i];

                let existingColumn: Column | undefined = currentLevel.find(col => col.section.sectionId == sectionId);

                if (!existingColumn) {
                    existingColumn = {
                        section: this.getSectionById(sectionId)!,
                        flows: [flow.flowId],
                        children: []
                    };
                    currentLevel.push(existingColumn);
                } else {
                    existingColumn.flows.push(flow.flowId);
                }

                currentLevel = existingColumn.children;
            }
        });

        return columns;
    }

    public static mapColumnsToFlows(columns: Column[]): Flow[] {
        let flows: Flow[] = [];
        let surveyId: string = this.impl.getCurrentSurvey()!.surveyId;

        for (let column of columns) {
            this.traverseColumns(column, [], flows, surveyId);
        }

        return flows;
    }

    public static traverseColumns(column: Column, path: number[], flows: Flow[], surveyId: string) {
        let newPath: number[] = [...path, column.section.sectionId];

        if (column.children.length == 0) {
            //leaf node
            column.flows.forEach(flow => {
                flows.push(new Flow(surveyId, flow, [], newPath));
            });
        } else {
            for (let child of column.children) {
                this.traverseColumns(child, newPath, flows, surveyId);
            }
        }
    }

    public static getCurrentSurvey$(): Observable<Survey | undefined> {
        return this.impl.getCurrentSurvey$();
    }

    public static setCurrentSurvey$(survey: Survey) {
        this.impl.setCurrentSurvey$(survey);
    }

    public static getCurrentSurvey(): Survey | undefined {
        return this.impl.getCurrentSurvey();
    }

    public static getCurrentPage$(): Observable<pages> {
        return this.impl.getCurrentPage$();
    }

    public static setCurrentPage$(page: pages) {
        this.impl.setCurrentPage$(page);
    }

    public static getSurveyIds$(): Observable<string[]> {
        return this.impl.getSurveyIds$();
    }

    public static setSurveyIds$(surveys: string[]) {
        this.impl.setSurveyIds$(surveys);
    }

    public static addFlow(flow: Flow) {
        let survey = this.impl.getCurrentSurvey();
        survey!.flows.push(flow);
        this.impl.setCurrentSurvey$(survey!);
    }

    public static createNewSurvey() {
        let userId = UserProfileFacade.getUser()!.id;
        let newSurvey: Survey = new Survey('-1', userId);
        this.impl.setCurrentSurvey$(newSurvey);
    }

    public static addSection(survey: Survey): Section {
        let sectionId: number = 1;
        if (survey.sections.length > 0) {
            sectionId = survey.sections[-1].sectionId + 1;
        }
        let newSection: Section = new Section(survey.surveyId, sectionId);
        return newSection;
    }

    public static addSectionToSurvey(section: Section) {
        let survey = this.impl.getCurrentSurvey()!;
        survey.sections.push(section);
    }

    public static addFlows(flowPaths: Flow[]) {
        let survey = this.impl.getCurrentSurvey()!;
        survey.setFlows(flowPaths);
        this.impl.setCurrentSurvey$(survey);
    }

    public static async saveSurvey() {
        //validate survey
        let survey: Survey = this.impl.getCurrentSurvey()!;
        await this.impl.saveSurvey(survey);
    }

    private static validateSurvey(survey: Survey): string {
        if (survey.surveyTitle == "") {
            return "Empty survey title";
        }
        if (survey.surveyDescription == "") {
            return "Empty survey description";
        }
        if (survey.sections.length == 0) {
            return "No sections in survey";
        }
        return "";
    }

    public static getResponseRelevance(questionDetails: IResponseRelevanceRequest) {

    }

    public static getClarification(clarificationDetails: IQuestionClarification) {

    }

    public static async getSuvey(surveyId: string) {

    }

    public static async submitResponse(response: Response) {

    }

    public static getSurveyMetrics(surveyId: string) {

    }
}