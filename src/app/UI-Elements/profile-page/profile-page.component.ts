import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { BasicdataFacade } from "../../Facades/Basicdata/BasicdataFacade.facade";
import { IUserSurveys, pages } from "../../Interfaces/BasicInterfaces.interface";

@Component({
    selector: 'app-profile-page',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './profile-page.component.html'
})

export class ProfilePageComponent {
    surveys: IUserSurveys[] = [];

    constructor() {
        BasicdataFacade.getSurveyIds$().subscribe(surveyIds => {
            this.surveys = surveyIds;
        });
    }

    createSurvey() {
        BasicdataFacade.createNewSurvey();
        BasicdataFacade.setCurrentPage$(pages.newSurveyPage);
    }

    respondSurvey() {
        BasicdataFacade.setCurrentPage$(pages.getSurveyPage);
    }

    goToDashboard(surveyId: string) {
        BasicdataFacade.getSurveyMetrics(surveyId);
    }
}