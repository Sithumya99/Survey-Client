import { userInterface } from "../Interfaces/BasicInterfaces.interface";

export class User {
    id: string;
    username: string = "";
    surveys: string[] = [];

    constructor(userDetails: userInterface) {
        this.id = userDetails.id;
        this.username = userDetails.username;
        this.surveys = userDetails.surveys;
    }

    public getSurveyById(index: number): string {
        return this.surveys[index] || "";
    }
}