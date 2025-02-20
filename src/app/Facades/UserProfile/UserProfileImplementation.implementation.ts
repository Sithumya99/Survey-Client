import { HttpErrorResponse } from "@angular/common/http";
import { User } from "../../Classes/user.class";
import { loginInterface, pages } from "../../Interfaces/BasicInterfaces.interface";
import { CommunicationService } from "../../Services/CommunicationService.service";
import { BasicdataFacade } from "../Basicdata/BasicdataFacade.facade";
import { MessageFacade } from "../Message/MessageFacade.facade";
import { BehaviorSubject, Observable } from "rxjs";

export class UserProfileImplementation {
    private authToken: string | undefined;
    private isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private user: User | undefined;
    
    constructor() {}

    setAuthToken(authToken: string) {
        this.authToken = authToken;
    }

    getAuthToken(): string | undefined {
        return this.authToken;
    }

    getIsLoggedIn$(): Observable<boolean> {
        return this.isLoggedIn.asObservable();
    }

    getUser(): User | undefined {
        return this.user;
    }

    logOut() {
        this.user = undefined;
        this.isLoggedIn.next(false);
        this.authToken = "";
    }

    login(userDetails: loginInterface): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            CommunicationService.http.postFromSurveyServer("login", userDetails).subscribe(
                async (result) => {
                    this.user = new User(result);
                    BasicdataFacade.setSurveyIds$(result.surveys);
                    BasicdataFacade.setCurrentPage$(pages.profilePage);
                    this.isLoggedIn.next(true);
                    resolve(result);
                },
                async (err: HttpErrorResponse) => {
                    MessageFacade.setErrorMsg$(err.error.message);
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
                    this.isLoggedIn.next(true);
                    resolve(result);
                },
                async (err: HttpErrorResponse) => {
                    MessageFacade.setErrorMsg$(err.error.message);
                    reject(err);
                }
            )
        });
    }
}