import { BehaviorSubject, Observable } from "rxjs";
import { Survey } from "../../Classes/survey.class";
import { CommunicationService } from "../../Services/CommunicationService.service";
import { HttpErrorResponse } from "@angular/common/http";
import { UserProfileFacade } from "../UserProfile/UserProfileFacade.facade";
import { IQuestionClarification, IResponseRelevanceRequest, IUserSurveys, pages } from "../../Interfaces/BasicInterfaces.interface";
import { MessageFacade } from "../Message/MessageFacade.facade";
import { BasicdataFacade } from "./BasicdataFacade.facade";

export class BasicdataImplementation {
    private currentSurvey: BehaviorSubject<Survey | undefined> = new BehaviorSubject<Survey | undefined>(undefined);
    private currentPage: BehaviorSubject<pages> = new BehaviorSubject<pages>(pages.homePage);
    private surveyIds: BehaviorSubject<IUserSurveys[]> = new BehaviorSubject<IUserSurveys[]>([]);

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

    getSurveyIds$(): Observable<IUserSurveys[]> {
        return this.surveyIds.asObservable();
    }

    setSurveyIds$(surveyIds: IUserSurveys[]) {
        this.surveyIds.next(surveyIds);
    }

    saveSurvey(survey: Survey): Promise<void> {
        return new Promise((resolve, reject) => {
            CommunicationService.http.postFromSurveyServer("createsurvey", {username: UserProfileFacade.getUser()!.username, ...survey}).subscribe(
                async (result) => {
                    UserProfileFacade.getUser()!.surveys.push(result.surveyId); //returns id of newly created survey
                    this.setSurveyIds$(UserProfileFacade.getUser()!.surveys);
                    MessageFacade.setInfoMsg$("Survey created!");
                    BasicdataFacade.setCurrentPage$(pages.profilePage);
                    resolve(result);
                },
                async (err: HttpErrorResponse) => {
                    MessageFacade.setErrorMsg$(err.error.message);
                    BasicdataFacade.setCurrentPage$(pages.profilePage);
                    reject(err);
                }
            )
        });
    }

    getSurvey(surveyId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            CommunicationService.http.postFromSurveyServer("getsurvey", { username: UserProfileFacade.getUser()!.username, surveyId}).subscribe(
                async (result) => {
                    if ((!result.requiresLogin) || (result.requiresLogin && UserProfileFacade.getUser())) {
                        BasicdataFacade.setCurrentPage$(pages.chatbotPage);
                    } else {
                        BasicdataFacade.setCurrentPage$(pages.loginPage);
                    }
                    resolve(result);
                },
                async (err: HttpErrorResponse) => {
                    MessageFacade.setErrorMsg$(err.error.message);
                    reject(err);
                }
            )
        });
    }

    submitResponse(response: Response): Promise<void> {
        return new Promise((resolve, reject) => {
            CommunicationService.http.postFromSurveyServer("submitresponse", {username: UserProfileFacade.getUser()!.username, response}).subscribe(
                async (result) => {
                    MessageFacade.setInfoMsg$("Response is submitted!")
                    resolve(result);
                },
                async (err: HttpErrorResponse) => {
                    MessageFacade.setErrorMsg$(err.error.message);
                    reject(err);
                }
            )
        });
    }

    getSurveyMetrics(surveyId: string): Promise<void> {
        return new Promise((resolve, reject) => {
            CommunicationService.http.postFromSurveyServer("getsurveydetails", {username: UserProfileFacade.getUser()!.username, surveyId}).subscribe(
                async (result) => {
                    resolve(result);
                },
                async (err: HttpErrorResponse) => {
                    MessageFacade.setErrorMsg$(err.error.message);
                    reject(err);
                }
            )
        });
    }
}