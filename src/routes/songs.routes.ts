import { getSongById, getSongByLink, getSongsByIds, getSongSuggestions } from '../services/song.service';
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

const providerQuerySchema = z.object({
    provider: z.enum(['saavn', 'gaana']).default('saavn'),
});

const songsRoutes: FastifyPluginAsync = async (app) => {
    const api = app.withTypeProvider<ZodTypeProvider>();

    api.get(
        '/songs',
        {
            schema: {
                querystring: idsQuerySchema.safeExtend(providerQuerySchema.shape),
                tags: ['songs'],
                summary: 'Retrieve songs by ids',
            },
        },
        async (req) => getSongsByIds(req.query.ids, { provider: req.query.provider })
    );

    api.get(
        '/songs/by',
        {
            schema: {
                querystring: byQuerySchema.safeExtend(providerQuerySchema.shape),
                tags: ['songs'],
            },
        },
        async (req) => {
            const { id, link, provider } = req.query;
            return link ? getSongByLink(link, { provider }) : getSongById(id!, { provider });
        }
    );

    api.get(
        '/songs/:id',
        {
            schema: {
                params: idParamSchema,
                querystring: providerQuerySchema,
                tags: ['songs'],
            },
        },
        async (req) => getSongById(req.params.id, { provider: req.query.provider })
    );

    api.get(
        '/songs/:id/suggestions',
        {
            schema: {
                params: idParamSchema,
                querystring: suggestionsQuerySchema.safeExtend(providerQuerySchema.shape),
                tags: ['songs'],
            },
        },
        async (req) => getSongSuggestions(req.params.id, req.query.limit, { provider: req.query.provider })
    );
};

export default songsRoutes;
