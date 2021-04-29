import { getEarnings } from './../api/get_earnings';
import { toDollarCurrency, formatTradingPrice } from './../utils/number_utils';
import { AVAnnualEarning, AVQuarterlyEarning, StockSymbol } from './../types';
import { action, computed, makeAutoObservable, observable, runInAction } from 'mobx';
import { getGlobalQuote } from '../api';

enum StockStoreState {
    LOADING,
    PARTIALLY_FULFILLED,
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
    public annualEarnings: AVAnnualEarning[] = [];
    public quarterlyEarnings: AVQuarterlyEarning[] = [];

    constructor(symbol: StockSymbol, name: string) {
        this.symbol = symbol;
        this.name = name;

        makeAutoObservable(this, {
            fetch: action,
            loading: computed,
            fulfilled: computed,
            error: computed,
            state: observable,
        });

        this.fetch();
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

    public async fetch(): Promise<void> {
        try {
            const quote = await getGlobalQuote(this.symbol);
            if (quote) {
                runInAction(() => {
                    this.change = parseFloat(quote.change);
                    this.changePercent = parseFloat(quote.changePercent);
                    this.high = formatTradingPrice(quote.high);
                    this.latestTradingDay = quote.latestTradingDay;
                    this.low = formatTradingPrice(quote.low);
                    this.open = quote.open;
                    this.previousClose = quote.previousClose;
                    this.price = toDollarCurrency(quote.price);
                    this.volume = quote.volume;
                    this.state = StockStoreState.PARTIALLY_FULFILLED;
                });

                const { annualEarnings, quarterlyEarnings } = await getEarnings(this.symbol);

                runInAction(() => {
                    this.annualEarnings = annualEarnings;
                    this.quarterlyEarnings = quarterlyEarnings;
                    this.state = StockStoreState.FULFILLED;
                });
            }
        } catch (error) {
            runInAction(() => {
                this.state = StockStoreState.ERROR;
            });
        }
    }
}
