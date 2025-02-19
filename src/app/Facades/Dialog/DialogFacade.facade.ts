import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Injectable, Injector } from "@angular/core";
import { DialogComponent } from "../../UI-Elements/dialog/dialog-container.component";
import { DialogCloseEvent, IDialogModel } from "../../Interfaces/BasicInterfaces.interface";
import { DialogInjector } from "./DialogInjector.injector";

@Injectable({
    providedIn: 'root'
})

export class DialogFacade {
    private static dialogComponentsRef: ComponentRef<DialogComponent>[] = [];
    private static injector: Injector;

    public static open(dialogModel: IDialogModel): Promise<DialogCloseEvent> {
        return this.appendDialog(dialogModel);
    }

    private static appendDialog(model: IDialogModel): Promise<DialogCloseEvent> {
        const componentFactoryResolver = this.injector.get(ComponentFactoryResolver);
        const appRef: ApplicationRef = this.injector.get(ApplicationRef);
        const map = new WeakMap();
        map.set(IDialogModel, model);

        const componentFactory = componentFactoryResolver.resolveComponentFactory(DialogComponent);
        const componentRef = componentFactory.create(new DialogInjector(this.injector, map));
        appRef.attachView(componentRef.hostView);

        const domElm = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
        window.parent.document.body.appendChild(domElm);

        this.dialogComponentsRef.push(componentRef);

        return new Promise(function (resolve, reject) {
            let sub = model.closeEvent.subscribe((event) => {
                sub.unsubscribe();
                DialogFacade.removeDialogComponentFromBody();
                resolve(event);
            });
        });
    }

    private static removeDialogComponentFromBody(): void 
    {
        const appRef   : ApplicationRef = this.injector.get(ApplicationRef);

        const latestDialogRef = this.dialogComponentsRef.pop();
        if(typeof latestDialogRef !== 'undefined'){
            appRef.detachView(latestDialogRef.hostView);
            latestDialogRef.destroy();
        }        
    }

    public static setInjector(injector: Injector) {
        this.injector = injector;
    }
}