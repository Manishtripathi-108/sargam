import envPlugin from '@fastify/env';
import type { FastifyPluginAsync } from 'fastify';

// Define the expected environment variables schema
const envSchema = {
    type: 'object',
    required: ['JWT_SECRET', 'CLIENT_URLS'],
    properties: {
        JWT_SECRET: { type: 'string' },
        CLIENT_URLS: { type: 'string' },
    },
};

// Environment plugin to load and validate environment variables
const env: FastifyPluginAsync = async (app) => {
    await app.register(envPlugin, {
        schema: envSchema,
        dotenv: true,
    });
};

//* Note: What it does is to ensure that the required environment variables are present
//* and conform to the specified schema when the application starts.

export default env;
