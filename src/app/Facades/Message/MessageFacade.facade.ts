import { Observable } from "rxjs";
import { MessageImplementation } from "./MessageImplementation.implementation";

export class MessageFacade {
    private static impl: MessageImplementation = new MessageImplementation();

    public static getInfoMsg$(): Observable<string> {
        return this.impl.getInfoMessage$();
    }

    public static setInfoMsg$(msg: string) {
        this.impl.setInfoMessage$(msg);
    }

    public static getErrorMsg$(): Observable<string> {
        return this.impl.getErrorMsg$();
    }

    public static setErrorMsg$(msg: string) {
        this.impl.setErrorMsg$(msg);
    }
}