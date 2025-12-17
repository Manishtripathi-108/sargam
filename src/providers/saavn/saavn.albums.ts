import type { Album } from '../../types/music.types';
import { SaavnClient } from './saavn.client';
import { mapAlbum } from './saavn.mapper';

export class SaavnAlbumsApi {
    constructor(private readonly client: SaavnClient) {}

    async getById(id: string): Promise<Album> {
        const data = await this.client.getAlbumById(id);
        const raw = data?.data ?? data;
        return mapAlbum(raw);
    }

    async getByIdOrLink(params: { id?: string; link?: string }): Promise<Album> {
        const data = await this.client.getAlbumByIdOrLink(params);
        const raw = data?.data ?? data;
        return mapAlbum(raw);
    }
}
