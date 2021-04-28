import { toDollarCurrency, formatTradingPrice } from './../utils/number_utils';
import { StockSymbol } from './../types';
import { action, computed, makeAutoObservable, observable } from 'mobx';
import { getGlobalQuote } from '../api';

enum StockStoreState {
    LOADING,
    FULFILLED,
    ERROR,
}

export class StockStore {
    public state: StockStoreState = StockStoreState.LOADING;
    public change?: number;
    public changePercent?: number;
    public high?: string;
    public latestTradingDay?: string;
    public low?: string;
    public open?: string;
    public previousClose?: string;
    public price?: string;
    public volume?: string;
    public symbol: string;
    public name: string;

    constructor(symbol: StockSymbol, name: string) {
        this.symbol = symbol;
        this.name = name;

        makeAutoObservable(this, {
            fetchQuote: action,
            loading: computed,
            fulfilled: computed,
            error: computed,
            state: observable,
        });
        this.fetchQuote();
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

    public async fetchQuote(): Promise<void> {
        try {
            const quote = await getGlobalQuote(this.symbol);
            if (quote) {
                this.change = parseFloat(quote.change);
                this.changePercent = parseFloat(quote.changePercent);
                this.high = formatTradingPrice(quote.high);
                this.latestTradingDay = quote.latestTradingDay;
                this.low = formatTradingPrice(quote.low);
                this.open = quote.open;
                this.previousClose = quote.previousClose;
                this.price = toDollarCurrency(quote.price);
                this.volume = quote.volume;
                this.state = StockStoreState.FULFILLED;
            }
        } catch (error) {
            this.state = StockStoreState.ERROR;
        }
    }
}
