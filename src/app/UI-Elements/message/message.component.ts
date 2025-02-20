import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { IDialogModel, messageType } from "../../Interfaces/BasicInterfaces.interface";

@Component({
    selector: 'app-message',
    standalone: true,
    imports: [
        CommonModule
    ],
    templateUrl: './message.component.html'
})

export class MessageComponent implements OnInit {
    @Input()
    messageDialog: IDialogModel | undefined;
    message: string = "";
    type: messageType | undefined;

    ngOnInit(): void {
        if (this.messageDialog) {
            let data = this.messageDialog!.getData();
            this.message = data.message;
            this.type = data.type;
        }
    }
}