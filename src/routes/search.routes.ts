import { globalSearch, searchSongs, searchAlbums, searchArtists, searchPlaylists } from '../services/search.service';
import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const baseQuery = {
    q: z.string().min(1, 'Query required'),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    offset: z.coerce.number().int().min(0).default(0),
};

const globalSchema = z.object({
    ...baseQuery,
    type: z.enum(['song', 'album', 'artist', 'playlist', 'all']).default('all'),
});

const simpleSchema = z.object(baseQuery);

const searchRoutes: FastifyPluginAsync = async (app) => {
    const api = app.withTypeProvider<ZodTypeProvider>();

    api.get(
        '/search',
        {
            schema: {
                querystring: globalSchema,
                tags: ['search'],
                summary: 'Global search',
            },
        },
        async (req) =>
            globalSearch({
                query: req.query.q,
                type: req.query.type,
                limit: req.query.limit,
                offset: req.query.offset,
            })
    );

    api.get('/search/songs', { schema: { querystring: simpleSchema, tags: ['search'] } }, async (req) =>
        searchSongs({
            query: req.query.q,
            limit: req.query.limit,
            offset: req.query.offset,
        })
    );

    api.get('/search/albums', { schema: { querystring: simpleSchema, tags: ['search'] } }, async (req) =>
        searchAlbums({
            query: req.query.q,
            limit: req.query.limit,
            offset: req.query.offset,
        })
    );

    api.get('/search/artists', { schema: { querystring: simpleSchema, tags: ['search'] } }, async (req) =>
        searchArtists({
            query: req.query.q,
            limit: req.query.limit,
            offset: req.query.offset,
        })
    );

    api.get('/search/playlists', { schema: { querystring: simpleSchema, tags: ['search'] } }, async (req) =>
        searchPlaylists({
            query: req.query.q,
            limit: req.query.limit,
            offset: req.query.offset,
        })
    );
};

export default searchRoutes;
