import type { QobuzLoginResponse, QobuzUserCredentials } from '../../types/qobuz';
import { assertData } from '../../utils/error.utils';
import { qobuzClient } from './qobuz.client';
import { extractAppCredentials, getAppCredentials } from './qobuz.extractor';
import QOBUZ_ROUTES from './qobuz.routes';
import crypto from 'crypto';

// User session state
type UserSession = {
    userId: string | null;
    userAuthToken: string | null;
    email: string | null;
    displayName: string | null;
    subscription: string | null;
    isAuthenticated: boolean;
};

let userSession: UserSession = {
    userId: null,
    userAuthToken: null,
    email: null,
    displayName: null,
    subscription: null,
    isAuthenticated: false,
};

// Cached app secret (lazy loaded)
let appSecret: string | null = process.env.QOBUZ_APP_SECRET || null;

export const getUserSession = (): UserSession => ({ ...userSession });

export const isAuthenticated = (): boolean => userSession.isAuthenticated && !!userSession.userAuthToken;

export const getUserAuthToken = (): string | null => userSession.userAuthToken;

/** Initialize authentication from environment variables (token or email/password). */
export async function initFromEnv(): Promise<boolean> {
    const envToken = process.env.QOBUZ_USER_AUTH_TOKEN;
    const envUserId = process.env.QOBUZ_USER_ID;

    if (envToken && envUserId) {
        userSession = {
            userId: envUserId,
            userAuthToken: envToken,
            email: null,
            displayName: null,
            subscription: null,
            isAuthenticated: true,
        };
        return true;
    }

    const email = process.env.QOBUZ_EMAIL;
    const password = process.env.QOBUZ_PASSWORD;

    if (email && password) {
        try {
            await login({ email, password });
            return true;
        } catch (error) {
            console.error('Failed to login with email/password:', error);
            return false;
        }
    }

    return false;
}

/** Login with email and password. Password is hashed with MD5 as per Qobuz API. */
export async function login(credentials: QobuzUserCredentials): Promise<QobuzLoginResponse> {
    const passwordHash = crypto.createHash('md5').update(credentials.password).digest('hex');

    const res = await qobuzClient.get<QobuzLoginResponse>(QOBUZ_ROUTES.USER.LOGIN, {
        params: {
            email: credentials.email,
            password: passwordHash,
        },
    });

    const data = assertData(res.data, 'Login failed');

    userSession = {
        userId: data.user.id.toString(),
        userAuthToken: data.user_auth_token,
        email: data.user.email,
        displayName: data.user.display_name,
        subscription: data.user.credential?.label || null,
        isAuthenticated: true,
    };

    return data;
}

export function logout(): void {
    userSession = {
        userId: null,
        userAuthToken: null,
        email: null,
        displayName: null,
        subscription: null,
        isAuthenticated: false,
    };
}

export async function getCurrentUser() {
    if (!isAuthenticated()) {
        throw new Error('User not authenticated');
    }

    const res = await qobuzClient.get(QOBUZ_ROUTES.USER.GET, {
        params: { user_id: userSession.userId },
        headers: { 'X-User-Auth-Token': userSession.userAuthToken },
    });

    return assertData(res.data, 'Failed to get user info');
}

export function getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};

    if (userSession.userAuthToken) {
        headers['X-User-Auth-Token'] = userSession.userAuthToken;
    }

    return headers;
}

/**
 * Generate request signature for authenticated endpoints.
 * Signature: MD5("trackgetFileUrlformat_id{quality}intentstreamtrack_id{track_id}{timestamp}{secret}")
 */
export async function generateRequestSignature(trackId: string, formatId: string, timestamp: number): Promise<string> {
    const secret = await getAppSecret();
    if (!secret) {
        throw new Error('App secret not available. Cannot generate request signature.');
    }
    const rawSignature = `trackgetFileUrlformat_id${formatId}intentstreamtrack_id${trackId}${timestamp}${secret}`;
    return crypto.createHash('md5').update(rawSignature).digest('hex');
}

/** Get app secret, extracting from Qobuz if not set via env */
async function getAppSecret(): Promise<string | null> {
    if (appSecret) return appSecret;

    const credentials = await getAppCredentials();
    if (credentials) {
        appSecret = credentials.appSecret;
    }
    return appSecret;
}

export { extractAppCredentials, getAppCredentials };
