import { useContext } from 'react';
import { createContext } from 'react';
import { useLocalObservable } from 'mobx-react';
import { StockStore } from '../stores/stock_store';

export const StockStoreContext = createContext<StockStore | undefined>(undefined);

export const useStockStore = () => {
    const store = useContext(StockStoreContext);
    if (store === undefined) {
        throw Error('No provider found. Wrap your stock card in StockStoreProvider before using.');
    }
    return useLocalObservable(() => store);
};

export const StockStoreProvider = StockStoreContext.Provider;
