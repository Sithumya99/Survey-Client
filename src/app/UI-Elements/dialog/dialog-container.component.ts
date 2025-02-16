import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, Type, ViewChild, ViewEncapsulation } from "@angular/core";
import { dialogContentType, IDialogModel, MediaSize } from "../../Interfaces/BasicInterfaces.interface";
import { Subject } from "rxjs";
import { CommonModule } from "@angular/common";

@Component({
    selector: 'app-dialog',
    standalone: true,
    imports: [
        CommonModule
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
    dialogSize: MediaSize = MediaSize.medium;
    mediaSize = MediaSize;

    private readonly _onClose = new Subject<any>();
    public onClose = this._onClose.asObservable();

    constructor(private componentFactoryResolver: ComponentFactoryResolver, private cd: ChangeDetectorRef, private dialogModel: IDialogModel) {}

    ngAfterViewInit(): void {
        this.cd.detectChanges();
        this.dialog = window.parent.document.body;
        //this.dialog.addEventListener('keydown', this.keydownListener, false);
    }

    ngOnInit(): void {
        const dialogInterface = this.dialogModel.getDialogInterface();
        if (typeof dialogInterface != 'undefined') {
            this.title = dialogInterface.title;
            this.contentType = dialogInterface.contentType;
            if (typeof dialogInterface.size != 'undefined') {
                this.dialogSize = dialogInterface.size;
            } else {
                this.dialogSize = MediaSize.medium;
            } 
            if (typeof dialogInterface.closeEnabled != 'undefined') {
                this.closeEnabled = dialogInterface.closeEnabled;
            } else {
                this.closeEnabled = false;
            }
        }
    }

    ngOnDestroy(): void {
        if (this.componentRef) {
            //this.dialog?.removeEventListener('keydown', this.keydownListener, false);
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
}