import envPlugin from '@fastify/env';
import type { FastifyPluginAsync } from 'fastify';

const envSchema = {
    type: 'object',
    required: ['JWT_SECRET', 'CLIENT_URLS'],
    properties: {
        JWT_SECRET: { type: 'string' },
        CLIENT_URLS: { type: 'string' },
    },
};

const env: FastifyPluginAsync = async (app) => {
    await app.register(envPlugin, {
        schema: envSchema,
        dotenv: true,
    });
};

export default env;
