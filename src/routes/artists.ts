import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const toFastifyPath = (path: string) => path.replace(/\{(\w+)\}/g, ':$1');

const artistParamsSchema = z.object({ id: z.string().min(1) });

const paginationSchema = z.object({
    limit: z.coerce.number().int().positive().max(100).default(50),
    offset: z.coerce.number().int().min(0).default(0),
});

const songSummarySchema = z.object({
    id: z.string(),
    title: z.string(),
    artists: z.array(z.string()),
    album: z.string(),
    duration: z.number(),
});

const albumSummarySchema = z.object({
    id: z.string(),
    title: z.string(),
    artists: z.array(z.string()),
    year: z.number(),
});

const artistSchema = z.object({
    id: z.string(),
    name: z.string(),
    bio: z.string().optional(),
    genres: z.array(z.string()),
    topTracks: z.array(songSummarySchema),
});

const artistsRoutes: FastifyPluginAsync = async (app) => {
    const api = app.withTypeProvider<ZodTypeProvider>();
    // Public artist endpoints; add authentication hooks when protection is required.

    const artistByIdPath = '/artists/{id}';
    api.get(
        toFastifyPath(artistByIdPath),
        {
            schema: {
                summary: 'Retrieve artist by id',
                tags: ['artists'],
                params: artistParamsSchema,
                response: { 200: artistSchema },
            },
        },
        async (req) => {
            return app.services.artistService.getArtistById(req.params.id);
        }
    );

    const artistSongsPath = '/artists/{id}/songs';
    api.get(
        toFastifyPath(artistSongsPath),
        {
            schema: {
                summary: 'Retrieve artist songs',
                tags: ['artists', 'songs'],
                params: artistParamsSchema,
                querystring: paginationSchema,
                response: { 200: z.object({ data: z.array(songSummarySchema) }) },
            },
        },
        async (req) => {
            const { id } = req.params;
            const { limit, offset } = req.query;
            return app.services.artistService.getArtistSongs({ id, limit, offset });
        }
    );

    const artistAlbumsPath = '/artists/{id}/albums';
    api.get(
        artistAlbumsPath,
        {
            schema: {
                summary: 'Retrieve artist albums',
                tags: ['artists', 'albums'],
                params: artistParamsSchema,
                querystring: paginationSchema,
                response: { 200: z.object({ success: z.boolean(), data: z.array(albumSummarySchema) }) },
            },
        },
        async (req) => {
            const { id } = req.params;
            const { limit, offset } = req.query;
            return app.services.artistService.getArtistAlbums({ id, limit, offset });
        }
    );
};

export default artistsRoutes;
