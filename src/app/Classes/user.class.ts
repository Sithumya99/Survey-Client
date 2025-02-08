import { userInterface } from "../Interfaces/BasicInterfaces.interface";

export class User {
    username: string = "";
    surveys: string[] = [];

    constructor(userDetails: userInterface) {
        this.username = userDetails.username;
        this.surveys = userDetails.surveys;
    }

    public getSurveyById(index: number): string {
        return this.surveys[index] || "";
    }
}