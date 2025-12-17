import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const albumParamsSchema = z.object({ id: z.string().min(1) });

const albumTrackSchema = z.object({
    id: z.string(),
    title: z.string(),
    artists: z.array(z.string()),
    album: z.string(),
    duration: z.number(),
});

const albumSchema = z.object({
    id: z.string(),
    title: z.string(),
    artists: z.array(z.string()),
    tracks: z.array(albumTrackSchema),
});

const albumsRoutes: FastifyPluginAsync = async (app) => {
    const api = app.withTypeProvider<ZodTypeProvider>();

    api.get(
        '/albums/{id}',
        {
            schema: {
                summary: 'Retrieve album by id',
                tags: ['albums'],
                params: albumParamsSchema,
                response: { 200: albumSchema },
            },
        },
        async (req) => {
            return app.services.albumService.getAlbumById(req.params.id);
        }
    );
};

export default albumsRoutes;
