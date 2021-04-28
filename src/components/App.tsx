import React from 'react';
import { AppStoreProvider } from '../hooks/use_app_store';
import { AppStore } from '../stores/app_store';
import styles from './App.module.css';
import { SelectedStocks } from './selected_stocks';
import { SymbolSearchForm } from './symbol_search_form';

function App() {
    return (
        <AppStoreProvider value={new AppStore()}>
            <div className={styles.root}>
                <header className="App-header">
                    <h1>Stock Comparison</h1>
                </header>
                <SymbolSearchForm />
                <SelectedStocks />
            </div>
        </AppStoreProvider>
    );
}

export default App;
