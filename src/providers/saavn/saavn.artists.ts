import type { AlbumSummary, Artist, SongSummary } from '../../types/music.types';
import { SaavnClient } from './saavn.client';
import { mapAlbumSummary, mapArtist, mapSongSummary } from './saavn.mapper';

export class SaavnArtistsApi {
    constructor(private readonly client: SaavnClient) {}

    async getById(id: string): Promise<Artist> {
        const data = await this.client.getArtistById(id);
        const raw = data?.data ?? data;
        return mapArtist(raw);
    }

    async getByIdOrLink(params: { id?: string; link?: string }): Promise<Artist[]> {
        const data = await this.client.getArtistsByIdOrLink(params);
        const arr = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        return arr.map((raw) => mapArtist(raw));
    }

    async songs(params: { id: string; limit: number; offset: number }): Promise<SongSummary[]> {
        const data = await this.client.getArtistSongs(params.id, params.limit, params.offset);
        const arr = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        return arr.map(mapSongSummary);
    }

    async albums(params: { id: string; limit: number; offset: number }): Promise<AlbumSummary[]> {
        const data = await this.client.getArtistAlbums(params.id, params.limit, params.offset);
        const arr = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        return arr.map(mapAlbumSummary);
    }
}
