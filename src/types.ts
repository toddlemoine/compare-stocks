export type RawAVSearchResult = {
    '1. symbol': string;
    '2. name': string;
    '3. type': string;
    '4. region': string;
    '5. marketOpen': string;
    '6. marketClose': string;
    '7. timezone': string;
    '8. currency': string;
    '9. matchScore': string;
};

export type AVSearchResult = {
    symbol: string;
    name: string;
};

export type StockSymbol = string;

export type RawAVGlobalQuote = {
    '01. symbol': string;
    '02. open': string;
    '03. high': string;
    '04. low': string;
    '05. price': string;
    '06. volume': string;
    '07. latest trading day': string;
    '08. previous close': string;
    '09. change': string;
    '10. change percent': string;
};

export type AVGlobalQuote = {
    change: string;
    changePercent: string;
    high: string;
    latestTradingDay: string;
    low: string;
    open: string;
    previousClose: string;
    price: string;
    symbol: string;
    volume: string;
};

export type AVAnnualEarning = {
    fiscalDateEnding: number;
    reportedEPS: number;
};

export type AVQuarterlyEarning = {
    fiscalDateEnding: string;
    reportedEPS: string;
    estimatedEPS: string;
    reportedDate: string;
    surprise: string;
    surprisePercentage: string;
};
