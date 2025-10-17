import { makeAutoObservable } from "mobx"
import type { User } from "../../shared/types/user";

export class UserStore {
    _isAuth: boolean;
    _user: User;

    constructor() {
        this._isAuth = false
        this._user = {
            email: '',
            password: '',
            name: '',
            exp: 0,
            iat: 0,
            id: 0,
            role: '',
        }
        makeAutoObservable(this)
    }

    setIsAuth(isAuth: boolean) {
        this._isAuth = isAuth
    }

    setUser(user: User) {
        this._user = user
    }

    get isAuth() {
        return this._isAuth
    }

    get user() {
        return this._user
    }
}