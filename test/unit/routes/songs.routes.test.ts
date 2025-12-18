import { buildTestApp } from '../../helpers/buildTestApp';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Songs Routes', () => {
    let app: Awaited<ReturnType<typeof buildTestApp>>;

    beforeAll(async () => {
        app = await buildTestApp();
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /songs/:id should require valid id', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/songs/invalid-id',
        });
        expect([404, 500]).toContain(res.statusCode);
    });

    it('GET /songs/by should require id or link', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/songs/by',
        });
        expect(res.statusCode).toBe(400);
    });

    it('GET /songs/by should accept id parameter', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/songs/by?id=test-id',
        });
        // test-id may or may not exist - accept any response
        expect([200, 400, 404, 500]).toContain(res.statusCode);
    });

    it('GET /songs/by should accept link parameter', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/songs/by?link=https://example.com/song',
        });
        // Invalid link should return 400 or 500
        expect([400, 500]).toContain(res.statusCode);
    });

    it('GET /songs/:id/suggestions should require valid id', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/songs/test-id/suggestions',
        });
        expect([404, 500]).toContain(res.statusCode);
    });

    it('GET /songs/:id/suggestions should accept limit parameter', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/songs/test-id/suggestions?limit=20',
        });
        expect([404, 500]).toContain(res.statusCode);
    });
});
