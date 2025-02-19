import { Section } from "../../Classes/section.class";
import { BasicdataFacade } from "../../Facades/Basicdata/BasicdataFacade.facade";
import { dialogContentType, IDialogInterface, IDialogModel, MediaSize } from "../../Interfaces/BasicInterfaces.interface";

export class NewSectionDialogModel extends IDialogModel {
    dialogInterface: IDialogInterface | undefined;
    section: Section;

    constructor(newSection: Section) {
        super();
        this.section = newSection;
    }

    public getDialogInterface(): IDialogInterface {
        if (this.dialogInterface == undefined) {
            this.dialogInterface = this.setDialogInterface();
        }

        return this.dialogInterface;
    }

    private setDialogInterface(): IDialogInterface {
        return {
            title: "Add New Section",
            size: MediaSize.medium,
            contentType: dialogContentType.addSection,
            commands: [
                {
                    name: "Add Section",
                    execute: this.saveSection.bind(this)
                }
            ],
            closeEnabled: true
        };
    }

    public override close(event: string): void {
        this.closeEvent.emit({event});
    }

    private saveSection() {
        if (this.section.validate()) {
            BasicdataFacade.addSectionToSurvey(this.section);
            this.close('cancel');
        }
    }

    public override getData() {
        return {
            section: this.section
        };
    }
}