import React, { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { Observer } from 'mobx-react';
import { useAppStore } from '../hooks/use_app_store';
import debounce from 'lodash.debounce';
import styles from './symbol_search_form.module.css';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { CircularProgress } from '@material-ui/core';
import { AVSearchResult } from '../types';

export const SymbolSearchForm: React.FC = () => {
    const [term, setTerm] = useState('');
    const [autocompleteKey, setAutocompleteKey] = useState(Date.now);
    const appStore = useAppStore();
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (term === '') {
            inputRef.current?.focus();
        }
    }, [term, inputRef]);

    const debouncedSearch = useCallback(
        debounce((term: string) => {
            appStore.search(term);
        }, 1000),
        [],
    );

    const handleSubmit = useCallback((e: FormEvent) => {
        e.preventDefault();
    }, []);

    const handleInputChange = useCallback(
        (e: ChangeEvent<{}>, value: string) => {
            setTerm(value);
            debouncedSearch(value);
        },
        [setTerm, debouncedSearch],
    );

    const handleChange = useCallback(
        (e: ChangeEvent<unknown>, value: AVSearchResult | null) => {
            if (value?.symbol) {
                appStore.addStock(value.symbol);
                setAutocompleteKey(Date.now);
                setTerm('');
            }
        },
        [appStore],
    );

    return (
        <Observer>
            {() => {
                return (
                    <form name="symbol search" className={styles.root} onSubmit={handleSubmit}>
                        <label className={styles.label} htmlFor="stock-symbol-input">
                            Enter up to 3 stocks to compare the current stock prices.
                        </label>
                        <div className={styles.inputRow}>
                            <Autocomplete
                                key={autocompleteKey}
                                id="stock-symbol-input"
                                options={appStore.searchResults}
                                clearOnBlur={true}
                                getOptionLabel={option => option.symbol}
                                style={{ width: 300 }}
                                loading={appStore.loading}
                                onChange={handleChange}
                                disabled={!appStore.canAddStock}
                                getOptionSelected={option => option.symbol === term}
                                renderOption={(option: AVSearchResult) => (
                                    <div className={styles.option}>
                                        <span className={styles.optionSymbol}>{option.symbol}</span>
                                        <span className={styles.optionName}>{option.name}</span>
                                    </div>
                                )}
                                renderInput={params => (
                                    <TextField
                                        {...params}
                                        variant="outlined"
                                        value={term}
                                        InputProps={{
                                            ...params.InputProps,
                                            endAdornment: (
                                                <React.Fragment>
                                                    {appStore.loading ? (
                                                        <CircularProgress
                                                            color="inherit"
                                                            size={20}
                                                        />
                                                    ) : null}
                                                    {params.InputProps.endAdornment}
                                                </React.Fragment>
                                            ),
                                        }}
                                    />
                                )}
                                onInputChange={handleInputChange}
                            />
                        </div>
                        {!appStore.canAddStock && (
                            <div className={styles.helpText}>Maximum number of stocks added. </div>
                        )}
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
