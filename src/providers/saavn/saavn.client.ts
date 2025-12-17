import { getRandomUserAgent } from '../../constants/user-agents.constants';
import SAAVN_ROUTES from './saavn.routes';
import axios from 'axios';

export const saavnClient = axios.create({
    baseURL: SAAVN_ROUTES.BASE,
    headers: {
        'Content-Type': 'application/json',
        cookie: 'gdpr_acceptance=true; DL=english',
    },
});

saavnClient.interceptors.request.use((config) => {
    config.params = {
        ...config.params,
        _format: 'json',
        _marker: '0',
        api_version: 4,
        cc: 'IN',
        ctx: config.params?.ctx ?? 'web6dot0',
    };

    config.headers['User-Agent'] = getRandomUserAgent();
    return config;
});
