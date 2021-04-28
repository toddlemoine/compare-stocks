import { StockSymbol } from './../types';
import { action, computed, makeObservable, observable } from 'mobx';
// import { search } from '../api';
// import { log } from '../utils';

enum StockStoreState {
    LOADING,
    FULFILLED,
    ERROR,
}

class StockStore {
    private state: StockStoreState = StockStoreState.LOADING;

    constructor(private readonly symbol: StockSymbol) {
        makeObservable(this, {
            fetchOverview: action,
            loading: computed,
        });
        this.fetchOverview();
    }

    public get loading(): boolean {
        return this.state === StockStoreState.LOADING;
    }

    public get fulfilled(): boolean {
        return this.state === StockStoreState.FULFILLED;
    }

    public get error(): boolean {
        return this.state === StockStoreState.ERROR;
    }

    public async fetchOverview(): Promise<void> {}
}
