import { Observer } from 'mobx-react';
import React, { useRef, useEffect } from 'react';
import { useStockStore } from '../hooks/use_stock_store';
import { StockSymbol } from '../types';
import styles from './stock_card.module.css';
import { ChangeIndicator } from './change_indicator';
import { EarningsChart } from './earnings_chart';

const Loading: React.FC = () => {
    const ref = useRef<HTMLProgressElement>(null);

    useEffect(() => {
        // Make indeterminate progress bar.
        ref.current?.removeAttribute('value');
    }, []);

    return <progress ref={ref} />;
};

export const StockCard: React.FC<{ symbol: StockSymbol; name: string; onRemove: () => void }> = ({
    symbol,
    name,
    onRemove,
}) => {
    const store = useStockStore(symbol, name);
    return (
        <Observer>
            {() => {
                return (
                    <article className={styles.root}>
                        <div className={styles.content}>
                            <header>
                                <h1>{name}</h1>
                                <span>{symbol}</span>
                            </header>
                            {store.loading && <Loading />}
                            {!store.loading && (
                                <>
                                    <ChangeIndicator
                                        closingPrice={store.price!}
                                        changePercent={store.changePercent!}
                                    />
                                    <div>
                                        <h2>Stats</h2>
                                        <table className={styles.dailyPriceTable}>
                                            <tbody>
                                                <tr>
                                                    <th>High</th>
                                                    <td>{store.high}</td>
                                                </tr>
                                                <tr>
                                                    <th>Low</th>
                                                    <td>{store.low}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <EarningsChart data={store.annualEarnings} />
                                </>
                            )}
                            <button
                                className={styles.removeButton}
                                aria-label={`remove ${name} from comparison`}
                                onClick={onRemove}
                            >
                                ×
                            </button>
                        </div>
                    </article>
                );
            }}
        </Observer>
    );
};
