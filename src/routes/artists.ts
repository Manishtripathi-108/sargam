import { DefaultArtistService } from '../services/artist.service';
import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const artistByQuerySchema = z
    .object({
        id: z.string().optional(),
        link: z.string().optional(),
    })
    .refine((data) => data.id || data.link, {
        message: 'Either id or link is required',
        path: ['id'],
    });

const artistIdParamSchema = z.object({
    id: z.string().min(1, 'Artist ID required'),
});

const artistSongsQuerySchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(50),
    offset: z.coerce.number().int().min(0).default(0),
});

const artistAlbumsQuerySchema = z.object({
    limit: z.coerce.number().int().min(1).max(100).default(50),
    offset: z.coerce.number().int().min(0).default(0),
});

const artistsRoutes: FastifyPluginAsync = async (app) => {
    const api = app.withTypeProvider<ZodTypeProvider>();
    const artistService = new DefaultArtistService();

    api.get(
        '/artists/by',
        {
            schema: {
                querystring: artistByQuerySchema,
                tags: ['artists'],
                summary: 'Retrieve artists by id or link',
            },
        },
        async (req) => {
            const { id, link } = req.query;
            return artistService.getArtistByIdOrLink({ id, link });
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
            return artistService.getArtistById(id);
        }
    );

    api.get(
        '/artists/:id/songs',
        {
            schema: {
                params: artistIdParamSchema,
                querystring: artistSongsQuerySchema,
                tags: ['artists'],
                summary: 'Get artist songs',
            },
        },
        async (req) => {
            const { id } = req.params;
            const { limit, offset } = req.query;
            return artistService.getArtistSongs(id, limit, offset);
        }
    );

    api.get(
        '/artists/:id/albums',
        {
            schema: {
                params: artistIdParamSchema,
                querystring: artistAlbumsQuerySchema,
                tags: ['artists'],
                summary: 'Get artist albums',
            },
        },
        async (req) => {
            const { id } = req.params;
            const { limit, offset } = req.query;
            return artistService.getArtistAlbums(id, limit, offset);
        }
    );
};

export default artistsRoutes;
