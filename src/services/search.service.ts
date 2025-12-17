import type { SearchEntityType } from '../types/music.types';
import type { MusicRepository } from './repositories/types';
import type { SearchService } from './types';

export class DefaultSearchService implements SearchService {
    constructor(private readonly repo: MusicRepository) {}

    async globalSearch(params: { q: string; type?: SearchEntityType; limit: number; offset: number }) {
        // Swap repository with real search provider (e.g., Elastic) when available.
        const { total, results } = await this.repo.search(params);
        return {
            meta: { total, limit: params.limit, offset: params.offset },
            results,
        };
    }

    async searchSongs(params: { q: string; limit: number; offset: number }) {
        return this.repo.searchSongs(params);
    }

    async searchAlbums(params: { q: string; limit: number; offset: number }) {
        return this.repo.searchAlbums(params);
    }

    async searchArtists(params: { q: string; limit: number; offset: number }) {
        return this.repo.searchArtists(params);
    }

    async searchPlaylists(params: { q: string; limit: number; offset: number }) {
        return this.repo.searchPlaylists(params);
    }
}
