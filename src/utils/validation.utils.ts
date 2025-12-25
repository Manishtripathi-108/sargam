import type { ZodFastifySchemaValidationError } from 'fastify-type-provider-zod';

/**
 * Normalizes a Zod validation path by removing leading slashes.
 * Returns 'root' if the path is empty after normalization.
 * @param path - The Zod path to normalize.
 * @returns The normalized Zod path.
 * @example
 * normalizeZodPath("/body/email") => "body/email"
 * normalizeZodPath("/email") => "email"
 * normalizeZodPath("") => "root"
 */
const normalizeZodPath = (path: string): string => {
    // Zod paths look like "/body/email" or "/email", so remove leading slash(es)
    const trimmed = path?.replace(/^\/+/, '') ?? '';
    return trimmed || 'root';
};

/**
 * Formats and sorts an array of Zod validation errors into a more readable structure.
 * Normalizes Zod paths and sorts by path first, then by message.
 * @param issues - An array of ZodFastifySchemaValidationError objects.
 * @returns An array of objects with `path` and `message` properties, sorted by path and message.
 * @example
 * formatZodValidationErrors([{ instancePath: "/body/email", message: "Invalid email" }])
 * => [{ path: "body/email", message: "Invalid email" }]
 */
export const formatZodValidationErrors = (issues: ZodFastifySchemaValidationError[]) => {
    return issues
        .map((issue) => ({ path: normalizeZodPath(issue.instancePath), message: issue.message }))
        .sort((a, b) => {
            // Primary sort: path, secondary sort: message
            if (a.path < b.path) return -1;
            if (a.path > b.path) return 1;
            const msgA = a.message ?? '';
            const msgB = b.message ?? '';
            return msgA < msgB ? -1 : msgA > msgB ? 1 : 0;
        });
};
