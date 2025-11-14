import corsPlugin from './plugins/cors.ts';
import envPlugin from './plugins/env.ts';
import jwtPlugin from './plugins/jwt.ts';
import rootRoutes from './routes/root.ts';
import { formatAndSortZodIssues } from './utils/helper.utils.ts';
import dotenv from 'dotenv';
import fastify from 'fastify';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { hasZodFastifySchemaValidationErrors, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

// Load environment variables early so plugins can read them
dotenv.config();

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const isProd = NODE_ENV === 'production';

const app = fastify({
    logger: {
        level: process.env.LOG_LEVEL ?? (isProd ? 'info' : 'debug'),
    },
}).withTypeProvider<ZodTypeProvider>();

// Register plugins
app.register(envPlugin);
app.register(corsPlugin);
app.register(jwtPlugin);

// serializer & validator compilers (zod)
app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

// Register API routes
app.register(rootRoutes, { prefix: '/api' });

// Global error handler
app.setErrorHandler(async (err: unknown, req: FastifyRequest, reply: FastifyReply) => {
    // Detect zod-fastify validation errors
    try {
        if (hasZodFastifySchemaValidationErrors(err)) {
            const rawIssues = err.validation;
            const issues = formatAndSortZodIssues(rawIssues);

            req.log.info({ url: req.url, method: req.method, issues }, 'validation_error');

            return reply.status(400).send({
                statusCode: 400,
                error: 'Bad Request',
                message: 'Request validation failed',
                issues,
            });
        }
    } catch (zErr) {
        // If our validation error handling throws, log it and continue to generic handler
        req.log.error({ err: zErr, origErr: err }, 'error_formatting_zod_issues');
    }
});

export default app;
