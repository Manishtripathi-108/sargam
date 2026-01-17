import { assertData } from '../../utils/error.utils';
import { createPaginatedResponse, normalizePagination } from '../../utils/pagination.utils';
import { getQobuzClient } from './qobuz.client';
import QOBUZ_ROUTES from './qobuz.routes';

interface QobuzArtist {
    id: number;
    name: string;
    picture?: string;
    albums_count?: number;
}

interface QobuzAlbum {
    id: string;
    title: string;
    duration: number;
    tracks_count: number;
    release_date_original?: string;
    hires: boolean;
    image: {
        small: string;
        thumbnail: string;
        large: string;
    };
    artist: QobuzArtist;
}

interface QobuzTrack {
    id: number;
    title: string;
    version?: string;
    duration: number;
    track_number: number;
    isrc: string;
    maximum_bit_depth: number;
    maximum_sampling_rate: number;
    hires: boolean;
    hires_streamable: boolean;
    performer: {
        id: number;
        name: string;
    };
    album: {
        id: string;
        title: string;
        image: {
            small: string;
            thumbnail: string;
            large: string;
        };
        artist: QobuzArtist;
    };
}

interface QobuzPlaylist {
    id: number;
    name: string;
    description?: string;
    duration: number;
    tracks_count: number;
    is_public: boolean;
    owner: {
        id: number;
        name: string;
    };
}

interface QobuzCatalogSearchResponse {
    query: string;
    albums?: {
        items: QobuzAlbum[];
        limit: number;
        offset: number;
        total: number;
    };
    artists?: {
        items: QobuzArtist[];
        limit: number;
        offset: number;
        total: number;
    };
    tracks?: {
        items: QobuzTrack[];
        limit: number;
        offset: number;
        total: number;
    };
    playlists?: {
        items: QobuzPlaylist[];
        limit: number;
        offset: number;
        total: number;
    };
}

export async function all({ query, limit, offset }: { query: string; limit: number; offset: number }) {
    const { limit: safeLimit, offset: safeOffset } = normalizePagination(limit, offset);

    const client = getQobuzClient();

    const res = await client.get<QobuzCatalogSearchResponse>(QOBUZ_ROUTES.SEARCH.CATALOG, {
        params: {
            query,
            limit: safeLimit,
            offset: safeOffset,
        },
    });

    return assertData(res.data, 'Search failed');
}

export async function songs({ query, limit, offset }: { query: string; limit: number; offset: number }) {
    const { limit: safeLimit, offset: safeOffset } = normalizePagination(limit, offset);

    const client = getQobuzClient();

    const res = await client.get<{ query: string; tracks: { items: QobuzTrack[]; limit: number; offset: number; total: number } }>(QOBUZ_ROUTES.TRACK.SEARCH, {
        params: {
            query,
            limit: safeLimit,
            offset: safeOffset,
        },
    });

    const data = assertData(res.data, 'Search failed');

    return createPaginatedResponse({
        items: data.tracks.items,
        total: data.tracks.total,
        offset: safeOffset,
        limit: safeLimit,
        hasNext: safeOffset + data.tracks.items.length < data.tracks.total,
    });
}

export async function albums({ query, limit, offset }: { query: string; limit: number; offset: number }) {
    const { limit: safeLimit, offset: safeOffset } = normalizePagination(limit, offset);

    const client = getQobuzClient();

    const res = await client.get<{ query: string; albums: { items: QobuzAlbum[]; limit: number; offset: number; total: number } }>(QOBUZ_ROUTES.ALBUM.SEARCH, {
        params: {
            query,
            limit: safeLimit,
            offset: safeOffset,
        },
    });

    const data = assertData(res.data, 'Search failed');

    return createPaginatedResponse({
        items: data.albums.items,
        total: data.albums.total,
        offset: safeOffset,
        limit: safeLimit,
        hasNext: safeOffset + data.albums.items.length < data.albums.total,
    });
}

export async function artists({ query, limit, offset }: { query: string; limit: number; offset: number }) {
    const { limit: safeLimit, offset: safeOffset } = normalizePagination(limit, offset);

    const client = getQobuzClient();

    const res = await client.get<{ query: string; artists: { items: QobuzArtist[]; limit: number; offset: number; total: number } }>(QOBUZ_ROUTES.ARTIST.SEARCH, {
        params: {
            query,
            limit: safeLimit,
            offset: safeOffset,
        },
    });

    const data = assertData(res.data, 'Search failed');

    return createPaginatedResponse({
        items: data.artists.items,
        total: data.artists.total,
        offset: safeOffset,
        limit: safeLimit,
        hasNext: safeOffset + data.artists.items.length < data.artists.total,
    });
}

export async function playlists({ query, limit, offset }: { query: string; limit: number; offset: number }) {
    const { limit: safeLimit, offset: safeOffset } = normalizePagination(limit, offset);

    const client = getQobuzClient();

    const res = await client.get<{ query: string; playlists: { items: QobuzPlaylist[]; limit: number; offset: number; total: number } }>(QOBUZ_ROUTES.PLAYLIST.SEARCH, {
        params: {
            query,
            limit: safeLimit,
            offset: safeOffset,
        },
    });

    const data = assertData(res.data, 'Search failed');

    return createPaginatedResponse({
        items: data.playlists.items,
        total: data.playlists.total,
        offset: safeOffset,
        limit: safeLimit,
        hasNext: safeOffset + data.playlists.items.length < data.playlists.total,
    });
}

/**
 * Search by ISRC to find a track
 */
export async function byIsrc({ isrc }: { isrc: string }) {
    const result = await songs({ query: isrc, limit: 10, offset: 0 });

    // Find exact ISRC match
    const exactMatch = result.items.find((track) => track.isrc === isrc);

    if (exactMatch) {
        return exactMatch;
    }

    // Return first result if no exact match
    return result.items.length > 0 ? result.items[0] : null;
}
