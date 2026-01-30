/**
 * Qobuz API Client
 *
 * Uses public Qobuz API with app_id authentication.
 * Configure via environment variable:
 * - QOBUZ_APP_ID: Application ID (optional, uses default if not set)
 */
// type QobuzErrorResponse = {
//     status?: string;
//     code?: number;
//     message?: string;
// };
import { getBrowserHeaders } from '../../constants/user-agents.constants';
import QOBUZ_ROUTES from './qobuz.routes';
import axios from 'axios';

const appId = process.env.QOBUZ_APP_ID!;
export const qobuzClient = axios.create({
    baseURL: QOBUZ_ROUTES.BASE,
    headers: {
        Accept: 'application/json',
    },
    params: {
        app_id: appId,
    },
});

qobuzClient.interceptors.request.use((config) => {
    const browserHeaders = getBrowserHeaders({ include: config.headers });

    if (config.headers) {
        for (const [key, value] of Object.entries(browserHeaders)) {
            if (value !== undefined) {
                config.headers.set(key, value);
            }
        }
    }

    return config;
});

// Response interceptor for error handling
// qobuzClient.interceptors.response.use(
//     (response) => response,
//     (error: AxiosError<QobuzErrorResponse>) => {
//         if (error.response) {
//             const { status, data } = error.response;
//             switch (status) {
//                 case 400:
//                     throw new AppError(data?.message || 'Qobuz bad request', 400);
//                 case 401:
//                     throw new AppError('Qobuz authentication failed - invalid app_id', 401);
//                 case 403:
//                     throw new AppError('Qobuz access forbidden', 403);
//                 case 404:
//                     throw new AppError('Qobuz resource not found', 404);
//                 case 429:
//                     throw new AppError('Qobuz rate limit exceeded', 429);
//                 default:
//                     throw new AppError(data?.message || `Qobuz API error: ${status}`, status);
//             }
//         }
//         throw new AppError(`Qobuz API connection error: ${error.message}`, 500);
//     }
// );
