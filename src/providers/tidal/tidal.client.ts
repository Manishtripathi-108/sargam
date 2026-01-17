import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { AppError } from '../../utils/error.utils';
import TIDAL_ROUTES from './tidal.routes';

/**
 * Tidal API Client
 *
 * Uses OAuth2 Client Credentials flow for authentication.
 * Configure via environment variables:
 * - TIDAL_CLIENT_ID: OAuth client ID
 * - TIDAL_CLIENT_SECRET: OAuth client secret
 * - TIDAL_COUNTRY_CODE: Default country code (default: US)
 */

interface TidalConfig {
    clientId: string;
    clientSecret: string;
    countryCode: string;
}

interface TidalToken {
    accessToken: string;
    expiresAt: number;
}

interface TidalErrorResponse {
    status?: number;
    subStatus?: number;
    userMessage?: string;
}

let config: TidalConfig | null = null;
let tidalClient: AxiosInstance | null = null;
let cachedToken: TidalToken | null = null;

function getConfig(): TidalConfig {
    if (!config) {
        const clientId = process.env.TIDAL_CLIENT_ID;
        const clientSecret = process.env.TIDAL_CLIENT_SECRET;
        const countryCode = process.env.TIDAL_COUNTRY_CODE || 'US';

        if (!clientId) {
            throw new AppError('TIDAL_CLIENT_ID environment variable is not set', 500);
        }

        if (!clientSecret) {
            throw new AppError('TIDAL_CLIENT_SECRET environment variable is not set', 500);
        }

        config = { clientId, clientSecret, countryCode };
    }

    return config;
}

async function getAccessToken(): Promise<string> {
    const now = Date.now();

    // Return cached token if still valid (with 5 minute buffer)
    if (cachedToken && cachedToken.expiresAt > now + 5 * 60 * 1000) {
        return cachedToken.accessToken;
    }

    const { clientId, clientSecret } = getConfig();

    const response = await axios.post(
        TIDAL_ROUTES.AUTH,
        'grant_type=client_credentials',
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            auth: {
                username: clientId,
                password: clientSecret,
            },
        }
    );

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
            headers: {
                Accept: 'application/json',
            },
            params: {
                countryCode,
            },
        });

        // Response interceptor for error handling
        tidalClient.interceptors.response.use(
            (response) => response,
            (error: AxiosError<TidalErrorResponse>) => {
                if (error.response) {
                    const { status, data } = error.response;

                    switch (status) {
                        case 401:
                            // Token expired, clear cache
                            cachedToken = null;
                            throw new AppError('Tidal authentication failed', 401);
                        case 403:
                            throw new AppError('Tidal access forbidden', 403);
                        case 404:
                            throw new AppError('Tidal resource not found', 404);
                        case 429:
                            throw new AppError('Tidal rate limit exceeded', 429);
                        default:
                            throw new AppError(data?.userMessage || `Tidal API error: ${status}`, status);
                    }
                }

                if (error.code === 'ECONNABORTED') {
                    throw new AppError('Tidal API request timeout', 408);
                }

                throw new AppError(`Tidal API connection error: ${error.message}`, 500);
            }
        );
    }

    // Update Authorization header with current token
    tidalClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    return tidalClient;
}

/**
 * Get the configured country code
 */
export function getCountryCode(): string {
    return getConfig().countryCode;
}

/**
 * Check if Tidal provider is configured
 */
export function isTidalConfigured(): boolean {
    return !!(process.env.TIDAL_CLIENT_ID && process.env.TIDAL_CLIENT_SECRET);
}

/**
 * Reset the client and token cache
 */
export function resetTidalClient(): void {
    config = null;
    tidalClient = null;
    cachedToken = null;
}

/**
 * Build album art URL from cover UUID
 */
export function getAlbumArtUrl(coverUuid: string, size: keyof typeof TIDAL_ROUTES.IMAGES.SIZES = 'XL'): string {
    // Tidal uses '-' in URLs but '/' in storage, need to convert
    const formattedUuid = coverUuid.replace(/-/g, '/');
    return `${TIDAL_ROUTES.IMAGES.BASE}/${formattedUuid}/${TIDAL_ROUTES.IMAGES.SIZES[size]}.jpg`;
}
