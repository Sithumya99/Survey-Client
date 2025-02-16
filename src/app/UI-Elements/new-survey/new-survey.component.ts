import { Component } from "@angular/core";
import { Survey } from "../../Classes/survey.class";
import { BasicdataFacade } from "../../Facades/Basicdata/BasicdataFacade.facade";
import { Section } from "../../Classes/section.class";
import { CommonModule } from "@angular/common";

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
        //open dialog with new section
    }

    addFlows() {
        //open dialog with add-flow component
    }
}