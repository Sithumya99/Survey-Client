import { IFlow, IGetSurveyResponse, IResponseInterface, ISection } from "../Interfaces/BasicInterfaces.interface";
import { Flow } from "./flow.class";
import { Section } from "./section.class";
import { Response } from "./response.class";

export class Survey {
    surveyId: string;
    surveyTitle: string = "";
    surveyDescription: string = "";
    owner: string;
    noOfResponses: number = 0;
    sections: Section[] = [];
    responses: Response[] = [];
    flows: Flow[] = [];
    startSection: string = "";
    requiresLogin: boolean = false;

    constructor(surveyId: string, owner: string) {
        this.surveyId = surveyId;
        this.owner = owner;
    }

    setFlows(flows: Flow[]) {
        this.flows = flows;
    }

    copy(copy: IGetSurveyResponse) {
        this.surveyTitle = copy.surveyTitle;
        this.surveyDescription = copy.surveyDescription;
        this.startSection = copy.startSection;
        this.requiresLogin = copy.requiresLogin;

        this.sections = [];
        let jsonSections: ISection[] = copy.sections;
        for (let i = 0; i < jsonSections.length; i++) {
            let section = new Section(this.surveyId, jsonSections[i].sectionId);
            section.copy(jsonSections[i]);
            this.sections.push(section);
        }

        this.responses = [];
        let jsonResponses: IResponseInterface[] = copy.responses;
        for (let i = 0; i < jsonResponses.length; i++) {
            let jsonRes = jsonResponses[i];
            let response = new Response(jsonRes.surveyId, jsonRes.answers);
            this.responses.push(response);
        } 

        this.flows = [];
        let jsonFlows: IFlow[] = copy.flows;
        for (let i = 0; i < jsonFlows.length; i++) {
            let jsonFlow = jsonFlows[i];
            let flow = new Flow(this.surveyId, jsonFlow.flowId, jsonFlow.conditions, jsonFlow.sectionFlow);
            this.flows.push(flow);
        }
    }

    validate() {
        for(let i = 0; i < this.sections.length; i++) {
            this.sections[i].noOfQuestions = this.sections[i].questions.length;
        }
    }
}