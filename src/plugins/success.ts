import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

const successPlugin: FastifyPluginAsync = async (fastify) => {
    // declare reply property shape at runtime
    fastify.decorateReply('success', true);

    // set default for each incoming request
    fastify.addHook('onRequest', (req, reply, done) => {
        reply.success = true;
        done();
    });

    // wrap payload just before sending
    fastify.addHook('preSerialization', (req, reply, payload, done) => {
        const wrapped = {
            success: reply.success,
            data: payload,
        };
        done(null, wrapped);
    });
};

export default fp(successPlugin);
