import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Type, ViewChild, ViewEncapsulation } from "@angular/core";
import { dialogContentType, ICommand, IDialogInterface, IDialogModel, MediaSize } from "../../Interfaces/BasicInterfaces.interface";
import { Subject } from "rxjs";
import { CommonModule } from "@angular/common";
import { AddFlowComponent } from "../add-flow/add-flow.component";
import { AddSectionComponent } from "../add-section/add-section.component";
import { AddFlowSectionComponent } from "../add-flow-section/add-flow-section.component";

@Component({
    selector: 'app-dialog',
    standalone: true,
    imports: [
        CommonModule,
        AddFlowComponent,
        AddSectionComponent,
        AddFlowSectionComponent
    ],
    templateUrl: './dialog-container.component.html',
    styleUrl: './dialog-container.component.scss',
    encapsulation: ViewEncapsulation.ShadowDom,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DialogComponent implements AfterViewInit{
    componentRef: ComponentRef<any> | undefined;
    childComponentType: Type<any> | undefined;
    dialog: HTMLElement | undefined;
    title: string = '';
    contentType: dialogContentType | undefined; //change to a message dlg for default later
    closeEnabled: boolean = true;
    commands: ICommand[] = [];
    dialogSize: MediaSize = MediaSize.medium;
    data: any;
    mediaSize = MediaSize;
    dialogComponentType = dialogContentType;

    private readonly _onClose = new Subject<any>();
    public onClose = this._onClose.asObservable();

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private cd: ChangeDetectorRef, private dialogModel: IDialogModel) {}

    ngAfterViewInit(): void {
        this.cd.detectChanges();
        this.dialog = window.parent.document.body;
    }

    ngOnInit(): void {
        const dialogInterface = this.dialogModel.getDialogInterface();
        if (typeof dialogInterface != 'undefined') {
            this.title = dialogInterface.title;
            this.contentType = dialogInterface.contentType;
            this.commands = dialogInterface.commands;
            this.dialogSize = dialogInterface.size; 
            this.closeEnabled = dialogInterface.closeEnabled;
        }
        this.setData();
    }

    setData() {
        this.data = this.dialogModel.getData();
    }

    ngOnDestroy(): void {
        if (this.componentRef) {
            this.componentRef.destroy();
        }
    }

    onDialogClicked(event: MouseEvent): void {
        event.stopPropagation();
    }

    close(): void {
        this.dialogModel.close('cancel');
    }
    
    public refresh() : void {
        this.cd.detectChanges();
    }

    executeCmd(command: ICommand) {
        if (command.execute !== undefined) {
            command.execute();
        } else {
            this.close();
        }
    }
}