import type {
    GlobalSearchResult,
    SearchAlbum,
    SearchArtist,
    SearchPlaylist,
    SearchSong,
} from '../../types/core/search.model';
import { notFound } from '../../utils/error.utils';
import { saavnClient } from './saavn.client';
import { mapGlobalSearch, mapSearchAlbum, mapSearchPlaylist, mapArtist, mapSongBase } from './saavn.mapper';
import SAAVN_ROUTES from './saavn.routes';

type SearchParams = {
    query: string;
    page: number;
    limit: number;
};

export async function searchAll(query: string): Promise<GlobalSearchResult> {
    const res = await saavnClient.get('/', {
        params: { query, __call: SAAVN_ROUTES.SEARCH.ALL },
    });

    if (!res.data) {
        throw notFound('Search failed');
    }

    return mapGlobalSearch(res.data);
}

export async function searchSongs({ query, page, limit }: SearchParams): Promise<SearchSong> {
    const res = await saavnClient.get('/', {
        params: {
            q: query,
            p: page,
            n: limit,
            __call: SAAVN_ROUTES.SEARCH.SONGS,
        },
    });

    if (!res.data || !res.data.results || res.data.results.length === 0) {
        throw notFound('No songs found');
    }

    return {
        total: Number(res.data?.total),
        start: Number(res.data?.start),
        results: res.data.results.map(mapSongBase).slice(0, limit),
    };
}

export async function searchAlbums({ query, page, limit }: SearchParams): Promise<SearchAlbum> {
    const res = await saavnClient.get('/', {
        params: {
            q: query,
            p: page,
            n: limit,
            __call: SAAVN_ROUTES.SEARCH.ALBUMS,
        },
    });

    if (!res.data || !res.data.results || res.data.results.length === 0) {
        throw notFound('No albums found');
    }

    return mapSearchAlbum(res.data);
}

export async function searchArtists({ query, page, limit }: SearchParams): Promise<SearchArtist> {
    const res = await saavnClient.get('/', {
        params: {
            q: query,
            p: page,
            n: limit,
            __call: SAAVN_ROUTES.SEARCH.ARTISTS,
        },
    });

    if (!res.data || !res.data.results || res.data.results.length === 0) {
        throw notFound('No artists found');
    }

    return {
        total: Number(res.data?.total),
        start: Number(res.data?.start),
        results: res.data.results.map(mapArtist).slice(0, limit),
    };
}

export async function searchPlaylists({ query, page, limit }: SearchParams): Promise<SearchPlaylist> {
    const res = await saavnClient.get('/', {
        params: {
            q: query,
            p: page,
            n: limit,
            __call: SAAVN_ROUTES.SEARCH.PLAYLISTS,
        },
    });

    if (!res.data || !res.data.results || res.data.results.length === 0) {
        throw notFound('No playlists found');
    }

    return mapSearchPlaylist(res.data);
}
