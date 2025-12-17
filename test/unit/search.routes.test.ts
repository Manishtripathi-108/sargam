import { buildTestApp } from '../helpers/buildTestApp';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

let app: Awaited<ReturnType<typeof buildTestApp>>;

describe('search routes', () => {
    beforeAll(async () => {
        app = await buildTestApp();
    });

    afterAll(async () => {
        await app.close();
    });

    it('performs global search with defaults', async () => {
        const res = await app.inject({ method: 'GET', url: '/api/search', query: { q: 'city' } });
        expect(res.statusCode).toBe(200);
        const body = res.json();
        expect(body.success).toBe(true);
        expect(body.meta.limit).toBe(20);
        expect(Array.isArray(body.results)).toBe(true);
    });

    it('returns validation error when q is missing', async () => {
        const res = await app.inject({ method: 'GET', url: '/api/search' });
        expect(res.statusCode).toBe(400);
        const body = res.json();
        expect(body.success).toBe(false);
        expect(body.issues?.length).toBeGreaterThan(0);
    });
});
