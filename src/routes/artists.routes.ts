import { getArtistAlbums, getArtistById, getArtistByLink, getArtistSongs } from '../services/artist.service';
import { idOrLinkWithProvider, idParam, listQuery, providerQuery } from '../validators/common.validators';
import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

const artistRoutes: FastifyPluginAsync = async (app) => {
    const api = app.withTypeProvider<ZodTypeProvider>();

    api.get(
        '/artists',
        {
            schema: {
                querystring: idOrLinkWithProvider,
                tags: ['artists'],
                summary: 'Retrieve artist by id or link',
            },
        },
        async (req) => {
            const { id, link, provider } = req.query;
            return link ? getArtistByLink(link, { provider }) : getArtistById(id!, { provider });
        }
    );

    api.get(
        '/artists/:id',
        {
            schema: {
                params: idParam,
                querystring: providerQuery,
                tags: ['artists'],
                summary: 'Retrieve artist by id',
            },
        },
        async (req) => getArtistById(req.params.id, { provider: req.query.provider })
    );

    api.get(
        '/artists/:id/songs',
        {
            schema: {
                params: idParam,
                querystring: listQuery,
                tags: ['artists'],
                summary: 'Retrieve artist songs',
            },
        },
        async (req) =>
            getArtistSongs({
                id: req.params.id,
                ...req.query,
                opts: { provider: req.query.provider },
            })
    );

    api.get(
        '/artists/:id/albums',
        {
            schema: {
                params: idParam,
                querystring: listQuery,
                tags: ['artists'],
                summary: 'Retrieve artist albums',
            },
        },
        async (req) =>
            getArtistAlbums({
                id: req.params.id,
                ...req.query,
                opts: { provider: req.query.provider },
            })
    );
};

export default artistRoutes;
