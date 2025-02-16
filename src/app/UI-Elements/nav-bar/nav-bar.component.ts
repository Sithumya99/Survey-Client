import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Output } from "@angular/core";
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
    @Output()
    logOut: EventEmitter<boolean> = new EventEmitter();
    username: string = UserProfileFacade.getUser()!.username;

    logout() {
       UserProfileFacade.logOut(); 
       this.logOut.emit(false);
    }
}