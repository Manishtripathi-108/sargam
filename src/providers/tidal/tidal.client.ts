import { getBrowserHeaders } from '../../constants/user-agents.constants';
import { AppError } from '../../utils/error.utils';
import { getAccessToken } from './tidal.auth';
import TIDAL_ROUTES from './tidal.routes';
import axios, { type AxiosError } from 'axios';

type TidalErrorResponse = {
    status?: number;
    subStatus?: number;
    userMessage?: string;
};

const countryCode = process.env.TIDAL_COUNTRY_CODE || 'US';

export const tidalClient = axios.create({
    baseURL: TIDAL_ROUTES.BASE,
    headers: {
        Accept: 'application/json',
        origin: 'https://tidal.com',
        referer: 'https://tidal.com/',
    },
    params: { countryCode },
});

async function bootstrapClient(): Promise<void> {}

void bootstrapClient();

tidalClient.interceptors.request.use(async (config) => {
    const token = await getAccessToken();

    if (!token) {
        throw new AppError('[Tidal] Failed to obtain access token', 500);
    }

    const browserHeaders = getBrowserHeaders({ include: config.headers });

    for (const [key, value] of Object.entries(browserHeaders)) {
        if (value !== undefined) {
            config.headers.set(key, value);
        }
    }

    tidalClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return config;
});

tidalClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<TidalErrorResponse>) => {
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    throw new AppError('[Tidal] Authentication failed', 401);
                case 403:
                    throw new AppError('[Tidal] Access forbidden', 403);
                case 404:
                    throw new AppError('[Tidal] Resource not found', 404);
                case 429:
                    throw new AppError('[Tidal] Rate limit exceeded', 429);
                default:
                    throw new AppError(data?.userMessage || `[Tidal] API error: ${status}`, status);
            }
        }

        if (error.code === 'ECONNABORTED') {
            throw new AppError('[Tidal] Request timeout', 408);
        }

        throw new AppError(`[Tidal] Connection error: ${error.message}`, 500);
    }
);
