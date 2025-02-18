import { Flow } from "../../Classes/flow.class";
import { Section } from "../../Classes/section.class";
import { BasicdataFacade } from "../../Facades/Basicdata/BasicdataFacade.facade";
import { Column, ConditionInterface, dialogContentType, IDialogInterface, IDialogModel, MediaSize } from "../../Interfaces/BasicInterfaces.interface";

export class AddFlowSectionDialogModel extends IDialogModel {
    dialogInterface: IDialogInterface | undefined;
    parentSection: Section;
    currentFlowId: number;
    nextFlowId: number;
    sections: Section[] = [];
    satisfiedConditions: ConditionInterface[] = [];
    selectedCondition: ConditionInterface = { questionNo: -1, answerNo: -1};
    selectedSection: Section | undefined;

    constructor(column: Column) {
        super();

        this.parentSection = column.section;
        this.currentFlowId = column.flows[-1];
        if (column.children.length == 0) {
            this.nextFlowId = this.currentFlowId;
        } else {
            this.nextFlowId = BasicdataFacade.getNextFlowId();
        }
        this.setSatisfiedConditions(column);
        this.setSections(column);
    }

    setDialogInterface(): IDialogInterface {
        return {
            title: "Add Section to Flow",
            size: MediaSize.medium,
            contentType: dialogContentType.addFlowSection,
            commands: [
                {
                    name: "Save and Add",
                    execute: this.save.bind(this)
                }
            ],
            closeEnabled: true
        };
    }

    public override getDialogInterface(): IDialogInterface {
        if (this.dialogInterface == undefined) {
            this.dialogInterface = this.setDialogInterface();
        }

        return this.dialogInterface;
    }

    public override close(event: string): void {
        this.closeEvent.emit({event});
    }

    private setSatisfiedConditions(column: Column) {
        column.children.forEach(child => {
            if (child.condition) {
                this.satisfiedConditions.push(child.condition);
            }
        });
    }

    private setSections(column: Column) {
        let flow = BasicdataFacade.getFlowById(this.currentFlowId);
        let sectionIndex = flow!.sectionFlow.findIndex(sf => sf == this.parentSection.sectionId);
        let existingSections: number[] = [];

        for (let i = 0; i < sectionIndex + 1; i++) {
            existingSections.push(flow!.sectionFlow[i]);
        }

        let allSections = BasicdataFacade.getCurrentSurvey()!.sections;
        allSections.forEach(section => {
            if (existingSections.find(ex => ex == section.sectionId) == undefined) {
                this.sections.push(section);
            }
        });
    }

    private save() {
        if (this.selectedSection == undefined) {
            //set error
        } else {
            if (this.nextFlowId == this.currentFlowId) {
                //leaf node -> add to same flow
                let flow = BasicdataFacade.getFlowById(this.currentFlowId);
                flow!.extendFlow(this.selectedCondition, this.selectedSection!.sectionId);
            } else {
                //new leaf -> create new flow
                let flow = BasicdataFacade.getFlowById(this.currentFlowId); //to copy necessary from existing
                let currentSectionIndex = flow!.sectionFlow.findIndex(sf => sf == this.parentSection.sectionId);
    
                let copyConditions = flow!.conditions.slice(0, currentSectionIndex + 1);
                copyConditions.push(this.selectedCondition);
                let copySectionFlow = flow!.sectionFlow.slice(0, currentSectionIndex + 1);
                copySectionFlow.push(this.selectedSection!.sectionId);
    
                let newFlow = new Flow(flow!.surveyId, this.nextFlowId, copyConditions, copySectionFlow);
                BasicdataFacade.addFlow(newFlow);
            }
        }
    }

    public override getData() {
        return {
            parentSection: this.parentSection,
            sections: this.sections,
            satisfiedConditions: this.satisfiedConditions,
            selectedCondition: this.selectedCondition,
            selectedSection: this.selectedSection
        };
    }
}