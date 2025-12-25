import { formatZodValidationErrors } from '../utils/validation.utils';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod';
import http from 'http';

type HttpLikeError = {
    statusCode?: number;
    status?: number;
    message?: unknown;
};

const isObject = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const registerErrorHandler = async (app: FastifyInstance) => {
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
                const validation = err.validation;
                const issues = formatZodValidationErrors(validation);

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

        try {
            const httpErr: HttpLikeError | null = isObject(err) ? err : null;

            const statusCode =
                typeof httpErr?.statusCode === 'number'
                    ? httpErr.statusCode
                    : typeof httpErr?.status === 'number'
                      ? httpErr.status
                      : 500;

            const safeStatusCode = statusCode || 500;
            const statusMessage = http.STATUS_CODES[safeStatusCode] ?? 'Internal Server Error';

            const message =
                typeof httpErr?.message === 'string' && httpErr.message.length > 0 ? httpErr.message : statusMessage;

            if (safeStatusCode >= 500) {
                req.log.error({ err, url: req.url, method: req.method }, 'unhandled_error');
            } else {
                req.log.info({ err, url: req.url, method: req.method }, 'http_error');
            }

            return reply.status(safeStatusCode).send({
                statusCode: safeStatusCode,
                error: statusMessage,
                message,
                success: false,
            });
        } catch (finalErr: unknown) {
            req.log.error({ err: finalErr, origErr: err }, 'fatal_error_in_error_handler');

            return reply.status(500).send({
                statusCode: 500,
                error: 'Internal Server Error',
                message: 'An unexpected error occurred',
                success: false,
            });
        }
    });
};

export default registerErrorHandler;
