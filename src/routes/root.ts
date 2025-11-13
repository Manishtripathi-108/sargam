import type { FastifyPluginAsync } from 'fastify';

const rootRoutes: FastifyPluginAsync = async (app) => {
    app.get('/', async () => ({
        ok: true,
        name: 'sargam',
    }));
};

export default rootRoutes;
