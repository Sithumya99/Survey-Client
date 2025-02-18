import { Component, Input } from "@angular/core";
import { Column, ConditionInterface } from "../../Interfaces/BasicInterfaces.interface";
import { CommonModule } from "@angular/common";
import { BasicdataFacade } from "../../Facades/Basicdata/BasicdataFacade.facade";
import { AddFlowSectionDialogModel } from "../add-flow-section/AddFlowSectionDialogModel.model";
import { DialogFacade } from "../../Facades/Dialog/DialogFacade.facade";

@Component({
    selector: 'app-grid',
    imports: [
        CommonModule
    ],
    standalone: true,
    templateUrl: './grid.component.html',
    styleUrl: './grid.component.scss'
})

export class GridComponent {
    @Input()
    columns: Column[] = [];

    onSectionClicked(column: Column) {
        let addFlowSectionDlg = new AddFlowSectionDialogModel(column);
        DialogFacade.open(addFlowSectionDlg);
    }
}