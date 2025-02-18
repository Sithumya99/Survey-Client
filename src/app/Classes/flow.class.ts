import { ConditionInterface } from "../Interfaces/BasicInterfaces.interface";

export class Flow {
    surveyId: string;
    flowId: number;
    conditions: ConditionInterface[];
    sectionFlow: number[];

    constructor(surveyId: string, flowId: number, conditions: ConditionInterface[], sectionFlow: number[]) {
        this.surveyId = surveyId;
        this.flowId = flowId;
        this.conditions = conditions;
        this.sectionFlow = sectionFlow;
    }

    addCondition(condition: ConditionInterface) {
        this.conditions.push(condition);
    }

    addSection(sectionId: number) {
        this.sectionFlow.push(sectionId);
    }

    extendFlow(condition: ConditionInterface, sectionId: number) {
        this.addCondition(condition);
        this.addSection(sectionId);
    }
}