import React from 'react';
import styles from './arrow.module.css';

type ArrowProps = {
    direction: 'up' | 'down';
    className?: string;
    label: string;
};

export const Arrow = ({ direction = 'down', className, label }: ArrowProps) => {
    const classes = [styles.root, className].filter(Boolean).join(' ');
    return (
        <div className={classes} aria-label={label}>
            <svg className={styles[direction]} viewBox="0 0 24 24" width="24" height="24">
                <path
                    fillRule="evenodd"
                    d="M4.97 13.22a.75.75 0 000 1.06l6.25 6.25a.75.75 0 001.06 0l6.25-6.25a.75.75 0 10-1.06-1.06l-4.97 4.97V3.75a.75.75 0 00-1.5 0v14.44l-4.97-4.97a.75.75 0 00-1.06 0z"
                ></path>
            </svg>
        </div>
    );
};
