import { AppStore } from './app_store';
import { BASE_URL } from '../api/base';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

describe('AppStore', () => {
    const server = setupServer(
        rest.get(`${BASE_URL}/query`, (_req, res, ctx) => {
            return res(ctx.status(200), ctx.json({ bestMatches: [1, 2, 3] }));
        }),
    );

    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it('searches for a term', async () => {
        const store = new AppStore();
        expect(store.searchResults).toEqual([]);
        await store.search('Apples');
        expect(store.searchResults.length).toBe(3);
    });
});
