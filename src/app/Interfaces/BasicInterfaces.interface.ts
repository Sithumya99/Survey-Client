export enum pages {
    homePage,
    loginPage
}

export interface userInterface {
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
    children: Column[];
}