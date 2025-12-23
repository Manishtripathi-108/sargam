import { DefaultArtistService } from '../services/artist.service';
import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const artistByQuerySchema = z
    .object({
        id: z.string().optional(),
        link: z.string().optional(),
    })
    .refine((v) => v.id || v.link, {
        message: 'Either id or link is required',
        path: ['id'],
    });

const artistIdParamSchema = z.object({
    id: z.string('Artist id required').min(1, 'Artist id required'),
});

const artistSongsQuerySchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(10),
    offset: z.coerce.number().int().min(0).default(0),
    sortBy: z.enum(['popularity', 'alphabetical', 'latest']).default('popularity'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

const artistRoutes: FastifyPluginAsync = async (app) => {
    const api = app.withTypeProvider<ZodTypeProvider>();
    const service = new DefaultArtistService();

    api.get(
        '/artists/by',
        {
            schema: {
                querystring: artistByQuerySchema,
                tags: ['artists'],
                summary: 'Retrieve artist by id or link',
            },
        },
        async (req) => {
            const { id, link } = req.query;

            if (link) {
                return service.getByLink(link);
            }

            return service.getById(id!);
        }
    );

    api.get(
        '/artists/:id',
        {
            schema: {
                params: artistIdParamSchema,
                tags: ['artists'],
                summary: 'Retrieve artist by id',
            },
        },
        async (req) => {
            const { id } = req.params;
            return service.getById(id);
        }
    );

    api.get(
        '/artists/:id/songs',
        {
            schema: {
                params: artistIdParamSchema,
                querystring: artistSongsQuerySchema,
                tags: ['artists'],
                summary: 'Retrieve artist songs',
            },
        },
        async (req) => {
            const { id } = req.params;
            const { offset, limit, sortBy, sortOrder } = req.query;

            return service.getSongs({ id, offset, limit, sortBy, sortOrder });
        }
    );

    api.get(
        '/artists/:id/albums',
        {
            schema: {
                params: artistIdParamSchema,
                querystring: artistSongsQuerySchema,
                tags: ['artists'],
                summary: 'Retrieve artist albums',
            },
        },
        async (req) => {
            const { id } = req.params;
            const { offset, limit, sortBy, sortOrder } = req.query;

            return service.getAlbums({ id, offset, limit, sortBy, sortOrder });
        }
    );
};

export default artistRoutes;
