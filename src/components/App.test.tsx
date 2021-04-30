import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('has title', () => {
    render(<App />);
    const heading = screen.getByRole('heading', /Stock Comparison/i);
    expect(heading).toBeInTheDocument();
});
