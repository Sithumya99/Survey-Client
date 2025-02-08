import { HttpErrorResponse } from "@angular/common/http";
import { User } from "../../Classes/user.class";
import { loginInterface } from "../../Interfaces/BasicInterfaces.interface";
import { CommunicationService } from "../../Services/CommunicationService.service";

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

    login(userDetails: loginInterface): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            CommunicationService.http.postFromSurveyServer("login", userDetails).subscribe(
                async (result) => {
                    this.user = new User(result);
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