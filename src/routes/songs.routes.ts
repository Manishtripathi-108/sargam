import { getSongById, getSongByLink, getSongsByIds, getSongSuggestions } from '../services/song.service';
import { idOrLinkWithProvider, idParam, providerQuery, suggestionsQuery } from '../validators/common.validators';
import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';

const songsRoutes: FastifyPluginAsync = async (app) => {
    const api = app.withTypeProvider<ZodTypeProvider>();

    api.get(
        '/songs',
        {
            schema: {
                querystring: idOrLinkWithProvider,
                tags: ['songs'],
            },
        },
        async (req) => {
            const { id, ids, link, provider } = req.query;
            if (ids) {
                return getSongsByIds(ids, { provider });
            } else if (link) {
                return getSongByLink(link, { provider });
            } else {
                return getSongById(id!, { provider });
            }
        }
    );

    api.get(
        '/songs/:id',
        {
            schema: {
                params: idParam,
                querystring: providerQuery,
                tags: ['songs'],
            },
        },
        async (req) => getSongById(req.params.id, { provider: req.query.provider })
    );

    api.get(
        '/songs/:id/suggestions',
        {
            schema: {
                params: idParam,
                querystring: suggestionsQuery.extend(providerQuery.shape),
                tags: ['songs'],
            },
        },
        async (req) => getSongSuggestions(req.params.id, req.query.limit, { provider: req.query.provider })
    );
};

export default songsRoutes;
