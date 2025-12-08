import 'fastify';

declare module 'fastify' {
    interface FastifyReply {
        success: boolean;
    }
}
