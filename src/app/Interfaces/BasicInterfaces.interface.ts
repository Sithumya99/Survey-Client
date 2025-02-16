import { EventEmitter } from "@angular/core";

export enum pages {
    homePage,
    loginPage,
    profilePage,
    newSurveyPage
}

export enum dialogContentType {
    addSection,
    addFlow
}

export interface userInterface {
    id: string;
    username: string;
    surveys: string[];
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
    id: number;
    section: string;
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
}

export interface IDialogInterface {
    title: string;
    size: MediaSize;
    contentType: dialogContentType;
    commands: string[];
    closeEnabled: boolean;
}

export interface IQuestionOptions {
    option: string;
    percentage: number;
}

export interface IConnectedFlow {
    flowId: number;
    condition: string;
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