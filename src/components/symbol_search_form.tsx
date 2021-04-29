import React, {
    ChangeEvent,
    FormEvent,
    MouseEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';
import { Observer } from 'mobx-react';
import { useAppStore } from '../hooks/use_app_store';
import debounce from 'lodash.debounce';
import styles from './symbol_search_form.module.css';

export const SymbolSearchForm: React.FC = () => {
    const [term, setTerm] = useState('');
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

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            setTerm(e.target.value);
            debouncedSearch(e.target.value);
        },
        [setTerm, debouncedSearch],
    );

    const handleAdd = useCallback(
        (e: MouseEvent<HTMLButtonElement>) => {
            appStore.addStock(term);
            setTerm('');
        },
        [appStore, term, setTerm],
    );

    return (
        <Observer>
            {() => {
                return (
                    <form name="symbol search" className={styles.root} onSubmit={handleSubmit}>
                        <label className={styles.label} htmlFor="symbol_search_input">
                            Enter a stock symbol or company name
                        </label>
                        <div className={styles.inputRow}>
                            <input
                                id="symbol_search_input"
                                ref={inputRef}
                                onChange={handleChange}
                                type="text"
                                list="symbol-search-results"
                                value={term}
                                disabled={!appStore.canAddStock}
                            />
                            <button disabled={!appStore.canAddStock} onClick={handleAdd}>
                                Add
                            </button>
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
