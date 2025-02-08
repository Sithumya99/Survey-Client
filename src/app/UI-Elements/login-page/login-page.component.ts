import { Component } from "@angular/core";
import { loginInterface } from "../../Interfaces/BasicInterfaces.interface";
import { UserProfileFacade } from "../../Facades/UserProfile/UserProfileFacade.facade";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-login-page',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './login-page.component.html'
})

export class LoginPageComponent {
    loginDetails: loginInterface;
    isLogin: boolean = true;

    constructor() {
        this.loginDetails = {
            username: "",
            password: ""
        }
    }

    saveChanges(event: Event, field: string) {
        const inputElm = event.target as HTMLInputElement;
        if (field == 'username') {
            this.loginDetails.username = inputElm.value;
        } else if (field == 'password') {
            this.loginDetails.password = inputElm.value;
        }
    }

    toggleForm() {
        this.isLogin = !this.isLogin;
    }

    loginUser() {
        UserProfileFacade.login(this.loginDetails);
    }

    registerUser() {
        UserProfileFacade.register(this.loginDetails);
    }
}