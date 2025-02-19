import { IUserSurveys, userInterface } from "../Interfaces/BasicInterfaces.interface";

export class User {
    id: string;
    username: string = "";
    surveys: IUserSurveys[] = [];

    constructor(userDetails: userInterface) {
        this.id = userDetails.id;
        this.username = userDetails.username;
        this.surveys = userDetails.surveys;
    }

    public getSurveyById(index: number): IUserSurveys {
        return this.surveys[index] || "";
    }
}