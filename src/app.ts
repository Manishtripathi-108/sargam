import fastifyCors from '@fastify/cors';
import envPlugin from '@fastify/env';
import jwt from '@fastify/jwt';
import dotenv from 'dotenv';
import fastify from 'fastify';

// Load environment variables early
dotenv.config();

// Environment Schema
const envSchema = {
    type: 'object',
    required: ['JWT_SECRET', 'CLIENT_URLS'],
    properties: {
        JWT_SECRET: { type: 'string' },
        CLIENT_URLS: { type: 'string' },
    },
};

// CORS Options
const corsOptions = {
    origin:
        process.env.NODE_ENV === 'production' ? (process.env.CLIENT_URLS?.split(',').map((u) => u.trim()) ?? []) : '*',

    credentials: true,
    exposedHeaders: ['Content-Disposition'],
};

const app = fastify({
    logger: true,
});

/* ---------------------------- Register plugins ---------------------------- */
app.register(envPlugin, {
    schema: envSchema,
    dotenv: true,
});

app.register(fastifyCors, corsOptions);

app.register(jwt, {
    secret: process.env.JWT_SECRET || 'dev-secret',
    sign: { expiresIn: '15m' },
});

/* --------------------------------- Routes --------------------------------- */
app.get('/', async () => ({
    ok: true,
    name: 'sargam',
}));

export default app;
