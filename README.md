# Stock Comparison

This is a simple React application built around the AlphaVantage API to query and select up to 3 stocks to compare. It shows the stock's daily price data and anual earnings per share. Built with React, MobX, and Typescript. Tests with Jest.

## Prerequisites

You need an AlphaVantage API key to run this application. Get one here:

https://www.alphavantage.co/support/#api-key

## Installation

1. Copy your AlphaVantage API key and paste it into the `.env` file.
2. Run `yarn start` to install dependencies and start the development server. Access the application at http://localhost:3000.

## Tests

Jest tests for some of the components, API methods, and stores are provided.

```
yarn test
```

## Known Issues

-   The AlphaVantage free API is limited to 5 calls per minute and 500 per day. In practice, this results in the application being unable to lookup a selected stock (the queries for searching for a stock seem unaffected by the API limit, though). When this happens, the selected stock card will display with an error and Retry button to refetch the stock data. Just wait a minute and try again.
