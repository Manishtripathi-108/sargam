import type { FastifyPluginAsync } from 'fastify';

const rootRoutes: FastifyPluginAsync = async (app) => {
    app.get('/', async () => ({ message: 'Welcome to sargam!' }));

    app.get('/user', async (request, reply) => {
        const users = await app.db.user.findMany();
        return { users };
    });
};

export default rootRoutes;
