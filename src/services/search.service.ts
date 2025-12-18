import { SaavnProvider } from '../providers/saavn/saavn.provider';
import type {
    GlobalSearchResult,
    SearchAlbum,
    SearchArtist,
    SearchPlaylist,
    SearchSong,
} from '../types/core/search.model';
import { AppError } from '../utils/error.utils';

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

    async globalSearch(
        query: string,
        type: 'song' | 'album' | 'artist' | 'playlist' | 'all',
        limit: number,
        offset: number,
        opts?: ServiceOptions
    ): Promise<GlobalSearchResult | SearchSong | SearchAlbum | SearchArtist | SearchPlaylist> {
        if (!query) {
            throw new AppError('Query is required', 400);
        }

        const provider = this.getProvider(opts);
        const page = Math.floor(offset / limit) + 1;

        try {
            switch (type) {
                case 'song':
                    return provider.search.songs({ query, page, limit });

                case 'album':
                    return provider.search.albums({ query, page, limit });

                case 'artist':
                    return provider.search.artists({ query, page, limit });

                case 'playlist':
                    return provider.search.playlists({ query, page, limit });

                case 'all':
                default:
                    return provider.search.all(query);
            }
        } catch (err: any) {
            if (err instanceof AppError) throw err;
            throw new AppError(`Search failed: ${err?.message}`, 500);
        }
    }

    async searchSongs(query: string, limit: number, offset: number, opts?: ServiceOptions): Promise<SearchSong> {
        const provider = this.getProvider(opts);
        const page = Math.floor(offset / limit) + 1;

        try {
            return await provider.search.songs({ query, page, limit });
        } catch (err: any) {
            if (err instanceof AppError) throw err;
            throw new AppError(`Song search failed: ${err?.message}`, 500);
        }
    }

    async searchAlbums(query: string, limit: number, offset: number, opts?: ServiceOptions): Promise<SearchAlbum> {
        const provider = this.getProvider(opts);
        const page = Math.floor(offset / limit) + 1;

        try {
            return await provider.search.albums({ query, page, limit });
        } catch (err: any) {
            if (err instanceof AppError) throw err;
            throw new AppError(`Album search failed: ${err?.message}`, 500);
        }
    }

    async searchArtists(query: string, limit: number, offset: number, opts?: ServiceOptions): Promise<SearchArtist> {
        const provider = this.getProvider(opts);
        const page = Math.floor(offset / limit) + 1;

        try {
            return await provider.search.artists({ query, page, limit });
        } catch (err: any) {
            if (err instanceof AppError) throw err;
            throw new AppError(`Artist search failed: ${err?.message}`, 500);
        }
    }

    async searchPlaylists(
        query: string,
        limit: number,
        offset: number,
        opts?: ServiceOptions
    ): Promise<SearchPlaylist> {
        const provider = this.getProvider(opts);
        const page = Math.floor(offset / limit) + 1;

        try {
            return await provider.search.playlists({ query, page, limit });
        } catch (err: any) {
            if (err instanceof AppError) throw err;
            throw new AppError(`Playlist search failed: ${err?.message}`, 500);
        }
    }
}
