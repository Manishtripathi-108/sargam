import { assertData } from '../../utils/error.utils';
import { createPaginatedResponse, normalizePagination } from '../../utils/pagination.utils';
import { extractQobuzId } from '../../utils/url.utils';
import { getQobuzClient } from './qobuz.client';
import QOBUZ_ROUTES from './qobuz.routes';

interface QobuzAlbumImage {
    small: string;
    thumbnail: string;
    large: string;
}

interface QobuzArtist {
    id: number;
    name: string;
    picture?: string;
}

interface QobuzLabel {
    id: number;
    name: string;
}

interface QobuzGenre {
    id: number;
    name: string;
    slug: string;
    color: string;
}

interface QobuzTrack {
    id: number;
    title: string;
    version?: string;
    duration: number;
    track_number: number;
    media_number: number;
    isrc: string;
    maximum_bit_depth: number;
    maximum_sampling_rate: number;
    hires: boolean;
    hires_streamable: boolean;
    performer: {
        id: number;
        name: string;
    };
}

interface QobuzAlbum {
    id: string;
    title: string;
    version?: string;
    duration: number;
    tracks_count: number;
    media_count: number;
    release_date_original?: string;
    release_date_download?: string;
    release_date_stream?: string;
    copyright?: string;
    maximum_bit_depth: number;
    maximum_sampling_rate: number;
    hires: boolean;
    hires_streamable: boolean;
    streamable: boolean;
    downloadable: boolean;
    displayable: boolean;
    purchasable: boolean;
    upc?: string;
    url?: string;
    image: QobuzAlbumImage;
    artist: QobuzArtist;
    label?: QobuzLabel;
    genre?: QobuzGenre;
    tracks?: {
        items: QobuzTrack[];
        offset: number;
        limit: number;
        total: number;
    };
}

interface QobuzAlbumSearchResponse {
    query: string;
    albums: {
        items: QobuzAlbum[];
        limit: number;
        offset: number;
        total: number;
    };
}

export async function getById(id: string) {
    const client = getQobuzClient();

    const res = await client.get<QobuzAlbum>(QOBUZ_ROUTES.ALBUM.GET, {
        params: { album_id: id },
    });

    return assertData(res.data, 'Album not found');
}

export async function getByLink(link: string) {
    const id = extractQobuzId(link, 'album');

    return getById(id);
}

export async function getTracks({ id, limit, offset }: { id: string; limit: number; offset: number }) {
    const { limit: safeLimit, offset: safeOffset } = normalizePagination(limit, offset);

    // Qobuz returns tracks in the album response
    const album = await getById(id);

    if (!album.tracks) {
        return createPaginatedResponse({
            items: [],
            total: 0,
            offset: safeOffset,
            limit: safeLimit,
            hasNext: false,
        });
    }

    // Apply pagination to tracks
    const paginatedTracks = album.tracks.items.slice(safeOffset, safeOffset + safeLimit);

    return createPaginatedResponse({
        items: paginatedTracks,
        total: album.tracks.total,
        offset: safeOffset,
        limit: safeLimit,
        hasNext: safeOffset + paginatedTracks.length < album.tracks.total,
    });
}

export async function search({ query, limit, offset }: { query: string; limit: number; offset: number }) {
    const { limit: safeLimit, offset: safeOffset } = normalizePagination(limit, offset);

    const client = getQobuzClient();

    const res = await client.get<QobuzAlbumSearchResponse>(QOBUZ_ROUTES.ALBUM.SEARCH, {
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

/**
 * Search for album by UPC
 */
export async function getByUpc(upc: string) {
    const result = await search({ query: upc, limit: 10, offset: 0 });

    // Find exact UPC match
    const exactMatch = result.items.find((album) => album.upc === upc);

    if (exactMatch) {
        return exactMatch;
    }

    // Return first result if no exact match
    return result.items.length > 0 ? result.items[0] : null;
}
