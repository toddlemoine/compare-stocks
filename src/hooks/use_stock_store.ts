import { useLocalObservable } from 'mobx-react';
import { StockStore } from '../stores/stock_store';
import { StockSymbol } from '../types';

export const useStockStore = (symbol: StockSymbol, name: string) => {
    return useLocalObservable(() => new StockStore(symbol, name));
};
