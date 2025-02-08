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