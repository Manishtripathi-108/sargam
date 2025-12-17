import albumsRoutes from './albums';
import artistsRoutes from './artists';
import searchRoutes from './search';
import songsRoutes from './songs';
import type { FastifyPluginAsync } from 'fastify';

const apiRoutes: FastifyPluginAsync = async (app) => {
    app.get('/', async () => ({ message: 'Welcome to sargam!' }));
    await app.register(searchRoutes);
    await app.register(songsRoutes);
    await app.register(albumsRoutes);
    await app.register(artistsRoutes);
};

export default apiRoutes;
