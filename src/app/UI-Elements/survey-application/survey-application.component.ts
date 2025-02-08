import { Component } from "@angular/core";
import { pages } from "../../Interfaces/BasicInterfaces.interface";
import { CommonModule } from "@angular/common";
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { HomePageComponent } from "../home-page/home-page.component";
import { LoginPageComponent } from "../login-page/login-page.component";
import { UserProfileFacade } from "../../Facades/UserProfile/UserProfileFacade.facade";

@Component({
    selector: 'app-survey-application',
    imports: [
        CommonModule,
        NavBarComponent,
        HomePageComponent,
        LoginPageComponent
    ],
    templateUrl: './survey-application.component.html',
    standalone: true
})

export class SurveyApplicationComponent {
    pageEnum = pages;
    currentPage: pages = pages.homePage;
    isLoggedIn: boolean = UserProfileFacade.getIsLoggedIn();

    constructor() {}
}