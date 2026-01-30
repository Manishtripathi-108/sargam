import { getBrowserHeaders } from '../../constants/user-agents.constants';
import QOBUZ_ROUTES from './qobuz.routes';
import axios from 'axios';

const APP_ID = process.env.QOBUZ_APP_ID!;
const APP_SECRET = process.env.QOBUZ_APP_SECRET!;

export const getAppId = (): string => APP_ID;
export const getAppSecret = (): string => APP_SECRET;

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
