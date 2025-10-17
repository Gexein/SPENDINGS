import { makeAutoObservable } from "mobx"
import type { Spending } from "../../shared/types/spending";

export class SpendingsStore {
    _spendings: Spending[];

    constructor() {
        this._spendings = []
        makeAutoObservable(this)
    }

    setSpendings(spendings: Spending[]) {
        this._spendings = spendings
    }

    get spendings() {
        return this._spendings
    }
}