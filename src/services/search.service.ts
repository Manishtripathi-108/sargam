import { SaavnProvider } from '../providers/saavn/saavn.provider';
import type {
    GlobalSearchResult,
    SearchAlbum,
    SearchArtist,
    SearchPlaylist,
    SearchSong,
} from '../types/core/search.model';
import { AppError, wrapError } from '../utils/error.utils';
import { normalizePagination } from '../utils/main.utils';

type Provider = 'saavn';

interface ServiceOptions {
    provider?: Provider;
}

const providers = {
    saavn: SaavnProvider,
};

export class DefaultSearchService {
    private getProvider(opts?: ServiceOptions) {
        const provider = providers[opts?.provider ?? 'saavn'];
        if (!provider) {
            throw new AppError('Provider not found', 500);
        }
        return provider;
    }

    async globalSearch({
        query,
        type,
        limit,
        offset,
        opts,
    }: {
        query: string;
        type: 'song' | 'album' | 'artist' | 'playlist' | 'all';
        limit: number;
        offset: number;
        opts?: ServiceOptions;
    }): Promise<GlobalSearchResult | SearchSong | SearchAlbum | SearchArtist | SearchPlaylist> {
        if (!query) {
            throw new AppError('Query is required', 400);
        }

        const provider = this.getProvider(opts);
        const { page, limit: safeLimit } = normalizePagination(limit, offset);

        try {
            switch (type) {
                case 'song':
                    return provider.search.songs({ query, page, limit: safeLimit });

                case 'album':
                    return provider.search.albums({ query, page, limit: safeLimit });

                case 'artist':
                    return provider.search.artists({ query, page, limit: safeLimit });

                case 'playlist':
                    return provider.search.playlists({ query, page, limit: safeLimit });

                case 'all':
                default:
                    return provider.search.all(query);
            }
        } catch (err: unknown) {
            return wrapError(err, 'Search failed', 500);
        }
    }

    async searchSongs({
        query,
        limit,
        offset,
        opts,
    }: {
        query: string;
        limit: number;
        offset: number;
        opts?: ServiceOptions;
    }): Promise<SearchSong> {
        const provider = this.getProvider(opts);
        const { page, limit: safeLimit } = normalizePagination(limit, offset);

        try {
            return await provider.search.songs({ query, page, limit: safeLimit });
        } catch (err: unknown) {
            return wrapError(err, 'Song search failed', 500);
        }
    }

    async searchAlbums({
        query,
        limit,
        offset,
        opts,
    }: {
        query: string;
        limit: number;
        offset: number;
        opts?: ServiceOptions;
    }): Promise<SearchAlbum> {
        const provider = this.getProvider(opts);
        const { page, limit: safeLimit } = normalizePagination(limit, offset);

        try {
            return await provider.search.albums({ query, page, limit: safeLimit });
        } catch (err: unknown) {
            return wrapError(err, 'Album search failed', 500);
        }
    }

    async searchArtists({
        query,
        limit,
        offset,
        opts,
    }: {
        query: string;
        limit: number;
        offset: number;
        opts?: ServiceOptions;
    }): Promise<SearchArtist> {
        const provider = this.getProvider(opts);
        const { page, limit: safeLimit } = normalizePagination(limit, offset);

        try {
            return await provider.search.artists({ query, page, limit: safeLimit });
        } catch (err: unknown) {
            return wrapError(err, 'Artist search failed', 500);
        }
    }

    async searchPlaylists({
        query,
        limit,
        offset,
        opts,
    }: {
        query: string;
        limit: number;
        offset: number;
        opts?: ServiceOptions;
    }): Promise<SearchPlaylist> {
        const provider = this.getProvider(opts);
        const { page, limit: safeLimit } = normalizePagination(limit, offset);

        try {
            return await provider.search.playlists({ query, page, limit: safeLimit });
        } catch (err: unknown) {
            return wrapError(err, 'Playlist search failed', 500);
        }
    }
}
