import type {
    GlobalSearchResult,
    SearchAlbum,
    SearchArtist,
    SearchPlaylist,
    SearchSong,
} from '../types/core/search.model';
import type { SearchParams } from '../types/services.types';
import { AppError, wrapError } from '../utils/error.utils';
import { getProvider, type ServiceOptions } from '../utils/provider.util';

type SearchParamsWithOpts = SearchParams & {
    opts?: ServiceOptions;
};

export async function globalSearch(p: {
    query: string;
    type: 'song' | 'album' | 'artist' | 'playlist' | 'all';
    limit: number;
    offset: number;
    opts?: ServiceOptions;
}): Promise<GlobalSearchResult | SearchSong | SearchAlbum | SearchArtist | SearchPlaylist> {
    if (!p.query) {
        throw new AppError('Query is required', 400);
    }

    const search = getProvider(p.opts).search;

    try {
        if (p.type === 'song') return search.songs(p);
        if (p.type === 'album') return search.albums(p);
        if (p.type === 'artist') return search.artists(p);
        if (p.type === 'playlist') return search.playlists(p);
        return search.all(p.query);
    } catch (err) {
        return wrapError(err, 'Search failed', 500);
    }
}

export const searchSongs = (p: SearchParamsWithOpts) =>
    getProvider(p.opts)
        .search.songs(p)
        .catch((e) => wrapError(e, 'Song search failed', 500));

export const searchAlbums = (p: SearchParamsWithOpts) =>
    getProvider(p.opts)
        .search.albums(p)
        .catch((e) => wrapError(e, 'Album search failed', 500));

export const searchArtists = (p: SearchParamsWithOpts) =>
    getProvider(p.opts)
        .search.artists(p)
        .catch((e) => wrapError(e, 'Artist search failed', 500));

export const searchPlaylists = (p: SearchParamsWithOpts) =>
    getProvider(p.opts)
        .search.playlists(p)
        .catch((e) => wrapError(e, 'Playlist search failed', 500));
