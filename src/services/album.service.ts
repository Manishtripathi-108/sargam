import { notFound } from '../utils/error.utils';
import type { MusicRepository } from './repositories/types';
import type { AlbumService } from './types';

export class DefaultAlbumService implements AlbumService {
    constructor(private readonly repo: MusicRepository) {}

    async getAlbumByIdOrLink(params: { id?: string; link?: string }) {
        // Replace with DB lookups when available.
        const album = await this.repo.findAlbumByIdOrLink(params);
        if (!album) {
            throw notFound('Album not found');
        }
        return album;
    }

    async getAlbumById(id: string) {
        const album = await this.repo.findAlbumByIdOrLink({ id });
        if (!album) {
            throw notFound('Album not found');
        }
        return album;
    }
}
