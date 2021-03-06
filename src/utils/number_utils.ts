export const toDollarCurrency = (amount: string): string => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
        Number(amount),
    );
};

export const formatPercent = (percent: string | number): string => {
    return `${parseFloat(percent.toString()).toFixed(2)}%`;
};

export const formatTradingPrice = (price: string): string => {
    return parseFloat(price).toFixed(2);
};
