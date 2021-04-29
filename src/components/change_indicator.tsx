import React from 'react';
import { formatPercent } from '../utils/number_utils';
import { Arrow } from './arrow';
import styles from './change_indicator.module.css';

export const ChangeIndicator: React.FC<{ closingPrice: string; changePercent: number }> = ({
    changePercent,
    closingPrice,
}) => {
    const direction = changePercent > 0 ? 'up' : 'down';
    const hasChange = changePercent !== 0;
    const label = `Stock is ${direction}`;
    return (
        <div className={styles.root}>
            {hasChange && <Arrow className={styles.arrow} direction={direction} label={label} />}
            <span className={styles.price}>{closingPrice}</span>
            <span
                className={direction === 'up' ? styles.percentChangeUp : styles.percentChangeDown}
            >
                {formatPercent(changePercent)}
            </span>
        </div>
    );
};
