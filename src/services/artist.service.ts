import { notFound } from '../utils/error.utils';
import type { MusicRepository } from './repositories/types';
import type { ArtistService } from './types';

export class DefaultArtistService implements ArtistService {
    constructor(private readonly repo: MusicRepository) {}

    async getArtistsByIdOrLink(params: { id?: string; link?: string }) {
        // Swap with DB or external artist provider.
        const artists = await this.repo.findArtistsByIdOrLink(params);
        if (artists.length === 0) {
            throw notFound('Artist not found');
        }
        return artists;
    }

    async getArtistById(id: string) {
        const artist = await this.repo.findArtistById(id);
        if (!artist) {
            throw notFound('Artist not found');
        }
        return artist;
    }

    async getArtistSongs(params: { id: string; limit: number; offset: number }) {
        const artist = await this.repo.findArtistById(params.id);
        if (!artist) {
            throw notFound('Artist not found');
        }
        return this.repo.findSongsByArtist(params);
    }

    async getArtistAlbums(params: { id: string; limit: number; offset: number }) {
        const artist = await this.repo.findArtistById(params.id);
        if (!artist) {
            throw notFound('Artist not found');
        }
        return this.repo.findAlbumsByArtist(params);
    }
}
