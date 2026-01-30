/**
 * Qobuz Authentication Module
 *
 * Handles user authentication and session management.
 *
 * Environment variables:
 * - QOBUZ_EMAIL: User email for login
 * - QOBUZ_PASSWORD: User password for login
 * - QOBUZ_USER_AUTH_TOKEN: Pre-existing auth token (alternative to email/password)
 * - QOBUZ_USER_ID: User ID (used with auth token)
 */
import type { QobuzLoginResponse, QobuzUserCredentials } from '../../types/qobuz';
import { assertData } from '../../utils/error.utils';
import { getAppSecret, qobuzClient } from './qobuz.client';
import QOBUZ_ROUTES from './qobuz.routes';
import crypto from 'crypto';

// User session state
interface UserSession {
    userId: string | null;
    userAuthToken: string | null;
    email: string | null;
    displayName: string | null;
    subscription: string | null;
    isAuthenticated: boolean;
}

let userSession: UserSession = {
    userId: null,
    userAuthToken: null,
    email: null,
    displayName: null,
    subscription: null,
    isAuthenticated: false,
};

/** Get current user session state */
export const getUserSession = (): UserSession => ({ ...userSession });

/** Check if user is authenticated */
export const isAuthenticated = (): boolean => userSession.isAuthenticated && !!userSession.userAuthToken;

/** Get the user auth token for API requests */
export const getUserAuthToken = (): string | null => userSession.userAuthToken;

/**
 * Initialize authentication from environment variables.
 * Checks for pre-existing auth token or email/password.
 */
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

/**
 * Login with email and password.
 * Password is hashed with MD5 as per Qobuz requirement.
 */
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

/** Logout and clear session */
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

/** Get current user info (requires authentication) */
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

/** Get authenticated headers for API requests */
export function getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};

    if (userSession.userAuthToken) {
        headers['X-User-Auth-Token'] = userSession.userAuthToken;
    }

    return headers;
}

/**
 * Generate request signature for authenticated endpoints.
 * Used for file URL and other protected endpoints.
 *
 * Formula: MD5("trackgetFileUrlformat_id{quality}intentstreamtrack_id{track_id}{timestamp}{secret}")
 */
export function generateRequestSignature(trackId: string, formatId: string, timestamp: number): string {
    const rawSignature = `trackgetFileUrlformat_id${formatId}intentstreamtrack_id${trackId}${timestamp}${getAppSecret()}`;
    return crypto.createHash('md5').update(rawSignature).digest('hex');
}
