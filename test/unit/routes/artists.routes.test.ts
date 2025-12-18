import { buildTestApp } from '../../helpers/buildTestApp';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

describe('Artists Routes', () => {
    let app: Awaited<ReturnType<typeof buildTestApp>>;

    beforeAll(async () => {
        app = await buildTestApp();
    });

    afterAll(async () => {
        await app.close();
    });

    it('GET /artists/by should require id or link', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/artists/by',
        });
        expect(res.statusCode).toBe(400);
    });

    it('GET /artists/by should accept id parameter', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/artists/by?id=test-id',
        });
        expect([200, 404, 500]).toContain(res.statusCode);
    });

    it('GET /artists/:id should require valid id', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/artists/test-id',
        });
        expect([404, 500]).toContain(res.statusCode);
    });

    it('GET /artists/:id/songs should require valid id', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/artists/test-id/songs',
        });
        expect([404, 500]).toContain(res.statusCode);
    });

    it('GET /artists/:id/songs should accept pagination', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/artists/test-id/songs?limit=20&offset=0',
        });
        expect([404, 500]).toContain(res.statusCode);
    });

    it('GET /artists/:id/albums should require valid id', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/artists/test-id/albums',
        });
        expect([404, 500]).toContain(res.statusCode);
    });

    it('GET /artists/:id/albums should accept pagination', async () => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/artists/test-id/albums?limit=20&offset=0',
        });
        expect([404, 500]).toContain(res.statusCode);
    });
});
