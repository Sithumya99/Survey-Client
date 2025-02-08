import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { UserProfileFacade } from "../../Facades/UserProfile/UserProfileFacade.facade";

@Component({
    selector: 'app-nav-bar',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './nav-bar.component.html'
})

export class NavBarComponent {
    username: string = UserProfileFacade.getUser()!.username;

    logout() {}
}