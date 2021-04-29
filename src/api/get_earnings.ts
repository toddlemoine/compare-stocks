import { AVAnnualEarning, AVQuarterlyEarning, StockSymbol } from './../types';
import { get } from './base';

type RawAVAnnualEarning = {
    fiscalDateEarning: string;
    reportedEPS: string;
};

type RawAVQuarterlyEarning = {
    fiscalDateEarning: string;
    reportedEPS: string;
    estimatedEPS: string;
    reportedDate: string;
    surprise: string;
    surprisePercentage: string;
};

type RawAVEarningsResponse = {
    symbol: StockSymbol;
    annualEarnings: RawAVAnnualEarning[];
    quarterlyEarnings: RawAVQuarterlyEarning[];
};

export type AVEarningsResponse = {
    symbol: StockSymbol;
    annualEarnings: AVAnnualEarning[];
    quarterlyEarnings: AVQuarterlyEarning[];
};

const getEarningsJSONResponse = async (symbol: StockSymbol): Promise<RawAVEarningsResponse> => {
    const resp = await get('/query', {
        function: 'EARNINGS',
        symbol: symbol,
    });
    return await resp.json();
};

const parseValues = (resp: RawAVEarningsResponse): AVEarningsResponse => {
    return {
        symbol: resp.symbol,
        quarterlyEarnings: resp.quarterlyEarnings,
        annualEarnings: resp.annualEarnings.map(item => {
            return {
                fiscalDateEarning: new Date(item.fiscalDateEarning),
                reportedEPS: parseFloat(item.reportedEPS),
            };
        }),
    };
};

export const getEarnings = async (symbol: string): Promise<AVEarningsResponse> => {
    const resp = await getEarningsJSONResponse(symbol);
    return parseValues(resp);
};
