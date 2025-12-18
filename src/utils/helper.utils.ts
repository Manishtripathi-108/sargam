import type { ZodFastifySchemaValidationError } from 'fastify-type-provider-zod';

const normalizeZodPath = (p: string) => {
    // zod paths look like "/body/email" or "/email", so remove leading slash(es)
    const trimmed = p?.replace(/^\/+/, '') ?? '';
    return trimmed || 'root';
};

export const formatAndSortZodIssues = (issues: ZodFastifySchemaValidationError[]) => {
    return issues
        .map((i) => ({ path: normalizeZodPath(i.instancePath), message: i.message }))
        .sort((a, b) => {
            // primary: path, secondary: message
            if (a.path < b.path) return -1;
            if (a.path > b.path) return 1;
            const msgA = a.message ?? '';
            const msgB = b.message ?? '';
            return msgA < msgB ? -1 : msgA > msgB ? 1 : 0;
        });
};
