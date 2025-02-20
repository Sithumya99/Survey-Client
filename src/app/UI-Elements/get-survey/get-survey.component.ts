import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { BasicdataFacade } from "../../Facades/Basicdata/BasicdataFacade.facade";
import { pages } from "../../Interfaces/BasicInterfaces.interface";

@Component({
    selector: 'app-get-survey',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './get-survey.component.html'
})

export class GetSurveyComponent {
    surveyId: string = "";

    saveChanges(event: Event) {
        let value = (event.target as HTMLInputElement).value;
        this.surveyId = value;
    }

    getSurvey() {
        if (this.surveyId !== "") {
            BasicdataFacade.getSuvey(this.surveyId);
        }
    }
}