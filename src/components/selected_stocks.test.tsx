import React from 'react';
import { render, screen } from '@testing-library/react';
import { SelectedStocks } from './selected_stocks';
import { AppStoreProvider } from '../hooks/use_app_store';
import { AppStore } from '../stores/app_store';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

describe('SelectedStocks', () => {
    const server = setupServer(
        rest.get(`/query`, (_req, res, ctx) => {
            return res(ctx.status(200));
        }),
    );

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    const placeholderRegex = /Pick an additional stock symbol in the search box above to display stock information./;

    const renderWithStore = (component, store) => {
        const Providers = ({ children }) => {
            return <AppStoreProvider value={store}>{children}</AppStoreProvider>;
        };

        return render(component, { wrapper: Providers });
    };
    test('shows a placeholder message when no stocks are selected', () => {
        const store = new AppStore();
        renderWithStore(<SelectedStocks />, store);
        const msg = screen.getByText(placeholderRegex);
        expect(msg).toBeInTheDocument();
    });

    test('shows a placeholder message when less than 3 stocks are selected', () => {
        const store = new AppStore();
        store.selectedStocks = [
            {
                name: 'Apples',
                symbol: 'A',
            },
        ];
        renderWithStore(<SelectedStocks />, store);
        const msg = screen.getByText(placeholderRegex);
        expect(msg).toBeInTheDocument();
    });

    test('does not show placeholder message when 3 stocks are selected', () => {
        const store = new AppStore();
        store.selectedStocks = [
            {
                name: 'Apples',
                symbol: 'A',
            },
            {
                name: 'Bananas',
                symbol: 'B',
            },
            {
                name: 'Kiwi',
                symbol: 'K',
            },
        ];
        renderWithStore(<SelectedStocks />, store);
        expect(() => screen.getByText(placeholderRegex)).toThrowError();
    });
    test('shows a selected stock', () => {
        const store = new AppStore();
        store.selectedStocks = [
            {
                name: 'Apples',
                symbol: 'A',
            },
        ];
        renderWithStore(<SelectedStocks />, store);
        const stock = screen.getByRole('heading', { level: 1, name: /Apples/ });
        expect(stock).toBeInTheDocument();
    });
});
