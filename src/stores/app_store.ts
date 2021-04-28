import { AVSearchResult, StockSymbol } from './../types';
import { action, makeObservable, observable } from 'mobx';
import { search } from '../api';
import { log } from '../utils';

export class AppStore {
    public pending: boolean = false;
    public error: string = '';
    public searchResults: AVSearchResult[] = [];
    public selectedStockSymbols: Set<StockSymbol> = new Set();

    constructor() {
        makeObservable(this, {
            pending: observable,
            error: observable,
            searchResults: observable,
            selectedStockSymbols: observable,
            search: action,
            addStock: action,
        });
    }

    public async search(term: string): Promise<void> {
        this.error = '';
        this.pending = true;

        try {
            const results = await search(term);
            this.searchResults = results;
            this.pending = false;
        } catch (error) {
            log.error(`Error searching for ${term}`, error);
            this.searchResults = [];
            this.error = 'Error doing search';
            this.pending = false;
        }
    }

    public addStock(symbol: StockSymbol) {
        this.selectedStockSymbols.add(symbol);
    }
}
