import { Component, EventEmitter } from "@angular/core";
import { DialogCloseEvent, IDialogInterface, IDialogModel, MediaSize, pages } from "../../Interfaces/BasicInterfaces.interface";
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

@Component({
    selector: 'app-survey-application',
    imports: [
        CommonModule,
        NavBarComponent,
        HomePageComponent,
        LoginPageComponent,
        AddFlowComponent,
        ProfilePageComponent,
        NewSurveyComponent
    ],
    templateUrl: './survey-application.component.html',
    standalone: true
})

export class SurveyApplicationComponent {
    pageEnum = pages;
    currentPage: pages = pages.homePage;
    isLoggedIn: boolean = UserProfileFacade.getIsLoggedIn();

    constructor() {
        // class TestDialogModel extends IDialogModel {

        //     constructor() {
        //         super();
        //     }

        //     public override getDialogInterface(): IDialogInterface {
        //         return this.createDialog();
        //     }

        //     public override close(event: string): void {
        //         this.closeEvent.emit({event});
        //     }

        //     public createDialog(): IDialogInterface {
        //         return {
        //             title: 'Test',
        //             size: MediaSize.medium,
        //             commands: [],
        //             closeEnabled: true
        //         };
        //     }
        // }

        // DialogFacade.open(new TestDialogModel());

        BasicdataFacade.getCurrentPage$().subscribe((page: pages) => {
            this.currentPage = page;
        })
    }

    logOut() {
        this.isLoggedIn = false;
        BasicdataFacade.setCurrentPage$(pages.homePage);
    }
}