import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { StockCard } from './stock_card';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { BASE_URL } from '../api/base';

describe('StockCard', () => {
    const server = setupServer(
        rest.get(`/query`, (_req, res, ctx) => {
            return res(
                ctx.json({
                    'Global Quote': {
                        '01. symbol': 'IBM',
                        '02. open': '141.6900',
                        '03. high': '142.5600',
                        '04. low': '140.7500',
                        '05. price': '142.0100',
                        '06. volume': '3884037',
                        '07. latest trading day': '2021-04-27',
                        '08. previous close': '141.5700',
                        '09. change': '0.4400',
                        '10. change percent': '0.3108%',
                    },
                }),
            );
        }),
    );

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    const props = () => ({
        symbol: 'IBM',
        name: 'International Business Machines',
        onRemove: jest.fn(),
    });

    it('is an article element', () => {
        render(<StockCard {...props()} />);
        const article = screen.getByRole('article');
        expect(article).toBeInTheDocument();
    });

    it('shows a progress bar while loading', () => {
        server.use(
            rest.get(`/query`, (_req, res, ctx) => {
                return res(ctx.delay(1000));
            }),
        );
        render(<StockCard {...props()} />);
        const progress = screen.getByRole('progressbar');
        expect(progress).toBeInTheDocument();
    });

    it('shows an error message when there is an error', async () => {
        server.use(
            rest.get(`${BASE_URL}/query`, (_req, res, ctx) => {
                return res(ctx.status(500));
            }),
        );
        render(<StockCard {...props()} />);
        await waitFor(() => {
            expect(screen.getByText(/There was a problem/)).toBeInTheDocument();
        });
    });
});
