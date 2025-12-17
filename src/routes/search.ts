import type { SearchEntityType } from '../types/music.types';
import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const searchQuerySchema = z.object({
    q: z.string().min(1, 'q is required'),
    type: z
        .enum(['song', 'album', 'artist', 'playlist', 'all'] as [SearchEntityType, ...SearchEntityType[]])
        .optional(),
    limit: z.coerce.number().int().positive().max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
});

const paginationSchema = z.object({
    q: z.string().min(1, 'q is required'),
    limit: z.coerce.number().int().positive().max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
});

const searchRoutes: FastifyPluginAsync = async (app) => {
    const api = app.withTypeProvider<ZodTypeProvider>();
    // Public search endpoints; add authentication hooks here if these become protected.

    api.get(
        '/search',
        {
            schema: {
                summary: 'Global search across songs, albums, artists, playlists',
                tags: ['search'],
                querystring: searchQuerySchema,
                response: {
                    200: z.object({
                        success: z.boolean(),
                        meta: z.object({
                            total: z.number(),
                            limit: z.number(),
                            offset: z.number(),
                        }),
                        results: z.array(
                            z.object({
                                id: z.string(),
                                type: z.enum(['song', 'album', 'artist', 'playlist']),
                                title: z.string(),
                                snippet: z.string(),
                            })
                        ),
                    }),
                },
            },
        },
        async (req) => {
            const { q, type, limit, offset } = req.query;
            const payload = await app.services.searchService.globalSearch({ q, type, limit, offset });
            return payload;
        }
    );

    api.get(
        '/search/songs',
        {
            schema: {
                summary: 'Search songs',
                tags: ['search', 'songs'],
                querystring: paginationSchema,
                response: {
                    200: z.object({
                        success: z.boolean(),
                        data: z.array(
                            z.object({
                                id: z.string(),
                                title: z.string(),
                                artists: z.array(z.string()),
                                album: z.string(),
                                duration: z.number(),
                            })
                        ),
                    }),
                },
            },
        },
        async (req) => {
            const { q, limit, offset } = req.query;
            return app.services.searchService.searchSongs({ q, limit, offset });
        }
    );

    api.get(
        '/search/albums',
        {
            schema: {
                summary: 'Search albums',
                tags: ['search', 'albums'],
                querystring: paginationSchema,
                response: {
                    200: z.object({
                        success: z.boolean(),
                        data: z.array(
                            z.object({
                                id: z.string(),
                                title: z.string(),
                                artists: z.array(z.string()),
                                year: z.number(),
                            })
                        ),
                    }),
                },
            },
        },
        async (req) => {
            const { q, limit, offset } = req.query;
            return app.services.searchService.searchAlbums({ q, limit, offset });
        }
    );

    api.get(
        '/search/artists',
        {
            schema: {
                summary: 'Search artists',
                tags: ['search', 'artists'],
                querystring: paginationSchema,
                response: {
                    200: z.object({
                        success: z.boolean(),
                        data: z.array(
                            z.object({
                                id: z.string(),
                                name: z.string(),
                                genres: z.array(z.string()),
                            })
                        ),
                    }),
                },
            },
        },
        async (req) => {
            const { q, limit, offset } = req.query;
            return app.services.searchService.searchArtists({ q, limit, offset });
        }
    );

    api.get(
        '/search/playlists',
        {
            schema: {
                summary: 'Search playlists',
                tags: ['search', 'playlists'],
                querystring: paginationSchema,
                response: {
                    200: z.object({
                        success: z.boolean(),
                        data: z.array(
                            z.object({
                                id: z.string(),
                                title: z.string(),
                                ownerId: z.string(),
                            })
                        ),
                    }),
                },
            },
        },
        async (req) => {
            const { q, limit, offset } = req.query;
            return app.services.searchService.searchPlaylists({ q, limit, offset });
        }
    );
};

export default searchRoutes;
