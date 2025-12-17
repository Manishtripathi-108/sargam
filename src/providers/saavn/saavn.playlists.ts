import type { PlaylistSummary } from '../../types/music.types';
import { SaavnClient } from './saavn.client';
import { mapPlaylistSummary } from './saavn.mapper';

export class SaavnPlaylistsApi {
    constructor(private readonly client: SaavnClient) {}

    async search(params: { q: string; limit: number; offset: number }): Promise<PlaylistSummary[]> {
        const data = await this.client.searchPlaylists(params);
        const arr = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        return arr.map(mapPlaylistSummary);
    }
}
