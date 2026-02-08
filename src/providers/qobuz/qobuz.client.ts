import { getBrowserHeaders } from '../../constants/user-agents.constants';
import { getAppCredentials } from './qobuz.extractor';
import QOBUZ_ROUTES from './qobuz.routes';
import axios from 'axios';

// Default app ID (used until credentials are extracted)
const DEFAULT_APP_ID = process.env.QOBUZ_APP_ID || '798273057';

export const qobuzClient = axios.create({
    baseURL: QOBUZ_ROUTES.BASE,
    headers: {
        Accept: 'application/json',
        origin: 'https://play.qobuz.com',
        referer: 'https://play.qobuz.com/',
        'x-app-id': DEFAULT_APP_ID,
    },
    params: {
        app_id: DEFAULT_APP_ID,
    },
});

// Initialize client with extracted credentials (call this before making authenticated requests)
let clientInitialized = false;

export async function initializeClient(): Promise<void> {
    if (clientInitialized) return;

    const credentials = await getAppCredentials();
    if (credentials) {
        qobuzClient.defaults.headers['x-app-id'] = credentials.appId;
        qobuzClient.defaults.params = {
            ...qobuzClient.defaults.params,
            app_id: credentials.appId,
        } as Record<string, unknown>;
    }
    clientInitialized = true;
}

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
