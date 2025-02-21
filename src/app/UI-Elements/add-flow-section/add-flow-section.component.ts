import { Component, Input, OnInit } from "@angular/core";
import { Section } from "../../Classes/section.class";
import { ConditionInterface, IDialogModel } from "../../Interfaces/BasicInterfaces.interface";
import { BasicdataFacade } from "../../Facades/Basicdata/BasicdataFacade.facade";
import { CommonModule } from "@angular/common";
import { AddFlowSectionDialogModel } from "./AddFlowSectionDialogModel.model";

@Component({
    selector: 'app-add-flow-section',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './add-flow-section.component.html'
})

export class AddFlowSectionComponent implements OnInit {
    sections: Section[] = [];
    parentSection: Section | undefined;
    satisfiedConditions: ConditionInterface[] = [];
    selectedSection: Section | undefined;
    selectedQuestion: number = -1;
    selectedOption: ConditionInterface = { questionNo: -1, answerNo: -1 };
    @Input()
    addFlowSectionDialog: IDialogModel | undefined;

    ngOnInit(): void {
        let data = this.addFlowSectionDialog!.getData();
        this.sections = data.sections;
        this.parentSection = data.parentSection;
        this.satisfiedConditions = data.satisfiedConditions;
        this.selectedSection = data.selectedSection;
        this.selectedOption = data.selectedCondition;
    }

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
            questionNo: qNo + 1,
            answerNo: aNo
        };
        if (this.addFlowSectionDialog!.update !== undefined)
            this.addFlowSectionDialog!.update('selectedCondition', this.selectedOption);
    }

    setNextSection(event: Event) {
        this.selectedSection = BasicdataFacade.getSectionById(+(event.target as HTMLSelectElement).value);
        if (this.addFlowSectionDialog!.update !== undefined)
            this.addFlowSectionDialog!.update('selectedSection', this.selectedSection);
    }
}