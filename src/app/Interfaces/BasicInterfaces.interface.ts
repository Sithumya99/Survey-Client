import { EventEmitter } from "@angular/core";
import { Section } from "../Classes/section.class";
import { Question } from "../Classes/question.class";

export enum pages {
    homePage,
    loginPage,
    profilePage,
    newSurveyPage,
    chatbotPage,
    getSurveyPage,
    surveyDashboardPage
}

export enum dialogContentType {
    addSection,
    addFlow,
    addFlowSection,
    message
}

export enum messageType {
    error,
    info
}

export interface userInterface {
    id: string;
    username: string;
    surveys: IUserSurveys[];
}

export interface loginInterface {
    username: string;
    password: string;
}

export interface ConditionInterface {
    questionNo: number;
    answerNo: number;
}

export interface Column {
    section: Section;
    flows: number[];
    condition?: ConditionInterface;
    children: Column[];
}

export enum MediaSize {
    small,
    medium,
    large
}

export interface DialogCloseEvent {
    event: string
}

export abstract class IDialogModel {
    public closeEvent: EventEmitter<DialogCloseEvent> = new EventEmitter<DialogCloseEvent>();
    public abstract getDialogInterface(): IDialogInterface;
    public abstract close(event: string): void;
    public abstract getData(): any;
    public update?(field: string, value: any): void;
}

export interface IUserSurveys {
    id: string;
    surveyId: string;
    surveyTitle: string;
}

export interface IDialogInterface {
    title: string;
    size: MediaSize;
    contentType: dialogContentType;
    commands: ICommand[];
    closeEnabled: boolean;
}

export interface IQuestionOptions {
    option: string;
    percentage: number;
}

export interface IConnectedFlow {
    flowId: number;
    condition: ConditionInterface;
}

export interface IResponseRelevanceRequest {
    context: string;
    question: string;
    userResponse: string;
}

export interface IQuestionClarification {
    systemQuestion: string;
    userQuestion: string;
}

export interface ICommand {
    name: string;
    execute?(): void;
}

export interface IChat {
    role: Role,
    content: string | Question;
}

export enum Role {
    user,
    bot
}

export interface IGetSurveyResponse {
    responses: IResponseInterface[];
    surveyId: string;
    surveyTitle: string;
    surveyDescription: string;
    owner: string;
    noOfResponses: number;
    sections: ISection[];
    flows: IFlow[];
    requiresLogin: boolean;
    startSection: string;
}

export interface ISection {
    surveyId: string;
    sectionId: number;
    sectionTitle: string;
    sectionDescription: string;
    noOfQuestions: number;
    questions: IQuestion[];
}

export interface IQuestion {
    surveyId: string;
    sectionId: number;
    questionId: number;
    questionString: string;
    questionType: string;
    options: IQuestionOptions[];
    noOfResponses: number;
}

export interface IFlow {
    surveyId: string;
    flowId: number;
    conditions: ConditionInterface[];
    sectionFlow: number[];
}

export interface IResponseInterface {
    surveyId: string;
    answers: IResponse[];
}

export interface IResponse {
    sectionId: number;
    questionId: number;
    answer: string;
}

export interface IPieChart {
    name: string;
    value: number;
}