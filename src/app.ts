import corsPlugin from './plugins/cors.ts';
import envPlugin from './plugins/env.ts';
import jwtPlugin from './plugins/jwt.ts';
import successPlugin from './plugins/success.ts';
import rootRoutes from './routes/root.ts';
import { formatAndSortZodIssues } from './utils/helper.utils.ts';
import dotenv from 'dotenv';
import fastify from 'fastify';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { hasZodFastifySchemaValidationErrors, serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import http from 'http';

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
app.register(successPlugin);

// serializer & validator compilers (zod)
app.setSerializerCompiler(serializerCompiler);
app.setValidatorCompiler(validatorCompiler);

// Register API routes
app.register(rootRoutes, { prefix: '/api' });

// Global error handler
app.setErrorHandler(async (err: unknown, req: FastifyRequest, reply: FastifyReply) => {
    // ensure the success flag is false for any error
    reply.success = false;

    // if headers already sent, do nothing
    if (reply.sent) {
        req.log.warn({ url: req.url, method: req.method }, 'headers already sent in error handler');
        return;
    }

    // handle zod validation errors only
    try {
        if (hasZodFastifySchemaValidationErrors(err)) {
            const rawIssues = (err as any).validation;
            const issues = formatAndSortZodIssues(rawIssues);

            req.log.info({ url: req.url, method: req.method, issues }, 'validation_error');

            return reply.status(400).send({
                statusCode: 400,
                error: 'Bad Request',
                message: 'Request validation failed',
                issues,
                success: false,
            });
        }
    } catch (zErr) {
        req.log.error({ err: zErr, origErr: err }, 'error_formatting_zod_issues');
    }

    // default error handling
    try {
        const maybeErr = err as any;
        const statusCode = Number(maybeErr?.statusCode ?? maybeErr?.status ?? 500) || 500;
        const statusMessage = http.STATUS_CODES[statusCode] ?? 'Internal Server Error';
        const message =
            typeof maybeErr?.message === 'string' && maybeErr?.message.length > 0 ? maybeErr.message : statusMessage;

        // log server errors at error level, client errors at info level
        if (statusCode >= 500) {
            req.log.error({ err, url: req.url, method: req.method }, 'unhandled_error');
        } else {
            req.log.info({ err, url: req.url, method: req.method }, 'http_error');
        }

        return reply.status(statusCode).send({
            statusCode,
            error: statusMessage,
            message,
            success: false,
        });
    } catch (finalErr) {
        // last resort. If our default builder throws, log and send minimal 500
        req.log.error({ err: finalErr, origErr: err }, 'fatal_error_in_error_handler');
        return reply.status(500).send({
            statusCode: 500,
            error: 'Internal Server Error',
            message: 'An unexpected error occurred',
            success: false,
        });
    }
});

export default app;
