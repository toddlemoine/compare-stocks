import React from 'react';
import styles from './arrow.module.css';

export const Arrow: React.FC<{ direction: 'up' | 'down' }> = ({ direction = 'down' }) => {
    return (
        <div className={styles.root}>
            <svg className={styles[direction]} viewBox="0 0 24 24" width="24" height="24">
                <path
                    fill-rule="evenodd"
                    d="M4.97 13.22a.75.75 0 000 1.06l6.25 6.25a.75.75 0 001.06 0l6.25-6.25a.75.75 0 10-1.06-1.06l-4.97 4.97V3.75a.75.75 0 00-1.5 0v14.44l-4.97-4.97a.75.75 0 00-1.06 0z"
                ></path>
            </svg>
        </div>
    );
};