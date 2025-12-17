import { buildTestApp } from '../helpers/buildTestApp.ts';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

let app: Awaited<ReturnType<typeof buildTestApp>>;

describe('artists routes', () => {
    beforeAll(async () => {
        app = await buildTestApp();
    });

    afterAll(async () => {
        await app.close();
    });

    it('retrieves artists by id', async () => {
        const res = await app.inject({ method: 'GET', url: '/api/artists/by', query: { id: 'artist-1' } });
        expect(res.statusCode).toBe(200);
        const body = res.json();
        expect(body.success).toBe(true);
        const data = body.data ?? body;
        expect(Array.isArray(data)).toBe(true);
        expect((data as unknown[]).length).toBeGreaterThan(0);
    });

    it('returns artist songs', async () => {
        const res = await app.inject({ method: 'GET', url: '/api/artists/artist-1/songs', query: { limit: 2 } });
        expect(res.statusCode).toBe(200);
        const body = res.json();
        const data = body.data ?? body;
        expect(Array.isArray(data)).toBe(true);
        expect(data.length).toBeGreaterThan(0);
    });

    it('returns 404 when artist missing', async () => {
        const res = await app.inject({ method: 'GET', url: '/api/artists/unknown/songs' });
        expect(res.statusCode).toBe(404);
        const body = res.json();
        expect(body.success).toBe(false);
    });
});
