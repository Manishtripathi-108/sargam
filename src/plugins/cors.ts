import fastifyCors from '@fastify/cors';
import type { FastifyPluginAsync } from 'fastify';

const cors: FastifyPluginAsync = async (app) => {
    const corsOptions = {
        origin:
            process.env.NODE_ENV === 'production'
                ? (process.env.CLIENT_URLS?.split(',').map((u) => u.trim()) ?? [])
                : '*',
        credentials: true,
    };

    await app.register(fastifyCors, corsOptions);
};

export default cors;
