import { getArtistById, getArtistByLink, getArtistSongs, getArtistAlbums } from '../services/artist.service';
import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const byQuerySchema = z
    .object({
        id: z.string().optional(),
        link: z.string().optional(),
    })
    .refine((v) => v.id || v.link, {
        message: 'Either id or link is required',
        path: ['id'],
    });

const idParamSchema = z.object({
    id: z.string().min(1, 'Artist id required'),
});

const listQuerySchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(10),
    offset: z.coerce.number().int().min(0).default(0),
    sortBy: z.enum(['popularity', 'alphabetical', 'latest']).default('popularity'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

const artistRoutes: FastifyPluginAsync = async (app) => {
    const api = app.withTypeProvider<ZodTypeProvider>();

    api.get(
        '/artists/by',
        {
            schema: {
                querystring: byQuerySchema,
                tags: ['artists'],
                summary: 'Retrieve artist by id or link',
            },
        },
        async (req) => {
            const { id, link } = req.query;
            return link ? getArtistByLink(link) : getArtistById(id!);
        }
    );

    api.get(
        '/artists/:id',
        {
            schema: {
                params: idParamSchema,
                tags: ['artists'],
                summary: 'Retrieve artist by id',
            },
        },
        async (req) => getArtistById(req.params.id)
    );

    api.get(
        '/artists/:id/songs',
        {
            schema: {
                params: idParamSchema,
                querystring: listQuerySchema,
                tags: ['artists'],
                summary: 'Retrieve artist songs',
            },
        },
        async (req) =>
            getArtistSongs({
                id: req.params.id,
                ...req.query,
            })
    );

    api.get(
        '/artists/:id/albums',
        {
            schema: {
                params: idParamSchema,
                querystring: listQuerySchema,
                tags: ['artists'],
                summary: 'Retrieve artist albums',
            },
        },
        async (req) =>
            getArtistAlbums({
                id: req.params.id,
                ...req.query,
            })
    );
};

export default artistRoutes;
