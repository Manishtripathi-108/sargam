import type { PrismaClient } from '@prisma/client';
import 'fastify';

declare module 'fastify' {
    interface FastifyInstance {
        db: PrismaClient;
    }
    interface FastifyReply {
        success: boolean;
    }
}
