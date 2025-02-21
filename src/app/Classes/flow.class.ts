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

    doConditionsMatch(flow: Flow, index: number): boolean {
        if (flow.conditions.length - 1 <= index) {
            return false;
        }
        for (let i = 0; i < index; i++) {
            let existingCondition = this.conditions[i + 1];
            let checkCondition = flow.conditions[i + 1];
            let existingSection = this.sectionFlow[i];
            let checkSection = flow.sectionFlow[i];
            if (!(checkCondition.questionNo == existingCondition.questionNo && checkCondition.answerNo == existingCondition.answerNo && existingSection == checkSection)) {
                return false;
            }
        }
        if (this.sectionFlow[index] !== flow.sectionFlow[index]) {
            return false;
        }
        return true;
    }
}