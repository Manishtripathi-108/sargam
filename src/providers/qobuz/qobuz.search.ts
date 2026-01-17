import type {
    QobuzAlbumSearchResponse,
    QobuzArtistSearchResponse,
    QobuzCatalogSearchResponse,
    QobuzPlaylistSearchResponse,
    QobuzTrackSearchResponse,
} from '../../types/qobuz';
import { assertData } from '../../utils/error.utils';
import { createPaginatedResponse, normalizePagination } from '../../utils/pagination.utils';
import { getQobuzClient } from './qobuz.client';
import QOBUZ_ROUTES from './qobuz.routes';

type SearchParams = {
    query: string;
    limit: number;
    offset: number;
};

export async function all(p: SearchParams) {
    const { limit, offset } = normalizePagination(p.limit, p.offset);

    const client = getQobuzClient();

    const res = await client.get<QobuzCatalogSearchResponse>(QOBUZ_ROUTES.SEARCH.CATALOG, {
        params: {
            query: p.query,
            limit,
            offset,
        },
    });

    return assertData(res.data, 'Search failed');
}

export async function songs(p: SearchParams) {
    const { limit, offset } = normalizePagination(p.limit, p.offset);

    const client = getQobuzClient();

    const res = await client.get<QobuzTrackSearchResponse>(QOBUZ_ROUTES.TRACK.SEARCH, {
        params: {
            query: p.query,
            limit,
            offset,
        },
    });

    const data = assertData(res.data, 'Search failed');

    return createPaginatedResponse({
        items: data.tracks.items,
        total: data.tracks.total,
        offset,
        limit,
    });
}

export async function albums(p: SearchParams) {
    const { limit, offset } = normalizePagination(p.limit, p.offset);

    const client = getQobuzClient();

    const res = await client.get<QobuzAlbumSearchResponse>(QOBUZ_ROUTES.ALBUM.SEARCH, {
        params: {
            query: p.query,
            limit,
            offset,
        },
    });

    const data = assertData(res.data, 'Search failed');

    return createPaginatedResponse({
        items: data.albums.items,
        total: data.albums.total,
        offset,
        limit,
    });
}

export async function artists(p: SearchParams) {
    const { limit, offset } = normalizePagination(p.limit, p.offset);

    const client = getQobuzClient();

    const res = await client.get<QobuzArtistSearchResponse>(QOBUZ_ROUTES.ARTIST.SEARCH, {
        params: {
            query: p.query,
            limit,
            offset,
        },
    });

    const data = assertData(res.data, 'Search failed');

    return createPaginatedResponse({
        items: data.artists.items,
        total: data.artists.total,
        offset,
        limit,
    });
}

export async function playlists(p: SearchParams) {
    const { limit, offset } = normalizePagination(p.limit, p.offset);

    const client = getQobuzClient();

    const res = await client.get<QobuzPlaylistSearchResponse>(QOBUZ_ROUTES.PLAYLIST.SEARCH, {
        params: {
            query: p.query,
            limit,
            offset,
        },
    });

    const data = assertData(res.data, 'Search failed');

    return createPaginatedResponse({
        items: data.playlists.items,
        total: data.playlists.total,
        offset,
        limit,
    });
}
