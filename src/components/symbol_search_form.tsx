import React, { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { Observer } from 'mobx-react';
import { useAppStore } from '../hooks/use_app_store';
import { log } from '../utils';
import debounce from 'lodash.debounce';
import styles from './symbol_search_form.module.css';

export const SymbolSearchForm: React.FC = () => {
    const [term, setTerm] = useState('');
    const appStore = useAppStore();

    const debouncedSearch = useCallback(
        debounce((term: string) => {
            appStore.search(term);
        }, 500),
        [],
    );

    const handleSubmit = useCallback(
        (e: FormEvent) => {
            e.preventDefault();
            if (appStore.canAddStock) {
                log.info('submit form', term);
                appStore.addStock(term);
            }
        },
        [appStore, term],
    );

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            log.info('input change');
            setTerm(e.target.value);
            debouncedSearch(e.target.value);
        },
        [setTerm, debouncedSearch],
    );

    return (
        <Observer>
            {() => {
                return (
                    <form name="symbol search" className={styles.root} onSubmit={handleSubmit}>
                        <label className={styles.label} htmlFor="symbol_search_input">
                            Stock symbol or company name
                        </label>
                        <div>
                            <input
                                id="symbol_search_input"
                                onChange={handleChange}
                                type="text"
                                list="symbol-search-results"
                                value={term}
                            />
                            <button>Add</button>
                        </div>
                        <datalist data-testid="symbol_list" id="symbol-search-results">
                            {appStore.searchResults.map(result => (
                                <option key={result.symbol} value={result.symbol}>
                                    {result.name}
                                </option>
                            ))}
                        </datalist>
                    </form>
                );
            }}
        </Observer>
    );
};
