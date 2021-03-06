type RequestParams = {
    [key: string]: string | number;
};

export const BASE_URL = 'https://www.alphavantage.co';

export class ApiError extends Error {
    public status?: number;
    constructor(message: string, status?: number) {
        super(message);
        this.status = status;
    }
}
const url = (pathname: string, params: RequestParams): string => {
    const url = new URL(pathname, BASE_URL);
    url.search = Object.entries(params)
        .map(([key, val]) => {
            return `${key}=${val}`;
        })
        .join('&');
    return url.toString();
};

const createRequestParams = (params: RequestParams): RequestParams => {
    const apiKey = process.env.REACT_APP_ALPHAVANTAGE_ACCESS_KEY!;
    if (!apiKey) {
        throw Error('Unable to make request without a valid API key');
    }

    return {
        ...params,
        apikey: apiKey,
    };
};

export const get = async (path: string, params: RequestParams = {}): Promise<Response> => {
    const res = await fetch(url(path, createRequestParams(params)), {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        throw new ApiError(res.statusText, res.status);
    }

    return res;
};
