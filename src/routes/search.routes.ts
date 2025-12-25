import { globalSearch, searchAlbums, searchArtists, searchPlaylists, searchSongs } from '../services/search.service';
import { globalSearchQuery, searchQuery } from '../validators/common.validators';
import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

const searchRoutes: FastifyPluginAsync = async (app) => {
    const api = app.withTypeProvider<ZodTypeProvider>();

    api.get(
        '/search',
        {
            schema: {
                querystring: globalSearchQuery,
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
                opts: { provider: req.query.provider },
            })
    );

    api.get(
        '/search/songs',
        {
            schema: {
                querystring: searchQuery,
                tags: ['search'],
            },
        },
        async (req) =>
            searchSongs({
                query: req.query.q,
                limit: req.query.limit,
                offset: req.query.offset,
                opts: { provider: req.query.provider },
            })
    );

    api.get(
        '/search/albums',
        {
            schema: {
                querystring: searchQuery,
                tags: ['search'],
            },
        },
        async (req) =>
            searchAlbums({
                query: req.query.q,
                limit: req.query.limit,
                offset: req.query.offset,
                opts: { provider: req.query.provider },
            })
    );

    api.get(
        '/search/artists',
        {
            schema: {
                querystring: searchQuery,
                tags: ['search'],
            },
        },
        async (req) =>
            searchArtists({
                query: req.query.q,
                limit: req.query.limit,
                offset: req.query.offset,
                opts: { provider: req.query.provider },
            })
    );

    api.get(
        '/search/playlists',
        {
            schema: {
                querystring: searchQuery,
                tags: ['search'],
            },
        },
        async (req) =>
            searchPlaylists({
                query: req.query.q,
                limit: req.query.limit,
                offset: req.query.offset,
                opts: { provider: req.query.provider },
            })
    );
};

export default searchRoutes;
