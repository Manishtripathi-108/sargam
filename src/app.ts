import corsPlugin from './plugins/cors.ts';
import dbPlugin from './plugins/db.ts';
import envPlugin from './plugins/env.ts';
import globalErrorPlugin from './plugins/error-handler.ts';
import jwtPlugin from './plugins/jwt.ts';
import servicesPlugin from './plugins/services.ts';
import successPlugin from './plugins/success.ts';
import apiRoutes from './routes/index.ts';
import { isDev } from './utils/main.utils.ts';
import dotenv from 'dotenv';
import fastify from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

// Load environment variables early so plugins can read them
dotenv.config();

const app = fastify({
    logger: {
        level: process.env.LOG_LEVEL ?? (isDev ? 'debug' : 'info'),
    },
}).withTypeProvider<ZodTypeProvider>();

// Register plugins
app.register(envPlugin);
app.register(corsPlugin);
app.register(jwtPlugin);
app.register(successPlugin);
app.register(dbPlugin);
app.register(servicesPlugin);
app.register(globalErrorPlugin);

// serializer & validator compilers (zod)
app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

// Register API routes
app.register(apiRoutes, { prefix: '/api' });

export default app;
