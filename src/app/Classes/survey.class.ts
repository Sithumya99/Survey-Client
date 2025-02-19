import { Flow } from "./flow.class";
import { Section } from "./section.class";

export class Survey {
    surveyId: string;
    surveyTitle: string = "";
    surveyDescription: string = "";
    owner: string;
    noOfSections: number = 0;
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
}