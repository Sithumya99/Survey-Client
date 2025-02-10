import { ConditionInterface } from "../Interfaces/BasicInterfaces.interface";

export class Flow {
    surveyId: number;
    sectionId: number;
    flowId: number;
    conditions: ConditionInterface[];
    sectionFlow: string[];

    constructor(surveyId: number, sectionId: number, flowId: number, conditions: ConditionInterface[], sectionFlow: string[]) {
        this.surveyId = surveyId;
        this.sectionId = sectionId;
        this.flowId = flowId;
        this.conditions = conditions;
        this.sectionFlow = sectionFlow;
    }

    addCondition(condition: ConditionInterface) {
        this.conditions.push(condition);
    }

    addSection(sectionId: string) {
        this.sectionFlow.push(sectionId);
    }
}