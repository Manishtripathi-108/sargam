/**
 * Indicates whether the application is running in development mode.
 * Returns true for any environment except 'production'.
 */
export const isDev = process.env.NODE_ENV !== 'production';
