import React from 'react';
import { Observer } from 'mobx-react';
import styles from './selected_stocks.module.css';
import { useAppStore } from '../hooks/use_app_store';
import { StockCard } from './stock_card';

export const SelectedStocks: React.FC = () => {
    const appStore = useAppStore();
    return (
        <Observer>
            {() => {
                return (
                    <section className={styles.root} aria-label="selected stocks">
                        {Array.from(appStore.selectedStocks).map(({ symbol, name }) => (
                            <StockCard
                                key={symbol}
                                symbol={symbol}
                                name={name}
                                onRemove={() => appStore.removeStock(symbol)}
                            />
                        ))}
                    </section>
                );
            }}
        </Observer>
    );
};
