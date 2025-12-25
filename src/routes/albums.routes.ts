import { getAlbumById, getAlbumByLink } from '../services/album.service';
import { idOrLinkWithProvider, idParam, providerQuery } from '../validators/common.validators';
import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

const albumsRoutes: FastifyPluginAsync = async (app) => {
    const api = app.withTypeProvider<ZodTypeProvider>();

    api.get(
        '/albums/by',
        {
            schema: {
                querystring: idOrLinkWithProvider,
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
                params: idParam('Album'),
                querystring: providerQuery,
                tags: ['albums'],
                summary: 'Retrieve album by id',
            },
        },
        async (req) => getAlbumById(req.params.id, { provider: req.query.provider })
    );
};

export default albumsRoutes;
