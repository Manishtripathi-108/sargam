import axios, { type AxiosInstance, type AxiosError } from 'axios';
import { AppError } from '../../utils/error.utils';
import QOBUZ_ROUTES from './qobuz.routes';

/**
 * Qobuz API Client
 *
 * Uses public Qobuz API with app_id authentication.
 * Configure via environment variable:
 * - QOBUZ_APP_ID: Application ID (optional, uses default if not set)
 */

interface QobuzErrorResponse {
    status?: string;
    code?: number;
    message?: string;
}

// Default app_id (commonly used public one)
const DEFAULT_APP_ID = '798273057';

let appId: string | null = null;
let qobuzClient: AxiosInstance | null = null;

function getAppId(): string {
    if (!appId) {
        appId = process.env.QOBUZ_APP_ID || DEFAULT_APP_ID;
    }
    return appId;
}

export function getQobuzClient(): AxiosInstance {
    if (!qobuzClient) {
        qobuzClient = axios.create({
            baseURL: QOBUZ_ROUTES.BASE,
            timeout: 30000,
            headers: {
                Accept: 'application/json',
            },
            params: {
                app_id: getAppId(),
            },
        });

        // Response interceptor for error handling
        qobuzClient.interceptors.response.use(
            (response) => response,
            (error: AxiosError<QobuzErrorResponse>) => {
                if (error.response) {
                    const { status, data } = error.response;

                    switch (status) {
                        case 400:
                            throw new AppError(data?.message || 'Qobuz bad request', 400);
                        case 401:
                            throw new AppError('Qobuz authentication failed - invalid app_id', 401);
                        case 403:
                            throw new AppError('Qobuz access forbidden', 403);
                        case 404:
                            throw new AppError('Qobuz resource not found', 404);
                        case 429:
                            throw new AppError('Qobuz rate limit exceeded', 429);
                        default:
                            throw new AppError(data?.message || `Qobuz API error: ${status}`, status);
                    }
                }

                if (error.code === 'ECONNABORTED') {
                    throw new AppError('Qobuz API request timeout', 408);
                }

                throw new AppError(`Qobuz API connection error: ${error.message}`, 500);
            }
        );
    }

    return qobuzClient;
}

/**
 * Check if Qobuz provider is configured
 * Note: Qobuz works with default app_id, so always returns true
 */
export function isQobuzConfigured(): boolean {
    return true;
}

/**
 * Reset the client
 */
export function resetQobuzClient(): void {
    appId = null;
    qobuzClient = null;
}

/**
 * Get current app_id (for debugging)
 */
export function getCurrentAppId(): string {
    return getAppId();
}
