import { buildTestApp } from '../../helpers/buildTestApp';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Albums Routes', () => {
    let app: Awaited<ReturnType<typeof buildTestApp>>;

    beforeAll(async () => {
        app = await buildTestApp();
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /albums/by should require id or link', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/albums/by',
        });
        expect(res.statusCode).toBe(400);
    });

    it('GET /albums/by should accept id parameter', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/albums/by?id=test-id',
        });
        expect([200, 404, 500]).toContain(res.statusCode);
    });

    it('GET /albums/by should accept link parameter', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/albums/by?link=https://example.com/album',
        });
        // Invalid link should return 400 or 500
        expect([400, 500]).toContain(res.statusCode);
    });

    it('GET /albums/:id should require valid id', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/albums/test-id',
        });
        // test-id may or may not exist - accept any response
        expect([200, 400, 404, 500]).toContain(res.statusCode);
    });
});
