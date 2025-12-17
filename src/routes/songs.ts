import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const toFastifyPath = (path: string) => path.replace(/\{(\w+)\}/g, ':$1');

const songsByQuerySchema = z
    .object({
        id: z.string().min(1).optional(),
        link: z.string().min(1).optional(),
    })
    .refine((v) => v.id || v.link, { message: 'Either id or link is required', path: ['id'] });

const songIdParamSchema = z.object({ id: z.string().min(1) });

const suggestionsQuerySchema = z.object({ limit: z.coerce.number().int().positive().max(50).default(10) });

const songSchema = z.object({
    id: z.string(),
    title: z.string(),
    artists: z.array(z.string()),
    album: z.object({ id: z.string(), title: z.string() }),
    duration: z.number(),
    streamingUrl: z.string().url().optional(),
});

const songSummarySchema = z.object({
    id: z.string(),
    title: z.string(),
    artists: z.array(z.string()),
    album: z.string(),
    duration: z.number(),
});

const songsRoutes: FastifyPluginAsync = async (app) => {
    const api = app.withTypeProvider<ZodTypeProvider>();
    // Public song retrieval endpoints; add auth guards here when needed.

    api.get(
        '/songs/by',
        {
            schema: {
                summary: 'Retrieve songs by id or link',
                tags: ['songs'],
                querystring: songsByQuerySchema,
                response: { 200: z.object({ success: z.boolean(), data: z.array(songSchema) }) },
            },
        },
        async (req) => {
            const songs = await app.services.songService.getSongsByIdOrLink(req.query);
            return songs;
        }
    );

    const songByIdPath = '/songs/{id}';
    api.get(
        toFastifyPath(songByIdPath),
        {
            schema: {
                summary: 'Retrieve song by id',
                tags: ['songs'],
                params: songIdParamSchema,
                response: { 200: songSchema.extend({ success: z.boolean() }) },
            },
        },
        async (req) => {
            return app.services.songService.getSongById(req.params.id);
        }
    );

    const songSuggestionsPath = '/songs/{id}/suggestions';
    api.get(
        toFastifyPath(songSuggestionsPath),
        {
            schema: {
                summary: 'Retrieve song suggestions',
                tags: ['songs'],
                params: songIdParamSchema,
                querystring: suggestionsQuerySchema,
                response: { 200: z.object({ success: z.boolean(), data: z.array(songSummarySchema) }) },
            },
        },
        async (req) => {
            const { id } = req.params;
            const { limit } = req.query;
            return app.services.songService.getSongSuggestions({ id, limit });
        }
    );
};

export default songsRoutes;
