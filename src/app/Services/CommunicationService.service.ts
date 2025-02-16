import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { map, Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { UserProfileFacade } from "../Facades/UserProfile/UserProfileFacade.facade";
import { DialogFacade } from "../Facades/Dialog/DialogFacade.facade";


@Injectable({
    providedIn: 'root'
})

export class CommunicationService {
    static http: CommunicationService;
    private httpClient: HttpClient;
    private httpOPtions = {
        headers: new HttpHeaders({
            accept: 'application/json',
            'Content-Type': 'application/json; charset=UTF-8'
        }),
    };

    constructor(httpClient: HttpClient, injector: Injector) {
        CommunicationService.http = this;
        this.httpClient = httpClient;

        DialogFacade.setInjector(injector);
    }

    private extractData(res: HttpResponse<any>) {
        let body = res.body;
        let authHeader = res.headers.get('Authorization');
        if (authHeader) {
            UserProfileFacade.setAuthToken(authHeader);
        }
        return body || {};
    }

    postFromSurveyServer(cmd: string, body: any): Observable<any> {
        const url = `${environment.url}/${cmd}`;
        return this.post(url, body);
    }

    post(url: string, body: any): Observable<any> {
        return this.httpClient.post<any>(`${url}`, body, { ...this.createHttpOptions(), observe: 'response' }).pipe(
            map(this.extractData)
        );
    }

    createHttpOptions(): {headers: HttpHeaders} {
        let headers = this.httpOPtions.headers;
        const auth = UserProfileFacade.getAuth();

        if (auth) {
            headers = headers.set('Authorization', `Bearer ${auth}`);
        }

        return { headers };
    }
}