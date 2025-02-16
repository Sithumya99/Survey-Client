import { Observable } from "rxjs";
import { Flow } from "../../Classes/flow.class";
import { Survey } from "../../Classes/survey.class";
import { Column, IQuestionClarification, IResponseRelevanceRequest, pages } from "../../Interfaces/BasicInterfaces.interface";
import { UserProfileFacade } from "../UserProfile/UserProfileFacade.facade";
import { BasicdataImplementation } from "./BasicdataImplementation.implementation";
import { Section } from "../../Classes/section.class";

export class BasicdataFacade {

    private static impl: BasicdataImplementation = new BasicdataImplementation();

    public static mapFlowsToColumns(flows: Flow[]): Column[] {
        const root: Column = {
            id: 1,
            section: flows[0].sectionFlow[0],
            children: []
        };
        let columns: Column[] = [root];

        flows.forEach((flow) => {
            let currentLevel = root.children;

            for( let i = 1; i < flow.sectionFlow.length; i++) {
                let sectionId = flow.sectionFlow[i];

                let existingColumn: Column | undefined = currentLevel.find(col => col.section == sectionId);

                if (!existingColumn) {
                    existingColumn = {
                        id: flow.flowId,
                        section: sectionId,
                        children: []
                    };
                    currentLevel.push(existingColumn);
                }

                currentLevel = existingColumn.children;
            }
        });

        return columns;
    }

    public static mapColumnsToFlows(columns: Column[]): Flow[] {
        let flows: Flow[] = [];
        let flowIdCounter: number = 1;

        for (let column of columns) {
            this.traverseColumns(column, [], flows, flowIdCounter);
        }

        return flows;
    }

    public static traverseColumns(column: Column, path: string[], flows: Flow[], flowId: number) {
        let newPath = [...path, column.section];

        if (column.children.length == 0) {
            flows.push(new Flow(0, 1, flowId, [], newPath));
            flowId++;
        } else {
            for (let child of column.children) {
                this.traverseColumns(child, newPath, flows, flowId);
            }
        }
    }

    public static getCurrentSurvey$(): Observable<Survey | undefined> {
        return this.impl.getCurrentSurvey$();
    }

    public static setCurrentSurvey$(survey: Survey) {
        this.impl.setCurrentSurvey$(survey);
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
        survey.sections.push(newSection);
        return newSection;
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