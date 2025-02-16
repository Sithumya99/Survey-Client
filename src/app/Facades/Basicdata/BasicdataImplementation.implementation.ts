import { BehaviorSubject, Observable } from "rxjs";
import { Survey } from "../../Classes/survey.class";
import { CommunicationService } from "../../Services/CommunicationService.service";
import { HttpErrorResponse } from "@angular/common/http";
import { UserProfileFacade } from "../UserProfile/UserProfileFacade.facade";
import { IQuestionClarification, IResponseRelevanceRequest, pages } from "../../Interfaces/BasicInterfaces.interface";

export class BasicdataImplementation {
    private currentSurvey: BehaviorSubject<Survey | undefined> = new BehaviorSubject<Survey | undefined>(undefined);
    private currentPage: BehaviorSubject<pages> = new BehaviorSubject<pages>(pages.homePage);
    private surveyIds: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

    getCurrentSurvey$(): Observable<Survey | undefined> {
        return this.currentSurvey.asObservable();
    }

    setCurrentSurvey$(survey: Survey) {
        this.currentSurvey.next(survey);
    }

    getCurrentSurvey(): Survey | undefined {
        return this.currentSurvey.value;
    }

    getCurrentPage$(): Observable<pages> {
        return this.currentPage.asObservable();
    }

    setCurrentPage$(currentPage: pages) {
        this.currentPage.next(currentPage);
    }

    getSurveyIds$(): Observable<string[]> {
        return this.surveyIds.asObservable();
    }

    setSurveyIds$(surveyIds: string[]) {
        this.surveyIds.next(surveyIds);
    }

    saveSurvey(survey: Survey): Promise<void> {
        return new Promise((resolve, reject) => {
            CommunicationService.http.postFromSurveyServer("createsurvey", survey).subscribe(
                async (result) => {
                    UserProfileFacade.getUser()!.surveys.push(result); //returns id of newly created survey
                    this.setSurveyIds$(UserProfileFacade.getUser()!.surveys);
                    resolve(result);
                },
                async (err: HttpErrorResponse) => {
                    reject(err);
                }
            )
        });
    }

    getResponseEvaluation(questionDetails: IResponseRelevanceRequest): Promise<void> {
        return new Promise((resolve, reject) => {
            CommunicationService.http.postFromSurveyServer("getresponseevaluation", questionDetails).subscribe(
                async (result) => {
                    resolve(result);
                },
                async (err: HttpErrorResponse) => {
                    reject(err);
                }
            )
        });
    }

    getClarification(clarificationDetails: IQuestionClarification): Promise<void> {
        return new Promise((resolve, reject) => {
            CommunicationService.http.postFromSurveyServer("getclarification", clarificationDetails).subscribe(
                async (result) => {
                    resolve(result);
                },
                async (err: HttpErrorResponse) => {
                    reject(err);
                }
            )
        });
    }

    getSurvey(surveyId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            CommunicationService.http.postFromSurveyServer("getsurvey", surveyId).subscribe(
                async (result) => {
                    resolve(result);
                },
                async (err: HttpErrorResponse) => {
                    reject(err);
                }
            )
        });
    }

    submitResponse(response: Response): Promise<void> {
        return new Promise((resolve, reject) => {
            CommunicationService.http.postFromSurveyServer("submitresponse", response).subscribe(
                async (result) => {
                    resolve(result);
                },
                async (err: HttpErrorResponse) => {
                    reject(err);
                }
            )
        });
    }

    getSurveyMetrics(surveyId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            CommunicationService.http.postFromSurveyServer("getsurveydetails", surveyId).subscribe(
                async (result) => {
                    resolve(result);
                },
                async (err: HttpErrorResponse) => {
                    reject(err);
                }
            )
        });
    }
}