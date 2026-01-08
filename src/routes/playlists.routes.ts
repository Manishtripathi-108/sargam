import { getPlaylistById, getPlaylistByLink } from '../services/playlist.service';
import { idOrLinkWithProvider, idParam, providerQuery } from '../validators/common.validators';
import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

const playlistsRoutes: FastifyPluginAsync = async (app) => {
    const api = app.withTypeProvider<ZodTypeProvider>();

    api.get(
        '/playlists',
        {
            schema: {
                querystring: idOrLinkWithProvider,
                tags: ['playlists'],
                summary: 'Retrieve playlist by id or link',
            },
        },
        async (req) => {
            const { id, link, provider } = req.query;
            return link ? getPlaylistByLink(link, { provider }) : getPlaylistById(id!, { provider });
        }
    );

    api.get(
        '/playlists/:id',
        {
            schema: {
                params: idParam,
                querystring: providerQuery,
                tags: ['playlists'],
                summary: 'Retrieve playlist by id',
            },
        },
        async (req) => getPlaylistById(req.params.id, { provider: req.query.provider })
    );
};

export default playlistsRoutes;
