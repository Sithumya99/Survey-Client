import { HttpErrorResponse } from "@angular/common/http";
import { User } from "../../Classes/user.class";
import { loginInterface, pages } from "../../Interfaces/BasicInterfaces.interface";
import { CommunicationService } from "../../Services/CommunicationService.service";
import { BasicdataFacade } from "../Basicdata/BasicdataFacade.facade";

export class UserProfileImplementation {
    private authToken: string | undefined;
    private isLoggedIn: boolean = false;
    private user: User | undefined;
    
    constructor() {}

    setAuthToken(authToken: string) {
        this.authToken = authToken;
    }

    getAuthToken(): string | undefined {
        return this.authToken;
    }

    getIsLoggedIn(): boolean {
        return this.isLoggedIn;
    }

    getUser(): User | undefined {
        return this.user;
    }

    logOut() {
        this.user = undefined;
        this.isLoggedIn = false;
        this.authToken = "";
    }

    login(userDetails: loginInterface): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            CommunicationService.http.postFromSurveyServer("login", userDetails).subscribe(
                async (result) => {
                    this.user = new User(result);
                    BasicdataFacade.setSurveyIds$(result.surveys);
                    BasicdataFacade.setCurrentPage$(pages.profilePage);
                    this.isLoggedIn = true;
                    resolve(result);
                },
                async (err: HttpErrorResponse) => {
                    reject(err);
                }
            );
        });
    }

    register(userDetails: loginInterface) {
        return new Promise<void>((resolve, reject) => {
            CommunicationService.http.postFromSurveyServer("register", userDetails).subscribe(
                async (result) => {
                    this.user = new User(result);
                    BasicdataFacade.setSurveyIds$([]);
                    BasicdataFacade.setCurrentPage$(pages.profilePage);
                    this.isLoggedIn = true;
                    resolve(result);
                },
                async (err: HttpErrorResponse) => {
                    reject(err);
                }
            )
        });
    }
}