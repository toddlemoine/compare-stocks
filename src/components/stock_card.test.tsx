import React from 'react';
import { render, screen } from '@testing-library/react';
import { StockCard } from './stock_card';

describe('StockCard', () => {
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
});
