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
            return a.message < b.message ? -1 : a.message > b.message ? 1 : 0;
        });
};
