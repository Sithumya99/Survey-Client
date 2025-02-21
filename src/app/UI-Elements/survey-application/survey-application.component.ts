import { Component, EventEmitter } from "@angular/core";
import { DialogCloseEvent, IDialogInterface, IDialogModel, MediaSize, messageType, pages } from "../../Interfaces/BasicInterfaces.interface";
import { CommonModule } from "@angular/common";
import { NavBarComponent } from "../nav-bar/nav-bar.component";
import { HomePageComponent } from "../home-page/home-page.component";
import { LoginPageComponent } from "../login-page/login-page.component";
import { UserProfileFacade } from "../../Facades/UserProfile/UserProfileFacade.facade";
import { AddFlowComponent } from "../add-flow/add-flow.component";
import { DialogFacade } from "../../Facades/Dialog/DialogFacade.facade";
import { BasicdataFacade } from "../../Facades/Basicdata/BasicdataFacade.facade";
import { ProfilePageComponent } from "../profile-page/profile-page.component";
import { NewSurveyComponent } from "../new-survey/new-survey.component";
import { MessageFacade } from "../../Facades/Message/MessageFacade.facade";
import { MsgDialogModel } from "../../Facades/Message/MsgDialogModel.model";
import { ChatbotComponent } from "../chatbot/chatbot.component";
import { GetSurveyComponent } from "../get-survey/get-survey.component";
import { SurveyDashboardComponent } from "../survey-dashboard/survey-dashboard.component";

@Component({
    selector: 'app-survey-application',
    imports: [
        CommonModule,
        NavBarComponent,
        HomePageComponent,
        LoginPageComponent,
        AddFlowComponent,
        ProfilePageComponent,
        NewSurveyComponent,
        ChatbotComponent,
        GetSurveyComponent,
        SurveyDashboardComponent
    ],
    templateUrl: './survey-application.component.html',
    standalone: true
})

export class SurveyApplicationComponent {
    pageEnum = pages;
    currentPage: pages = pages.homePage;
    isLoggedIn: boolean = false;

    constructor() {
        BasicdataFacade.getCurrentPage$().subscribe((page: pages) => {
            this.currentPage = page;
        })

        UserProfileFacade.getIsLoggedIn$().subscribe(isLogged => {
            this.isLoggedIn = isLogged;
        });

        MessageFacade.getInfoMsg$().subscribe((msg: string) => {
            if (msg.length !== 0) {
                let dialog = new MsgDialogModel(msg, messageType.info);
                DialogFacade.open(dialog);
            }
        });

        MessageFacade.getErrorMsg$().subscribe((error: string) => {
            if (error.length !== 0) {
                let dialog = new MsgDialogModel(error, messageType.error);
                DialogFacade.open(dialog);
            }
        });
    }

    logOut() {
        this.isLoggedIn = false;
        BasicdataFacade.setCurrentPage$(pages.homePage);
    }
}