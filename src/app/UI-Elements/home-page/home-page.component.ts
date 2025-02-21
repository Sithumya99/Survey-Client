import { Component } from "@angular/core";
import { BasicdataFacade } from "../../Facades/Basicdata/BasicdataFacade.facade";
import { pages } from "../../Interfaces/BasicInterfaces.interface";


@Component({
    selector: 'app-home-page',
    imports: [],
    templateUrl: './home-page.component.html',
    standalone: true
})

export class HomePageComponent {
    constructor() {}

    getStarted() {
        BasicdataFacade.setCurrentPage$(pages.loginPage);
    }

    respond() {
        BasicdataFacade.setCurrentPage$(pages.getSurveyPage);
    }
}