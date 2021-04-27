import { RawAVSearchResult, AVSearchResult } from '../types';
import { get } from './base';

type AVSearchResponse = {
    bestMatches: RawAVSearchResult[];
};

const searchJSONResponse = async (term: string): Promise<AVSearchResponse> => {
    const resp = await get('/query', {
        function: 'SYMBOL_SEARCH',
        keywords: term,
    });
    return await resp.json();
};

const cleanSearchResult = (result: RawAVSearchResult): AVSearchResult => {
    return { symbol: result['1. symbol'], name: result['2. name'] };
};

export const search = async (term: string): Promise<AVSearchResult[]> => {
    const resp = await searchJSONResponse(term);
    return resp.bestMatches?.map(cleanSearchResult) ?? [];
};
