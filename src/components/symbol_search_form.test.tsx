import React from 'react';
import { render, screen } from '@testing-library/react';
import { SymbolSearchForm } from './symbol_search_form';
import { AppStoreProvider } from '../hooks/use_app_store';
import { AppStore } from '../stores/app_store';

describe('SymbolSearchForm', () => {
    const renderWithStore = (component, store) => {
        const Providers = ({ children }) => {
            return <AppStoreProvider value={store}>{children}</AppStoreProvider>;
        };

        return render(component, { wrapper: Providers });
    };

    it('is a proper form', () => {
        renderWithStore(<SymbolSearchForm />, new AppStore());
        const form = screen.getByRole('form');
        expect(form).toBeInTheDocument();
    });

    it('has a labelled input', () => {
        renderWithStore(<SymbolSearchForm />, new AppStore());
        const input = screen.getByLabelText(
            'Enter up to 3 stocks to compare the current stock prices.',
        );
        expect(input).toBeInTheDocument();
    });

    it('shows search results from the store as options', () => {
        const store = new AppStore();
        store.searchResults = [
            { name: 'Apples', symbol: 'A' },
            { name: 'Bananas', symbol: 'B' },
            { name: 'Kiwis', symbol: 'K' },
        ];
        renderWithStore(<SymbolSearchForm />, store);
        const combo = screen.getByRole('combobox');
        expect(combo).toBeInTheDocument();
        // Tried to do queryByRole('option') to get options, but no role exposed?
        const list = screen.getByTestId('symbol_list');
        expect(list.children.length).toBe(3);
    });
});
