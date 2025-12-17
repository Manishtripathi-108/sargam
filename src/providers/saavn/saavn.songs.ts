import type { Song, SongSummary } from '../../types/music.types';
import { SaavnClient } from './saavn.client';
import { mapSong, mapSongSummary } from './saavn.mapper';

export class SaavnSongsApi {
    constructor(private readonly client: SaavnClient) {}

    async getById(id: string): Promise<Song> {
        const data = await this.client.getSongById(id);
        // Some APIs return wrapped payloads; unwrap common shapes.
        const raw = data?.data ?? data;
        return mapSong(raw);
    }

    async getByIdOrLink(params: { id?: string; link?: string }): Promise<Song[]> {
        const data = await this.client.getSongsByIdOrLink(params);
        const arr = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        return arr.map(mapSong);
    }

    async suggestions(id: string, limit: number): Promise<SongSummary[]> {
        const data = await this.client.getSongSuggestions(id, limit);
        const arr = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        return arr.map(mapSongSummary);
    }
}
