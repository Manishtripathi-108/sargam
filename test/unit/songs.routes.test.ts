import { buildTestApp } from '../helpers/buildTestApp.ts';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

let app: Awaited<ReturnType<typeof buildTestApp>>;

describe('songs routes', () => {
    beforeAll(async () => {
        app = await buildTestApp();
    });

    afterAll(async () => {
        await app.close();
    });

    it('returns song by id', async () => {
        const res = await app.inject({ method: 'GET', url: '/api/songs/song-1' });
        expect(res.statusCode).toBe(200);
        const body = res.json();
        expect(body.success).toBe(true);
        expect(body.title).toBe('Morning Raga');
    });

    it('validates songs/by requiring id or link', async () => {
        const res = await app.inject({ method: 'GET', url: '/api/songs/by' });
        expect(res.statusCode).toBe(400);
        const body = res.json();
        expect(body.success).toBe(false);
        expect(body.issues?.length).toBeGreaterThan(0);
    });

    it('returns 404 for missing song', async () => {
        const res = await app.inject({ method: 'GET', url: '/api/songs/unknown-song' });
        expect(res.statusCode).toBe(404);
        const body = res.json();
        expect(body.success).toBe(false);
    });
});
