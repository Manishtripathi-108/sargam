import { getArtistAlbums, getArtistById, getArtistByLink, getArtistSongs } from '../services/artist.service';
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

const providerQuerySchema = z.object({
    provider: z.enum(['saavn', 'gaana']).default('saavn'),
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
                querystring: byQuerySchema.safeExtend(providerQuerySchema.shape),
                tags: ['artists'],
                summary: 'Retrieve artist by id or link',
            },
        },
        async (req) => {
            const { id, link, provider } = req.query;
            return link ? getArtistByLink(link, { provider }) : getArtistById(id!, { provider });
        }
    );

    api.get(
        '/artists/:id',
        {
            schema: {
                params: idParamSchema,
                querystring: providerQuerySchema,
                tags: ['artists'],
                summary: 'Retrieve artist by id',
            },
        },
        async (req) => getArtistById(req.params.id, { provider: req.query.provider })
    );

    api.get(
        '/artists/:id/songs',
        {
            schema: {
                params: idParamSchema,
                querystring: listQuerySchema.safeExtend(providerQuerySchema.shape),
                tags: ['artists'],
                summary: 'Retrieve artist songs',
            },
        },
        async (req) =>
            getArtistSongs({
                id: req.params.id,
                ...req.query,
                opts: { provider: req.query.provider },
            })
    );

    api.get(
        '/artists/:id/albums',
        {
            schema: {
                params: idParamSchema,
                querystring: listQuerySchema.safeExtend(providerQuerySchema.shape),
                tags: ['artists'],
                summary: 'Retrieve artist albums',
            },
        },
        async (req) =>
            getArtistAlbums({
                id: req.params.id,
                ...req.query,
                opts: { provider: req.query.provider },
            })
    );
};

export default artistRoutes;
