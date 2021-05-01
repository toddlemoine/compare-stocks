import { Observer } from 'mobx-react';
import React, { useRef, useEffect, ReactElement } from 'react';
import { StockStoreProvider, useStockStore } from '../hooks/use_stock_store';
import { StockStore } from '../stores/stock_store';
import { StockSymbol } from '../types';
import styles from './stock_card.module.css';
import { ChangeIndicator } from './change_indicator';
import { EarningsChart } from './earnings_chart';
import { Button } from '@material-ui/core';

type StockCardProps = {
    symbol: StockSymbol;
    name: string;
    onRemove: () => void;
};

const Block: React.FC<React.PropsWithChildren<React.ReactNode>> = ({ children }) => {
    return <div className={styles.block}>{children}</div>;
};

const Error: React.FC<{ message?: string; onRetry: () => void }> = ({ message, onRetry }) => {
    const text = ['There was a problem fetching stock', message].filter(Boolean).join(': ');
    return (
        <div className={styles.error}>
            <p>{text}.</p>
            <Button onClick={onRetry}>Retry</Button>
        </div>
    );
};

const Loading: React.FC = () => {
    const ref = useRef<HTMLProgressElement>(null);

    useEffect(() => {
        // Make indeterminate progress bar.
        ref.current?.removeAttribute('value');
    }, []);

    return <progress ref={ref} />;
};

export const StockCard: React.FC<StockCardProps> = ({ symbol, name, onRemove }) => {
    const store = useStockStore();
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
                            {store.error && (
                                <Error
                                    message={store.lastError?.message}
                                    onRetry={() => store.fetch()}
                                />
                            )}
                            {store.loading && <Loading />}
                            {store.fulfilled && (
                                <>
                                    <Block>
                                        <ChangeIndicator
                                            closingPrice={store.price!}
                                            changePercent={store.changePercent!}
                                        />
                                    </Block>
                                    <Block>
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
                                    </Block>
                                    <Block>
                                        <h2>Annual EPS</h2>
                                        <EarningsChart data={store.annualEarnings} />
                                    </Block>
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

export const ConnectedStockCard: React.FC<StockCardProps> = props => {
    return (
        <StockStoreProvider value={new StockStore(props.symbol, props.name)}>
            <StockCard {...props} />
        </StockStoreProvider>
    );
};
