import albumsRoutes from './albums.ts';
import artistsRoutes from './artists.ts';
import searchRoutes from './search.ts';
import songsRoutes from './songs.ts';
import type { FastifyPluginAsync } from 'fastify';

const apiRoutes: FastifyPluginAsync = async (app) => {
    app.get('/', async () => ({ message: 'Welcome to sargam!' }));
    await app.register(searchRoutes);
    await app.register(songsRoutes);
    await app.register(albumsRoutes);
    await app.register(artistsRoutes);
};

export default apiRoutes;
