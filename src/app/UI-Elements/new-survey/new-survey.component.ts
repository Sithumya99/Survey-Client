import { Component } from "@angular/core";
import { Survey } from "../../Classes/survey.class";
import { BasicdataFacade } from "../../Facades/Basicdata/BasicdataFacade.facade";
import { Section } from "../../Classes/section.class";
import { CommonModule } from "@angular/common";
import { NewSectionDialogModel } from "./NewSectionDialogModel.model";
import { DialogFacade } from "../../Facades/Dialog/DialogFacade.facade";
import { NewFlowDialogModel } from "./NewFlowDialogModel.model";
import { Flow } from "../../Classes/flow.class";

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
    sections: Section[] = [];

    constructor() {
        BasicdataFacade.getCurrentSurvey$().subscribe(survey => {
            this.survey = survey;
            this.sections = survey!.sections;
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

    setStartSection(event: Event) {
        let start = (event.target as HTMLSelectElement).value;
        this.survey!.startSection = start;
    }

    setSurvey(event: Event, field: string) {
        let value = (event.target as HTMLInputElement).value;
        if (field == 'title') {
            this.survey!.surveyTitle = value;
        } else if (field == 'description') {
            this.survey!.surveyDescription = value;
        }
    }

    addFlows() {
        if (this.survey!.flows.length == 0) {
            this.survey!.flows.push(new Flow(this.survey!.surveyId, 1, [{questionNo: -1, answerNo: -1}], [+this.survey!.startSection]));
        }
        let addFlowsDlg = new NewFlowDialogModel(this.survey!.flows);
        DialogFacade.open(addFlowsDlg);
    }

    createSurvey() {
        BasicdataFacade.saveSurvey();
    }
}