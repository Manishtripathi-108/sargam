import { buildTestApp } from '../helpers/buildTestApp';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

let app: Awaited<ReturnType<typeof buildTestApp>>;

describe('albums routes', () => {
    beforeAll(async () => {
        app = await buildTestApp();
    });

    afterAll(async () => {
        await app.close();
    });

    it('retrieves album by id', async () => {
        const res = await app.inject({ method: 'GET', url: '/api/albums/by', query: { id: 'album-1' } });
        expect(res.statusCode).toBe(200);
        const body = res.json();
        expect(body.success).toBe(true);
        expect(body.tracks?.length).toBeGreaterThan(0);
    });

    it('validates missing id and link', async () => {
        const res = await app.inject({ method: 'GET', url: '/api/albums/by' });
        expect(res.statusCode).toBe(400);
        const body = res.json();
        expect(body.success).toBe(false);
    });
});
