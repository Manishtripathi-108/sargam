import corsPlugin from './plugins/cors';
import dbPlugin from './plugins/db';
import envPlugin from './plugins/env';
import registerErrorHandler from './plugins/error-handler';
import jwtPlugin from './plugins/jwt';
import successPlugin from './plugins/success';
import apiRoutes from './routes/index';
import { isDev } from './utils/environment.utils';
import dotenv from 'dotenv';
import fastify from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

// Load environment variables early so plugins can read them
dotenv.config();

const app = fastify({
    logger: isDev
        ? {
              level: process.env.LOG_LEVEL ?? 'debug',
              transport: {
                  target: 'pino-pretty',
                  options: {
                      colorize: true,
                      translateTime: 'HH:MM:ss',
                      ignore: 'pid,hostname',
                  },
              },
          }
        : {
              level: process.env.LOG_LEVEL ?? 'info',
          },
}).withTypeProvider<ZodTypeProvider>();

// Register plugins
app.register(envPlugin);
app.register(corsPlugin);
app.register(jwtPlugin);
app.register(successPlugin);
app.register(dbPlugin);

// serializer & validator compilers (zod)
app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

// Register API routes
app.register(apiRoutes, { prefix: '/api' });

registerErrorHandler(app);

export default app;
