import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { Flow } from "../../Classes/flow.class";
import { GridComponent } from "../grid/grid.component";
import { Column, IDialogModel } from "../../Interfaces/BasicInterfaces.interface";
import { BasicdataFacade } from "../../Facades/Basicdata/BasicdataFacade.facade";

@Component({
    selector: 'app-add-flow',
    standalone: true,
    imports: [
        GridComponent
    ],
    templateUrl: './add-flow.component.html'
})

export class AddFlowComponent implements OnInit {
    @Input()
    addFlowDialogModel: IDialogModel | undefined;
    columns: Column[] = [];

    constructor(private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
        if (this.addFlowDialogModel) {
            let data = this.addFlowDialogModel!.getData();
            this.columns = data.columns;
        }

        BasicdataFacade.getCurrentSurvey$().subscribe(survey => {
            if (survey !== undefined && this.addFlowDialogModel !== undefined) {
                let data = this.addFlowDialogModel!.getData();
                this.columns = [...data.columns];
                this.cdr.detectChanges();
            }
        });
    }

}