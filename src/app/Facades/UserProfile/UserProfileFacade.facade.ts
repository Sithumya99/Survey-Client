import { User } from "../../Classes/user.class";
import { loginInterface } from "../../Interfaces/BasicInterfaces.interface";
import { UserProfileImplementation } from "./UserProfileImplementation.implementation";

export class UserProfileFacade {
    private static impl: UserProfileImplementation = new UserProfileImplementation();

    public static setAuthToken(token: string) {
        this.impl.setAuthToken(token);
    }

    public static getAuth(): string | undefined {
        return this.impl.getAuthToken();
    }

    public static getIsLoggedIn(): boolean {
        return this.impl.getIsLoggedIn();
    }

    public static getUser(): User | undefined {
        return this.impl.getUser();
    }

    public static login(userDetails: loginInterface) {
        this.impl.login(userDetails);
    }

    public static register(userDetails: loginInterface) {
        this.impl.register(userDetails);
    }

    public static logOut() {
        this.impl.logOut();
    }
}