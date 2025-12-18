import { DefaultAlbumService } from '../services/album.service';
import { DefaultArtistService } from '../services/artist.service';
import { DefaultSearchService } from '../services/search.service';
import { DefaultSongService } from '../services/song.service';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

export interface Services {
    searchService: DefaultSearchService;
    songService: DefaultSongService;
    albumService: DefaultAlbumService;
    artistService: DefaultArtistService;
}

export type ServicesPluginOptions = Partial<Services>;

const servicesPlugin: FastifyPluginAsync<ServicesPluginOptions> = async (app, opts) => {
    const services: Services = {
        searchService: opts.searchService ?? new DefaultSearchService(),
        songService: opts.songService ?? new DefaultSongService(),
        albumService: opts.albumService ?? new DefaultAlbumService(),
        artistService: opts.artistService ?? new DefaultArtistService(),
    };

    app.decorate('services', services);
};

export default fp(servicesPlugin, { name: 'services-plugin' });
