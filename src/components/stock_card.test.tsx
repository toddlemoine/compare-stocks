import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { StockCard } from './stock_card';
import { StockStoreProvider } from '../hooks/use_stock_store';
import { StockStore, StockStoreState } from '../stores/stock_store';

describe('StockCard', () => {
    const renderWithStore = (component, store) => {
        const Providers = ({ children }) => {
            return <StockStoreProvider value={store}>{children}</StockStoreProvider>;
        };

        return render(component, { wrapper: Providers });
    };
    const props = () => ({
        symbol: 'IBM',
        name: 'International Business Machines',
        onRemove: jest.fn(),
    });

    const store = () => {
        const store = new StockStore('IBM', 'International Business Machines');
        store.fetch = jest.fn();
        return store;
    };

    it('is an article element', () => {
        renderWithStore(<StockCard {...props()} />, store());
        const article = screen.getByRole('article');
        expect(article).toBeInTheDocument();
    });

    it('shows a progress bar while loading', () => {
        const loadingStore = store();
        loadingStore.state = StockStoreState.LOADING;
        renderWithStore(<StockCard {...props()} />, loadingStore);
        const progress = screen.getByRole('progressbar');
        expect(progress).toBeInTheDocument();
    });

    it('shows an error message when there is an error', () => {
        const errorStore = store();
        errorStore.state = StockStoreState.ERROR;
        errorStore.lastError = new Error('Boom');
        renderWithStore(<StockCard {...props()} />, errorStore);
        expect(screen.getByText(/There was a problem/)).toBeInTheDocument();
        expect(screen.getByText(/Boom/)).toBeInTheDocument();
    });

    it('lets you retry when there is an error fetching', () => {
        const errorStore = store();
        jest.spyOn(errorStore, 'fetch');
        errorStore.state = StockStoreState.ERROR;
        errorStore.lastError = new Error('Boom');
        renderWithStore(<StockCard {...props()} />, errorStore);
        const retryBtn = screen.getByRole('button', { name: /Retry/ });
        fireEvent.click(retryBtn);
        expect(errorStore.fetch).toHaveBeenCalled();
    });
});
