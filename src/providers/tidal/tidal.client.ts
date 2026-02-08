import axios, { type AxiosError, type AxiosInstance } from 'axios';
import { AppError } from '../../utils/error.utils';
import TIDAL_ROUTES from './tidal.routes';

type TidalConfig = {
    clientId: string;
    clientSecret: string;
    countryCode: string;
};

type TidalToken = {
    accessToken: string;
    expiresAt: number;
};

type TidalErrorResponse = {
    status?: number;
    subStatus?: number;
    userMessage?: string;
};

let config: TidalConfig | null = null;
let tidalClient: AxiosInstance | null = null;
let cachedToken: TidalToken | null = null;

function getConfig(): TidalConfig {
    if (!config) {
        const clientId = process.env.TIDAL_CLIENT_ID;
        const clientSecret = process.env.TIDAL_CLIENT_SECRET;
        const countryCode = process.env.TIDAL_COUNTRY_CODE || 'US';

        if (!clientId) {
            throw new AppError('[Tidal] TIDAL_CLIENT_ID environment variable is not set', 500);
        }

        if (!clientSecret) {
            throw new AppError('[Tidal] TIDAL_CLIENT_SECRET environment variable is not set', 500);
        }

        config = { clientId, clientSecret, countryCode };
    }

    return config;
}

async function getAccessToken(): Promise<string> {
    const now = Date.now();

    if (cachedToken && cachedToken.expiresAt > now + 5 * 60 * 1000) {
        return cachedToken.accessToken;
    }

    const { clientId, clientSecret } = getConfig();

    const response = await axios.post(TIDAL_ROUTES.AUTH, 'grant_type=client_credentials', {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        auth: { username: clientId, password: clientSecret },
    });

    const { access_token, expires_in } = response.data as {
        access_token: string;
        expires_in: number;
        token_type: string;
    };

    cachedToken = {
        accessToken: access_token,
        expiresAt: now + expires_in * 1000,
    };

    return access_token;
}

export async function getTidalClient(): Promise<AxiosInstance> {
    const token = await getAccessToken();
    const { countryCode } = getConfig();

    if (!tidalClient) {
        tidalClient = axios.create({
            baseURL: TIDAL_ROUTES.BASE,
            timeout: 30000,
            headers: { Accept: 'application/json' },
            params: { countryCode },
        });

        tidalClient.interceptors.response.use(
            (response) => response,
            (error: AxiosError<TidalErrorResponse>) => {
                if (error.response) {
                    const { status, data } = error.response;

                    switch (status) {
                        case 401:
                            cachedToken = null;
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
    }

    tidalClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return tidalClient;
}

export function getCountryCode(): string {
    return getConfig().countryCode;
}

export function isTidalConfigured(): boolean {
    return !!(process.env.TIDAL_CLIENT_ID && process.env.TIDAL_CLIENT_SECRET);
}

export function resetTidalClient(): void {
    config = null;
    tidalClient = null;
    cachedToken = null;
}

export function getAlbumArtUrl(coverUuid: string, size: keyof typeof TIDAL_ROUTES.IMAGES.SIZES = 'XL'): string {
    const formattedUuid = coverUuid.replace(/-/g, '/');
    return `${TIDAL_ROUTES.IMAGES.BASE}/${formattedUuid}/${TIDAL_ROUTES.IMAGES.SIZES[size]}.jpg`;
}
