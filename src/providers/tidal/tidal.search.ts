import { assertData } from '../../utils/error.utils';
import { createPaginatedResponse, normalizePagination } from '../../utils/pagination.utils';
import { getTidalClient } from './tidal.client';
import TIDAL_ROUTES from './tidal.routes';

interface TidalArtist {
    id: number;
    name: string;
    picture?: string;
    popularity?: number;
}

interface TidalAlbum {
    id: number;
    title: string;
    cover: string;
    releaseDate: string;
    numberOfTracks: number;
    explicit: boolean;
    audioQuality: string;
    artist: TidalArtist;
}

interface TidalTrack {
    id: number;
    title: string;
    duration: number;
    trackNumber: number;
    isrc: string;
    explicit: boolean;
    audioQuality: string;
    album: {
        id: number;
        title: string;
        cover: string;
    };
    artist: TidalArtist;
    artists: TidalArtist[];
}

interface TidalPlaylist {
    uuid: string;
    title: string;
    description?: string;
    duration: number;
    numberOfTracks: number;
    publicPlaylist: boolean;
    image?: string;
    squareImage?: string;
    creator?: {
        id: number;
        nickname?: string;
    };
}

interface TidalSearchResponse<T> {
    items: T[];
    limit: number;
    offset: number;
    totalNumberOfItems: number;
}

interface TidalSearchAllResponse {
    artists?: TidalSearchResponse<TidalArtist>;
    albums?: TidalSearchResponse<TidalAlbum>;
    tracks?: TidalSearchResponse<TidalTrack>;
    playlists?: TidalSearchResponse<TidalPlaylist>;
    topHit?: {
        type: string;
        value: TidalArtist | TidalAlbum | TidalTrack | TidalPlaylist;
    };
}

async function searchBase<T>(endpoint: string, query: string, limit: number, offset: number) {
    const { limit: safeLimit, offset: safeOffset } = normalizePagination(limit, offset);

    const client = await getTidalClient();

    const res = await client.get<TidalSearchResponse<T>>(endpoint, {
        params: {
            query,
            limit: safeLimit,
            offset: safeOffset,
        },
    });

    const data = assertData(res.data, 'Search failed');

    return createPaginatedResponse({
        items: data.items,
        total: data.totalNumberOfItems,
        offset: safeOffset,
        limit: safeLimit,
        hasNext: safeOffset + data.items.length < data.totalNumberOfItems,
    });
}

export async function all({ query, limit, offset }: { query: string; limit: number; offset: number }) {
    const { limit: safeLimit, offset: safeOffset } = normalizePagination(limit, offset);

    const client = await getTidalClient();

    const res = await client.get<TidalSearchAllResponse>(TIDAL_ROUTES.SEARCH.BASE, {
        params: {
            query,
            limit: safeLimit,
            offset: safeOffset,
        },
    });

    return assertData(res.data, 'Search failed');
}

export async function songs({ query, limit, offset }: { query: string; limit: number; offset: number }) {
    return searchBase<TidalTrack>(TIDAL_ROUTES.SEARCH.TRACKS, query, limit, offset);
}

export async function albums({ query, limit, offset }: { query: string; limit: number; offset: number }) {
    return searchBase<TidalAlbum>(TIDAL_ROUTES.SEARCH.ALBUMS, query, limit, offset);
}

export async function artists({ query, limit, offset }: { query: string; limit: number; offset: number }) {
    return searchBase<TidalArtist>(TIDAL_ROUTES.SEARCH.ARTISTS, query, limit, offset);
}

export async function playlists({ query, limit, offset }: { query: string; limit: number; offset: number }) {
    return searchBase<TidalPlaylist>(TIDAL_ROUTES.SEARCH.PLAYLISTS, query, limit, offset);
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
