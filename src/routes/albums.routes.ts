import { getAlbumById, getAlbumByLink } from '../services/album.service';
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
    id: z.string().min(1, 'Album ID required'),
});

const providerQuerySchema = z.object({
    provider: z.enum(['saavn', 'gaana']).default('saavn'),
});

const albumsRoutes: FastifyPluginAsync = async (app) => {
    const api = app.withTypeProvider<ZodTypeProvider>();

    api.get(
        '/albums/by',
        {
            schema: {
                querystring: byQuerySchema.safeExtend(providerQuerySchema.shape),
                tags: ['albums'],
                summary: 'Retrieve album by id or link',
            },
        },
        async (req) => {
            const { id, link, provider } = req.query;
            return link ? getAlbumByLink(link, { provider }) : getAlbumById(id!, { provider });
        }
    );

    api.get(
        '/albums/:id',
        {
            schema: {
                params: idParamSchema,
                querystring: providerQuerySchema,
                tags: ['albums'],
                summary: 'Retrieve album by id',
            },
        },
        async (req) => getAlbumById(req.params.id, { provider: req.query.provider })
    );
};

export default albumsRoutes;
