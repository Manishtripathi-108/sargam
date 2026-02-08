import type {
    TidalArtist,
    TidalPaginatedResponse,
    TidalPlaylist,
    TidalSearchAlbum,
    TidalSearchAllResponse,
    TidalTrack,
} from '../../types/tidal';
import { assertData } from '../../utils/error.utils';
import { createPaginatedResponse, normalizePagination } from '../../utils/pagination.utils';
import { getTidalClient } from './tidal.client';
import TIDAL_ROUTES from './tidal.routes';

type SearchParams = {
    query: string;
    limit: number;
    offset: number;
};

async function searchBase<T>(endpoint: string, query: string, limit: number, offset: number) {
    const { limit: safeLimit, offset: safeOffset } = normalizePagination(limit, offset);

    const client = await getTidalClient();

    const res = await client.get<TidalPaginatedResponse<T>>(endpoint, {
        params: {
            query,
            limit: safeLimit,
            offset: safeOffset,
        },
    });

    const data = assertData(res.data, '[Tidal] Search failed');

    return createPaginatedResponse({
        items: data.items,
        total: data.totalNumberOfItems,
        offset: safeOffset,
        limit: safeLimit,
        hasNext: safeOffset + data.items.length < data.totalNumberOfItems,
    });
}

export async function all({ query, limit, offset }: SearchParams) {
    const { limit: safeLimit, offset: safeOffset } = normalizePagination(limit, offset);

    const client = await getTidalClient();

    const res = await client.get<TidalSearchAllResponse>(TIDAL_ROUTES.SEARCH.BASE, {
        params: {
            query,
            limit: safeLimit,
            offset: safeOffset,
        },
    });

    return assertData(res.data, '[Tidal] Search failed');
}

export async function songs({ query, limit, offset }: SearchParams) {
    return searchBase<TidalTrack>(TIDAL_ROUTES.SEARCH.TRACKS, query, limit, offset);
}

export async function albums({ query, limit, offset }: SearchParams) {
    return searchBase<TidalSearchAlbum>(TIDAL_ROUTES.SEARCH.ALBUMS, query, limit, offset);
}

export async function artists({ query, limit, offset }: SearchParams) {
    return searchBase<TidalArtist>(TIDAL_ROUTES.SEARCH.ARTISTS, query, limit, offset);
}

export async function playlists({ query, limit, offset }: SearchParams) {
    return searchBase<TidalPlaylist>(TIDAL_ROUTES.SEARCH.PLAYLISTS, query, limit, offset);
}

export async function byIsrc({ isrc }: { isrc: string }) {
    const result = await songs({ query: isrc, limit: 10, offset: 0 });

    const exactMatch = result.items.find((track) => track.isrc === isrc);

    if (exactMatch) {
        return exactMatch;
    }

    return result.items.length > 0 ? result.items[0] : null;
}
