import { getSongById, getSongsByIds, getSongByLink, getSongSuggestions } from '../services/song.service';
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
    id: z.string().min(1, 'Song ID required'),
});

const idsQuerySchema = z.object({
    ids: z.string().min(1, 'Song IDs required'),
});

const suggestionsQuerySchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(10),
});

const songsRoutes: FastifyPluginAsync = async (app) => {
    const api = app.withTypeProvider<ZodTypeProvider>();

    api.get(
        '/songs',
        {
            schema: {
                querystring: idsQuerySchema,
                tags: ['songs'],
                summary: 'Retrieve songs by ids',
            },
        },
        async (req) => getSongsByIds(req.query.ids)
    );

    api.get(
        '/songs/by',
        {
            schema: {
                querystring: byQuerySchema,
                tags: ['songs'],
            },
        },
        async (req) => (req.query.link ? getSongByLink(req.query.link) : getSongById(req.query.id!))
    );

    api.get(
        '/songs/:id',
        {
            schema: {
                params: idParamSchema,
                tags: ['songs'],
            },
        },
        async (req) => getSongById(req.params.id)
    );

    api.get(
        '/songs/:id/suggestions',
        {
            schema: {
                params: idParamSchema,
                querystring: suggestionsQuerySchema,
                tags: ['songs'],
            },
        },
        async (req) => getSongSuggestions(req.params.id, req.query.limit)
    );
};

export default songsRoutes;
