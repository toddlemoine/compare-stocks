import { AVSearchResult, StockSymbol } from './../types';
import { action, makeObservable, observable, computed, runInAction } from 'mobx';
import { search } from '../api';
import { log } from '../utils';

enum AppStoreState {
    INITIAL,
    LOADING,
    FULFILLED,
    ERROR,
}
export class AppStore {
    private maxAllowedStocks: number = 3;
    public pending: boolean = false;
    public error: string = '';
    public searchResults: AVSearchResult[] = [];
    public selectedStocks: AVSearchResult[] = [
        { name: 'Apple', symbol: 'AAPL' },
        // { name: 'Slack', symbol: 'WORK' },
    ];

    public state: AppStoreState = AppStoreState.INITIAL;

    constructor() {
        makeObservable(this, {
            pending: observable,
            error: observable,
            searchResults: observable,
            selectedStocks: observable,
            search: action,
            addStock: action,
            removeStock: action,
            canAddStock: computed,
            state: observable,
            loading: computed,
        });
    }

    public get canAddStock() {
        return this.selectedStocks.length < this.maxAllowedStocks;
    }

    public get loading() {
        return this.state === AppStoreState.LOADING;
    }

    public async search(term: string): Promise<void> {
        this.state = AppStoreState.LOADING;

        try {
            const results = await search(term);
            runInAction(() => {
                this.searchResults = results;
                this.state = AppStoreState.FULFILLED;
            });
        } catch (error) {
            log.error(`Error searching for ${term}`, error);
            runInAction(() => {
                this.searchResults = [];
                this.state = AppStoreState.ERROR;
                this.error = 'Error doing search';
            });
        }
    }

    public addStock(symbol: StockSymbol) {
        const result = this.searchResults.find(r => r.symbol === symbol);
        if (result) {
            this.selectedStocks.push(result);
        }
    }

    public removeStock(index: number) {
        this.selectedStocks.splice(index, 1);
    }
}
