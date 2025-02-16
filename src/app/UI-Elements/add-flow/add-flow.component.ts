import { Component } from "@angular/core";
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
    flowPaths: Flow[] = [];
    columns: Column[] = [];

    constructor() {
        BasicdataFacade.getCurrentSurvey$().subscribe(survey => {
            if (survey !== undefined) {
                this.flowPaths = survey.flows;
            }
        });
    }

    getColumn(): Column[] {
        this.columns = BasicdataFacade.mapFlowsToColumns(this.flowPaths);
        return this.columns;
    }

    saveFlows() {
        this.flowPaths = BasicdataFacade.mapColumnsToFlows(this.columns);
        BasicdataFacade.addFlows(this.flowPaths);
    }
}