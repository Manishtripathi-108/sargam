/**
 * Qobuz API Client
 *
 * Configure via environment variables:
 * - QOBUZ_APP_ID: Application ID (required)
 * - QOBUZ_APP_SECRET: Application secret for stream URLs (required for full streams)
 */
import { getBrowserHeaders } from '../../constants/user-agents.constants';
import QOBUZ_ROUTES from './qobuz.routes';
import axios from 'axios';

const APP_ID = process.env.QOBUZ_APP_ID!;
const APP_SECRET = process.env.QOBUZ_APP_SECRET!;

/** Get configured app ID */
export const getAppId = (): string => APP_ID;

/** Get configured app secret */
export const getAppSecret = (): string => APP_SECRET;

/** Qobuz API axios client */
export const qobuzClient = axios.create({
    baseURL: QOBUZ_ROUTES.BASE,
    headers: {
        Accept: 'application/json',
        origin: 'https://play.qobuz.com',
        referer: 'https://play.qobuz.com/',
        'x-app-id': APP_ID,
    },
    params: {
        app_id: APP_ID,
    },
});

// Request interceptor for browser headers
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
