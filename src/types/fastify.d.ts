import type { Services } from '../services/types';
import type { PrismaClient } from '@prisma/client';
import 'fastify';

declare module 'fastify' {
    interface FastifyInstance {
        db: PrismaClient;
        services: Services;
    }
    interface FastifyReply {
        success: boolean;
    }
}
