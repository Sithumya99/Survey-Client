import { Component, Input } from "@angular/core";
import { Section } from "../../Classes/section.class";
import { ConditionInterface } from "../../Interfaces/BasicInterfaces.interface";
import { BasicdataFacade } from "../../Facades/Basicdata/BasicdataFacade.facade";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-add-flow-section',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './add-flow-section.component.html'
})

export class AddFlowSectionComponent {
    @Input()
    sections: Section[] = [];
    @Input()
    parentSection: Section | undefined;
    @Input()
    satisfiedConditions: ConditionInterface[] = [];

    @Input()
    selectedSection: Section | undefined;
    selectedQuestion: number = -1;
    @Input()
    selectedOption: ConditionInterface = { questionNo: -1, answerNo: -1 };

    addSelectedQuestion(index: number) {
        this.selectedQuestion = index;
    }

    isDisable(qNo: number, aNo: number): boolean {
        let existCond = this.satisfiedConditions.find(sc => sc.questionNo == qNo && sc.answerNo == aNo);
        return existCond !== undefined;
    }

    isQuestionSelected(index: number): boolean {
        return this.selectedQuestion == index;
    }

    addSelectedOptions(qNo: number, aNo: number) {
        this.selectedOption = {
            questionNo: qNo,
            answerNo: aNo
        };
    }

    setNextSection(event: Event) {
        this.selectedSection = BasicdataFacade.getSectionById(+(event.target as HTMLSelectElement).value);
    }
}