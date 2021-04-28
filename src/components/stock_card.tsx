import { Observer } from 'mobx-react';
import React, { useRef, useEffect } from 'react';
import { StockSymbol } from '../types';
import styles from './stock_card.module.css';

const Loading: React.FC = () => {
    const ref = useRef<HTMLProgressElement>(null);

    useEffect(() => {
        // Make indeterminate progress bar.
        ref.current?.removeAttribute('value');
    }, []);

    return <progress ref={ref} />;
};

export const StockCard: React.FC<{ symbol: StockSymbol }> = ({ symbol }) => {
    return (
        <Observer>
            {() => {
                return (
                    <article className={styles.root}>
                        <h1>{symbol}</h1>
                        <Loading />
                    </article>
                );
            }}
        </Observer>
    );
};
