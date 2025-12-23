import type { GlobalSearchResult, SearchAlbum, SearchArtist, SearchPlaylist, SearchSong } from '../types/core/search.model';
import { AppError, wrapError } from '../utils/error.utils';
import { getProvider, type ServiceOptions } from '../utils/provider.util';

export async function globalSearch(params: {
    query: string;
    type: 'song' | 'album' | 'artist' | 'playlist' | 'all';
    limit: number;
    offset: number;
    opts?: ServiceOptions;
}): Promise<GlobalSearchResult | SearchSong | SearchAlbum | SearchArtist | SearchPlaylist> {
    if (!params.query) {
        throw new AppError('Query is required', 400);
    }

    const search = getProvider(params.opts).search;

    try {
        if (params.type === 'song') return search.songs(params);
        if (params.type === 'album') return search.albums(params);
        if (params.type === 'artist') return search.artists(params);
        if (params.type === 'playlist') return search.playlists(params);
        return search.all(params.query);
    } catch (err) {
        return wrapError(err, 'Search failed', 500);
    }
}

export const searchSongs = (p: { query: string; limit: number; offset: number; opts?: ServiceOptions }) =>
    getProvider(p.opts)
        .search.songs(p)
        .catch((e) => wrapError(e, 'Song search failed', 500));

export const searchAlbums = (p: { query: string; limit: number; offset: number; opts?: ServiceOptions }) =>
    getProvider(p.opts)
        .search.albums(p)
        .catch((e) => wrapError(e, 'Album search failed', 500));

export const searchArtists = (p: { query: string; limit: number; offset: number; opts?: ServiceOptions }) =>
    getProvider(p.opts)
        .search.artists(p)
        .catch((e) => wrapError(e, 'Artist search failed', 500));

export const searchPlaylists = (p: { query: string; limit: number; offset: number; opts?: ServiceOptions }) =>
    getProvider(p.opts)
        .search.playlists(p)
        .catch((e) => wrapError(e, 'Playlist search failed', 500));
