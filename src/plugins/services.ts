import { DefaultAlbumService } from '../services/album.service';
import { DefaultArtistService } from '../services/artist.service';
import { InMemoryMusicRepository } from '../services/repositories/inMemoryMusicRepository';
import type { MusicRepository } from '../services/repositories/types';
import { DefaultSearchService } from '../services/search.service';
import { DefaultSongService } from '../services/song.service';
import type { Services } from '../services/types';
import type { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';

export type ServicesPluginOptions = Partial<Services> & { repository?: MusicRepository };

const servicesPlugin: FastifyPluginAsync<ServicesPluginOptions> = async (app, opts) => {
    const repo = opts.repository ?? new InMemoryMusicRepository();

    // Replace in-memory repository with real data source here when wiring DB or APIs.
    const services: Services = {
        searchService: opts.searchService ?? new DefaultSearchService(repo),
        songService: opts.songService ?? new DefaultSongService(repo),
        albumService: opts.albumService ?? new DefaultAlbumService(repo),
        artistService: opts.artistService ?? new DefaultArtistService(repo),
    };

    app.decorate('services', services);
};

export default fp(servicesPlugin, { name: 'services-plugin' });
