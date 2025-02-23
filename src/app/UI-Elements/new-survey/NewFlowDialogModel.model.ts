import { Flow } from "../../Classes/flow.class";
import { BasicdataFacade } from "../../Facades/Basicdata/BasicdataFacade.facade";
import { Column, dialogContentType, IDialogInterface, IDialogModel, MediaSize } from "../../Interfaces/BasicInterfaces.interface";

export class NewFlowDialogModel extends IDialogModel {
    dialogInterface: IDialogInterface | undefined;
    flows: Flow[];
    columns: Column[];

    constructor(flow: Flow[]) {
        super();
        this.flows = flow;
        this.columns = BasicdataFacade.mapFlowsToColumns(flow);

        BasicdataFacade.getCurrentSurvey$().subscribe(survey => {
            if (survey !== undefined) {
                this.flows = survey.flows;
                this.columns = BasicdataFacade.mapFlowsToColumns(this.flows);
            }
        });
    }

    public setDialogInterface(): IDialogInterface {
        return {
            title: "Define Flows for Sections",
            closeEnabled: true,
            contentType: dialogContentType.addFlow,
            commands: [],
            size: MediaSize.large
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
            flows: this.flows,
            columns: this.columns
        };
    }
}