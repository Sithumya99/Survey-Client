import { BehaviorSubject, Observable } from "rxjs";

export class MessageImplementation {
    private infoMsg: BehaviorSubject<string> = new BehaviorSubject<string>("");
    private errorMsg: BehaviorSubject<string> = new BehaviorSubject<string>("");

    getInfoMessage$(): Observable<string> {
        return this.infoMsg.asObservable();
    }

    setInfoMessage$(msg: string) {
        this.infoMsg.next(msg);
    }

    getErrorMsg$(): Observable<string> {
        return this.errorMsg.asObservable();
    }

    setErrorMsg$(msg: string) {
        this.errorMsg.next(msg);
    }
}