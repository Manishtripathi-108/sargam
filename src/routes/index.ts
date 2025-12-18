import albumsRoutes from './albums.routes';
import artistsRoutes from './artists.routes';
import searchRoutes from './search.routes';
import songsRoutes from './songs.routes';
import type { FastifyPluginAsync } from 'fastify';

const apiRoutes: FastifyPluginAsync = async (app) => {
    app.get('/', async () => ({ message: 'Welcome to sargam!' }));
    await app.register(searchRoutes);
    await app.register(songsRoutes);
    await app.register(albumsRoutes);
    await app.register(artistsRoutes);
};

export default apiRoutes;
