import { Component, Input } from "@angular/core";
import { Flow } from "../../Classes/flow.class";
import { GridComponent } from "../grid/grid.component";
import { Column } from "../../Interfaces/BasicInterfaces.interface";
import { BasicdataFacade } from "../../Facades/Basicdata/BasicdataFacade.facade";

@Component({
    selector: 'app-add-flow',
    standalone: true,
    imports: [
        GridComponent
    ],
    templateUrl: './add-flow.component.html'
})

export class AddFlowComponent {
    @Input()
    columns: Column[] = [];

    constructor() {}

    getColumn(): Column[] {
        return this.columns;
    }
}