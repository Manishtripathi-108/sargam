import { isDev } from '../utils/main.utils.ts';
import fastifyCors from '@fastify/cors';
import type { FastifyPluginAsync } from 'fastify';

const cors: FastifyPluginAsync = async (app) => {
    const corsOptions = {
        origin: isDev
            ? '*'
            : // In production, restrict origins to those specified in CLIENT_URLS env variable
              (process.env.CLIENT_URLS?.split(',').map((u) => u.trim()) ?? []),
        credentials: true,
    };

    await app.register(fastifyCors, corsOptions);
};

export default cors;
