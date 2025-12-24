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
import type { SearchParams } from '../../types/services.types';
import { assertData } from '../../utils/error.utils';
import { normalizePagination } from '../../utils/main.utils';
import { saavnClient } from './saavn.client';
import { mapGlobalSearch, mapSearchAlbum, mapSearchArtist, mapSearchPlaylist, mapSearchSong } from './saavn.mapper';
import SAAVN_ROUTES from './saavn.routes';

export async function all(query: string): Promise<GlobalSearchResult> {
    const res = await saavnClient.get<SaavnSearchAPIResponse>('/', {
        params: { query, __call: SAAVN_ROUTES.SEARCH.ALL },
    });

    return mapGlobalSearch(assertData(res.data, 'No results found'));
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

    return mapSearchSong(
        assertData(res.data, 'No songs found', () => !res.data.results || res.data.results.length === 0)
    );
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

    return mapSearchAlbum(
        assertData(res.data, 'No albums found', () => !res.data.results || res.data.results.length === 0),
        limit
    );
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

    return mapSearchArtist(
        assertData(res.data, 'No artists found', () => !res.data.results || res.data.results.length === 0),
        limit
    );
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

    return mapSearchPlaylist(
        assertData(res.data, 'No playlists found', () => !res.data.results || res.data.results.length === 0),
        limit
    );
}
