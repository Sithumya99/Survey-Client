import { Observable } from "rxjs";
import { Flow } from "../../Classes/flow.class";
import { Survey } from "../../Classes/survey.class";
import { Column, IQuestionClarification, IResponseRelevanceRequest, IUserSurveys, pages } from "../../Interfaces/BasicInterfaces.interface";
import { UserProfileFacade } from "../UserProfile/UserProfileFacade.facade";
import { BasicdataImplementation } from "./BasicdataImplementation.implementation";
import { Section } from "../../Classes/section.class";
import { MessageFacade } from "../Message/MessageFacade.facade";
import { Question } from "../../Classes/question.class";

export class BasicdataFacade {

    private static impl: BasicdataImplementation = new BasicdataImplementation();

    public static getSectionById(sectionId: number): Section | undefined {
        let survey = this.impl.getCurrentSurvey();
        return survey!.sections.find(s => s.sectionId == sectionId);
    }

    public static reloadSurvey() {
        let survey = this.impl.getCurrentSurvey();
        if (survey !== undefined) {
            this.impl.setCurrentSurvey$(survey);
        }
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
            return survey!.flows[survey!.flows.length - 1].flowId + 1;
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

    public static getSurveyIds$(): Observable<IUserSurveys[]> {
        return this.impl.getSurveyIds$();
    }

    public static setSurveyIds$(surveys: IUserSurveys[]) {
        this.impl.setSurveyIds$(surveys);
    }

    public static addFlow(flow: Flow) {
        let survey = this.impl.getCurrentSurvey();
        survey!.flows.push(flow);
        this.impl.setCurrentSurvey$(survey!);
    }

    public static createNewSurvey() {
        let userId = UserProfileFacade.getUser()!.id;
        let username = UserProfileFacade.getUser()!.username;
        let newSurveyId = UserProfileFacade.getUser()!.surveys.length == 0 ? 1: UserProfileFacade.getUser()!.surveys.length + 1;
        let newSurvey: Survey = new Survey(username + 'Sur' + newSurveyId, userId);
        this.impl.setCurrentSurvey$(newSurvey);
    }

    public static addSection(survey: Survey): Section {
        let sectionId: number = 1;
        if (survey.sections.length > 0) {
            sectionId = survey.sections[survey.sections.length - 1].sectionId + 1;
        }
        let newSection: Section = new Section(survey.surveyId, sectionId);
        return newSection;
    }

    public static addSectionToSurvey(section: Section) {
        let survey = this.impl.getCurrentSurvey()!;
        survey.sections.push(section);
        if (survey.startSection == '') {
            survey.startSection = section.sectionId.toString();
        }
    }

    public static addFlows(flowPaths: Flow[]) {
        let survey = this.impl.getCurrentSurvey()!;
        survey.setFlows(flowPaths);
        this.impl.setCurrentSurvey$(survey);
    }

    public static async saveSurvey() {
        let survey: Survey = this.impl.getCurrentSurvey()!;
        if (this.validateSurvey(survey)) {
            survey.validate();
            await this.impl.saveSurvey(survey);
        }
    }

    public static addQuestion(section: Section, type: string) {
        let questionId = 1;
        if (section.questions.length > 0) questionId = section.questions.length + 1;
        section.questions.push(new Question(section.sectionId, section.surveyId, questionId, type));
    }

    private static validateSurvey(survey: Survey): boolean {
        if (survey.surveyTitle == "") {
            MessageFacade.setErrorMsg$("Empty survey title");
            return false;
        }
        if (survey.surveyDescription == "") {
            MessageFacade.setErrorMsg$("Empty survey description");
            return false;
        }
        if (survey.sections.length == 0) {
            MessageFacade.setErrorMsg$("No sections in survey");
            return false;
        }
        if (survey.startSection == "") {
            MessageFacade.setErrorMsg$("Survey must have a start section");
            return false;
        }
        if (survey.flows.length == 0) {
            MessageFacade.setErrorMsg$("Survey must have atleast one flow");
            return false;
        }
        return true;
    }

    public static async getSuvey(surveyId: string) {
        await this.impl.getSurvey(surveyId);
    }

    public static async getSurveyMetrics(surveyId: string) {
        await this.impl.getSurveyMetrics(surveyId);
    }
}