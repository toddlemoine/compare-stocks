import { AVSearchResult, StockSymbol } from './../types';
import { action, makeObservable, observable, computed, runInAction } from 'mobx';
import { search } from '../api';
import { log } from '../utils';

export class AppStore {
    private maxAllowedStocks: number = 3;
    public pending: boolean = false;
    public error: string = '';
    public searchResults: AVSearchResult[] = [];
    public selectedStocks: AVSearchResult[] = [
        { name: 'Apple', symbol: 'AAPL' },
        // { name: 'Slack', symbol: 'WORK' },
    ];

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
        });
    }

    public get canAddStock() {
        return this.selectedStocks.length < this.maxAllowedStocks;
    }

    public async search(term: string): Promise<void> {
        this.error = '';
        this.pending = true;

        try {
            const results = await search(term);
            runInAction(() => {
                this.searchResults = results;
                this.pending = false;
            });
        } catch (error) {
            log.error(`Error searching for ${term}`, error);
            runInAction(() => {
                this.searchResults = [];
                this.error = 'Error doing search';
                this.pending = false;
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
