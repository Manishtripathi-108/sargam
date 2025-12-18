import { DefaultSongService } from '../services/song.service';
import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const songByQuerySchema = z
    .object({
        id: z.string().optional(),
        link: z.string().optional(),
    })
    .refine((data) => data.id || data.link, {
        message: 'Either id or link is required',
        path: ['id'],
    });

const songIdParamSchema = z.object({
    id: z.string('Song ID required').min(1, 'Song ID required'),
});

const songIdsParamsSchema = z.object({
    ids: z
        .string()
        .min(1, 'Song IDs required')
        .refine((val) => val.split(',').length > 0, {
            message: 'At least one Song ID must be provided',
        }),
});

const songSuggestionsQuerySchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(10),
});

const songsRoutes: FastifyPluginAsync = async (app) => {
    const api = app.withTypeProvider<ZodTypeProvider>();
    const songService = new DefaultSongService();

    api.get(
        '/songs',
        {
            schema: {
                querystring: songIdsParamsSchema,
                tags: ['songs'],
                summary: 'Retrieve multiple songs by ids',
            },
        },
        async (req) => {
            const { ids } = req.query;
            return songService.getByIds(ids);
        }
    );

    api.get(
        '/songs/by',
        {
            schema: {
                querystring: songByQuerySchema,
                tags: ['songs'],
                summary: 'Retrieve songs by id or link',
            },
        },
        async (req) => {
            const { id, link } = req.query;
            if (link) {
                return songService.getByLink(link);
            } else {
                return songService.getById(id!);
            }
        }
    );

    api.get(
        '/songs/:id',
        {
            schema: {
                params: songIdParamSchema,
                tags: ['songs'],
                summary: 'Retrieve song by id',
            },
        },
        async (req) => {
            const { id } = req.params;
            return songService.getById(id);
        }
    );

    api.get(
        '/songs/:id/suggestions',
        {
            schema: {
                params: songIdParamSchema,
                querystring: songSuggestionsQuerySchema,
                tags: ['songs'],
                summary: 'Get song suggestions',
            },
        },
        async (req) => {
            const { id } = req.params;
            const { limit } = req.query;
            return songService.getSuggestions(id, limit);
        }
    );
};

export default songsRoutes;
