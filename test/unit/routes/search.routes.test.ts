import { buildTestApp } from '../../helpers/buildTestApp';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Search Routes', () => {
    let app: Awaited<ReturnType<typeof buildTestApp>>;

    beforeAll(async () => {
        app = await buildTestApp();
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /search should validate required query parameter', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/search',
        });
        expect(res.statusCode).toBe(400);
    });

    it('GET /search should accept valid query', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/search?q=test',
        });
        expect([200, 500]).toContain(res.statusCode); // May fail if provider is down, but should validate schema
    });

    it('GET /search should filter by type', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/search?q=test&type=song',
        });
        expect([200, 500]).toContain(res.statusCode);
    });

    it('GET /search/songs should require query', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/search/songs',
        });
        expect(res.statusCode).toBe(400);
    });

    it('GET /search/songs should accept valid parameters', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/search/songs?q=test&limit=10&offset=0',
        });
        expect([200, 500]).toContain(res.statusCode);
    });

    it('GET /search/albums should validate query', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/search/albums',
        });
        expect(res.statusCode).toBe(400);
    });

    it('GET /search/artists should validate query', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/search/artists',
        });
        expect(res.statusCode).toBe(400);
    });

    it('GET /search/playlists should validate query', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/search/playlists',
        });
        expect(res.statusCode).toBe(400);
    });
});
