import { Component } from "@angular/core";
import { Survey } from "../../Classes/survey.class";
import { BasicdataFacade } from "../../Facades/Basicdata/BasicdataFacade.facade";
import { Section } from "../../Classes/section.class";
import { CommonModule } from "@angular/common";
import { NewSectionDialogModel } from "./NewSectionDialogModel.model";
import { DialogFacade } from "../../Facades/Dialog/DialogFacade.facade";
import { NewFlowDialogModel } from "./NewFlowDialogModel.model";

@Component({
    selector: 'app-new-survey',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './new-survey.component.html'
})

export class NewSurveyComponent {
    survey: Survey | undefined;

    constructor() {
        BasicdataFacade.getCurrentSurvey$().subscribe(survey => {
            this.survey = survey;
        });
    }

    setLoginRequired(event: Event) {
        let isChecked: boolean = (event.target as HTMLInputElement).checked;
        this.survey!.requiresLogin = isChecked;
    }

    addSection() {
        let newSection: Section = BasicdataFacade.addSection(this.survey!);
        let addSectionDlg = new NewSectionDialogModel(newSection);
        DialogFacade.open(addSectionDlg);
    }

    addFlows() {
        let addFlowsDlg = new NewFlowDialogModel(this.survey!.flows);
        DialogFacade.open(addFlowsDlg);
    }

    createSurvey() {
        BasicdataFacade.saveSurvey();
    }
}