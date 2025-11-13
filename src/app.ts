import corsPlugin from './plugins/cors.ts';
import envPlugin from './plugins/env.ts';
import jwtPlugin from './plugins/jwt.ts';
import rootRoutes from './routes/root.ts';
import dotenv from 'dotenv';
import fastify from 'fastify';

// Load environment variables early so plugins can read them
dotenv.config();

const app = fastify({ logger: true });

await app.register(envPlugin);
await app.register(corsPlugin);
await app.register(jwtPlugin);

await app.register(rootRoutes);

export default app;
