import type { FastifyPluginAsync } from 'fastify';

const rootRoutes: FastifyPluginAsync = async (app) => {
    app.get('/', async () => ({ message: 'Welcome to sargam!' }));
};

export default rootRoutes;
