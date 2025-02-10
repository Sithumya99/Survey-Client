import { Component, Input } from "@angular/core";
import { Column } from "../../Interfaces/BasicInterfaces.interface";
import { CommonModule } from "@angular/common";

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
}