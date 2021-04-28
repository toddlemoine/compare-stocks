import { getGlobalQuote } from './get_global_quote';
import { BASE_URL } from './base';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

describe('Get Global Quote  API', () => {
    const server = setupServer(
        rest.get(`${BASE_URL}/query`, (_req, res, ctx) => {
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

    it('returns an unnested object of quote properties', async () => {
        const result = await getGlobalQuote('IBM');
        expect(Object.keys(result!).length).toBe(10);
    });

    it('massages raw keys into something useful', async () => {
        const result = await getGlobalQuote('IBM');
        expect(Object.keys(result!).sort()).toEqual(
            'change changePercent high latestTradingDay low open previousClose price symbol volume'.split(
                ' ',
            ),
        );
    });
});
