import { RawAVGlobalQuote, AVGlobalQuote, StockSymbol } from '../types';
import { ApiError, get } from './base';

type AVGlobalQuoteResponse = {
    'Global Quote': RawAVGlobalQuote;
    Note?: string;
};

const getGlobalQuoteJSONResponse = async (symbol: StockSymbol): Promise<AVGlobalQuoteResponse> => {
    const resp = await get('/query', {
        function: 'GLOBAL_QUOTE',
        symbol: symbol,
    });
    return await resp.json();
};

const cleanRawQuote = (quote: RawAVGlobalQuote): AVGlobalQuote => {
    return Object.entries(quote).reduce((acc, [key, val]) => {
        const [_counter, first, ...rest] = key.split(' ');
        const camelCasedKey: string = [first]
            .concat(rest.map(word => word[0].toUpperCase() + word.slice(1)))
            .join('');
        acc[camelCasedKey as keyof AVGlobalQuote] = val;
        return acc;
    }, {} as AVGlobalQuote);
};

export const getGlobalQuote = async (symbol: string): Promise<AVGlobalQuote | undefined> => {
    const resp = await getGlobalQuoteJSONResponse(symbol);
    if (resp.Note) {
        throw new ApiError('API limit reached');
    }
    return resp['Global Quote'] ? cleanRawQuote(resp['Global Quote']) : undefined;
};
