import { DefaultSearchService } from '../services/search.service';
import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const baseQuery = {
    q: z.string('Search Query required').min(1, 'Query required'),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
};

const globalQuerySchema = z.object({
    ...baseQuery,
    type: z.enum(['song', 'album', 'artist', 'playlist', 'all']).default('all'),
});

const simpleQuerySchema = z.object(baseQuery);

const searchRoutes: FastifyPluginAsync = async (app) => {
    const api = app.withTypeProvider<ZodTypeProvider>();
    const service = new DefaultSearchService();

    api.get(
        '/search',
        {
            schema: {
                querystring: globalQuerySchema,
                tags: ['search'],
                summary: 'Global search across all content types',
            },
        },
        async (req) => {
            const { q, type, limit, offset } = req.query;
            return service.globalSearch(q, type, limit, offset);
        }
    );

    api.get(
        '/search/songs',
        {
            schema: {
                querystring: simpleQuerySchema,
                tags: ['search'],
                summary: 'Search songs',
            },
        },
        async (req) => {
            const { q, limit, offset } = req.query;
            return service.searchSongs(q, limit, offset);
        }
    );

    api.get(
        '/search/albums',
        {
            schema: {
                querystring: simpleQuerySchema,
                tags: ['search'],
                summary: 'Search albums',
            },
        },
        async (req) => {
            const { q, limit, offset } = req.query;
            return service.searchAlbums(q, limit, offset);
        }
    );

    api.get(
        '/search/artists',
        {
            schema: {
                querystring: simpleQuerySchema,
                tags: ['search'],
                summary: 'Search artists',
            },
        },
        async (req) => {
            const { q, limit, offset } = req.query;
            return service.searchArtists(q, limit, offset);
        }
    );

    api.get(
        '/search/playlists',
        {
            schema: {
                querystring: simpleQuerySchema,
                tags: ['search'],
                summary: 'Search playlists',
            },
        },
        async (req) => {
            const { q, limit, offset } = req.query;
            return service.searchPlaylists(q, limit, offset);
        }
    );
};

export default searchRoutes;
