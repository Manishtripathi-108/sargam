import globalErrorPlugin from '../../src/plugins/error-handler.ts';
import servicesPlugin from '../../src/plugins/services.ts';
import successPlugin from '../../src/plugins/success.ts';
import apiRoutes from '../../src/routes/index.ts';
import fastify from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';

export const buildTestApp = async () => {
    const app = fastify({ logger: false }).withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    app.register(globalErrorPlugin);

    await app.register(successPlugin);
    await app.register(servicesPlugin);
    await app.register(apiRoutes, { prefix: '/api' });
    await app.ready();
    return app;
};
