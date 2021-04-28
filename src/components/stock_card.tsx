import { Observer } from 'mobx-react';
import React, { useRef, useEffect } from 'react';
import { useStockStore } from '../hooks/use_stock_store';
import { StockSymbol } from '../types';
import { Arrow } from './arrow';
import styles from './stock_card.module.css';

const Loading: React.FC = () => {
    const ref = useRef<HTMLProgressElement>(null);

    useEffect(() => {
        // Make indeterminate progress bar.
        ref.current?.removeAttribute('value');
    }, []);

    return <progress ref={ref} />;
};

export const ChangeIndicator: React.FC<{ closingPrice: string; changePercent: number }> = ({
    changePercent,
    closingPrice,
}) => {
    const direction = changePercent > 0 ? 'up' : 'down';
    const hasChange = changePercent !== 0;
    return (
        <div>
            {hasChange && <Arrow direction={direction} />}
            <span>{closingPrice}</span>
            <span>{changePercent}</span>
        </div>
    );
};

export const StockCard: React.FC<{ symbol: StockSymbol; name: string }> = ({ symbol, name }) => {
    const store = useStockStore(symbol, name);
    return (
        <Observer>
            {() => {
                return (
                    <article className={styles.root}>
                        <header>
                            <h1>{name}</h1>
                            <span>{symbol}</span>
                        </header>
                        <div>
                            <ChangeIndicator
                                closingPrice={store.price!}
                                changePercent={store.changePercent!}
                            />
                        </div>
                        <div>
                            <h2>Stats</h2>
                            <table>
                                <tr>
                                    <th>High</th>
                                    <td>{store.high}</td>
                                </tr>
                                <tr>
                                    <th>Low</th>
                                    <td>{store.low}</td>
                                </tr>
                            </table>
                        </div>
                        {store.loading && <Loading />}
                    </article>
                );
            }}
        </Observer>
    );
};
