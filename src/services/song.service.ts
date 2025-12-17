import { notFound } from '../utils/error.utils.ts';
import type { MusicRepository } from './repositories/types.ts';
import type { SongService } from './types.ts';

export class DefaultSongService implements SongService {
    constructor(private readonly repo: MusicRepository) {}

    async getSongsByIdOrLink(params: { id?: string; link?: string }) {
        // Replace with DB or external provider lookup.
        return this.repo.findSongsByIdOrLink(params);
    }

    async getSongById(id: string) {
        const song = await this.repo.findSongById(id);
        if (!song) {
            throw notFound('Song not found');
        }
        return song;
    }

    async getSongSuggestions(params: { id: string; limit: number }) {
        const base = await this.repo.findSongById(params.id);
        if (!base) {
            throw notFound('Song not found');
        }
        return this.repo.findSongSuggestions(params.id, params.limit);
    }
}
