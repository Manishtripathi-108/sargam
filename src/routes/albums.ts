import { DefaultAlbumService } from '../services/album.service';
import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const albumByQuerySchema = z
    .object({
        id: z.string().optional(),
        link: z.string().optional(),
    })
    .refine((data) => data.id || data.link, {
        message: 'Either id or link is required',
        path: ['id'],
    });

const albumIdParamSchema = z.object({
    id: z.string().min(1, 'Album ID required'),
});

const albumsRoutes: FastifyPluginAsync = async (app) => {
    const api = app.withTypeProvider<ZodTypeProvider>();
    const albumService = new DefaultAlbumService();

    api.get(
        '/albums/by',
        {
            schema: {
                querystring: albumByQuerySchema,
                tags: ['albums'],
                summary: 'Retrieve album by id or link',
            },
        },
        async (req) => {
            const { id, link } = req.query;
            return albumService.getAlbumByIdOrLink({ id, link });
        }
    );

    api.get(
        '/albums/:id',
        {
            schema: {
                params: albumIdParamSchema,
                tags: ['albums'],
                summary: 'Retrieve album by id',
            },
        },
        async (req) => {
            const { id } = req.params;
            return albumService.getAlbumById(id);
        }
    );
};

export default albumsRoutes;
