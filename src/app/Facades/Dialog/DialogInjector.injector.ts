import { InjectFlags, InjectionToken, Injector, Type } from "@angular/core";

export class DialogInjector implements Injector {
    constructor(private _parentInjector: Injector, private _additionalTokens: WeakMap<any, any>) {}

    get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T, flags?: InjectFlags): T;
    get(token: any, notFoundValue?: any): any;
    get(token: any, notFoundValue?: any, flags?: any) {
        const value = this._additionalTokens.get(token);
        if (value)
            return value;
        return this._parentInjector.get<any>(token, notFoundValue);
    }
}