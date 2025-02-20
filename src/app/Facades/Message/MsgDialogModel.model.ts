import { dialogContentType, IDialogInterface, IDialogModel, MediaSize, messageType } from "../../Interfaces/BasicInterfaces.interface";

export class MsgDialogModel extends IDialogModel {
    dialogInterface: IDialogInterface | undefined;
    message: string;
    type: messageType;

    constructor(msg: string, type: messageType) {
        super();
        this.message = msg;
        this.type = type;
    }

    setDialogInterface(): IDialogInterface {
        let title = "";
        this.type == messageType.info ? title = "Info" : title = "Error";
        return {
            title: title,
            size: MediaSize.small,
            closeEnabled: true,
            contentType: dialogContentType.message,
            commands: []
        };
    }

    public override getDialogInterface(): IDialogInterface {
        if (this.dialogInterface == undefined) {
            this.dialogInterface = this.setDialogInterface();
        }

        return this.dialogInterface;
    }

    public override close(event: string): void {
        this.closeEvent.emit({event});
    }

    public override getData() {
        return {
            message: this.message,
            type: this.type
        };
    }
}