import { Component } from "@angular/core";
import { Flow } from "../../Classes/flow.class";
import { GridComponent } from "../grid/grid.component";
import { Column } from "../../Interfaces/BasicInterfaces.interface";

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

    addFlow() {}

    getColumn(): Column[] {
        let columns: Column[] = [
            { 
                id: 0,
                children: [
                    {
                        id: 1,
                        children: [
                            { id: 1, children: [{ id: 1 , children: []}] },
                            { id: 2, children: [{ id: 1 , children: []}] }
                        ]
                    },
                    {
                        id: 2,
                        children: [{ id: 1 , children: [
                            { id: 1, children: [
                                { id: 1, children: [{id: 1, children:[]}]},
                                { id: 2, children: [{id: 1, children:[]}]}
                            ]}
                        ]}]
                    },
                    {
                        id: 3,
                        children: [
                            { id: 1, children: [
                                { id: 1 , children: [{id: 1, children:[]}]}, 
                                { id: 2 , children: [{id: 1, children:[]}]}] }
                        ]
                    }
                ]
            }
        ];
        return columns;
    }
}