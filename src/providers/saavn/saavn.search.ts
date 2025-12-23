import type {
    GlobalSearchResult,
    SearchAlbum,
    SearchArtist,
    SearchPlaylist,
    SearchSong,
} from '../../types/core/search.model';
import type { SaavnSearchAlbumAPIResponse } from '../../types/saavn/albums.types';
import type {
    SaavnSearchAPIResponse,
    SaavnSearchArtistAPIResponse,
    SaavnSearchPlaylistAPIResponse,
    SaavnSearchSongAPIResponse,
} from '../../types/saavn/search.types';
import { notFound } from '../../utils/error.utils';
import { normalizePagination } from '../../utils/main.utils';
import { saavnClient } from './saavn.client';
import { mapGlobalSearch, mapSearchAlbum, mapSearchPlaylist, mapSongBase, mapSearchArtist } from './saavn.mapper';
import SAAVN_ROUTES from './saavn.routes';

type SearchParams = {
    query: string;
    offset: number;
    limit: number;
};

export async function all(query: string): Promise<GlobalSearchResult> {
    const res = await saavnClient.get<SaavnSearchAPIResponse>('/', {
        params: { query, __call: SAAVN_ROUTES.SEARCH.ALL },
    });

    if (!res.data) {
        throw notFound('Search failed');
    }

    return mapGlobalSearch(res.data);
}

export async function songs({ query, offset, limit }: SearchParams): Promise<SearchSong> {
    const { page } = normalizePagination(limit, offset);

    const res = await saavnClient.get<SaavnSearchSongAPIResponse>('/', {
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

export async function albums({ query, offset, limit }: SearchParams): Promise<SearchAlbum> {
    const { page } = normalizePagination(limit, offset);

    const res = await saavnClient.get<SaavnSearchAlbumAPIResponse>('/', {
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

export async function artists({ query, offset, limit }: SearchParams): Promise<SearchArtist> {
    const { page } = normalizePagination(limit, offset);

    const res = await saavnClient.get<SaavnSearchArtistAPIResponse>('/', {
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

    return mapSearchArtist(res.data);
}

export async function playlists({ query, offset, limit }: SearchParams): Promise<SearchPlaylist> {
    const { page } = normalizePagination(limit, offset);

    const res = await saavnClient.get<SaavnSearchPlaylistAPIResponse>('/', {
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
