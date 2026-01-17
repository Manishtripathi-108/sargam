import { assertData } from '../../utils/error.utils';
import { createPaginatedResponse, normalizePagination } from '../../utils/pagination.utils';
import { extractQobuzId } from '../../utils/url.utils';
import { getQobuzClient } from './qobuz.client';
import QOBUZ_ROUTES from './qobuz.routes';

interface QobuzPerformer {
    id: number;
    name: string;
}

interface QobuzAlbumImage {
    small: string;
    thumbnail: string;
    large: string;
}

interface QobuzAlbumInfo {
    id: string;
    title: string;
    image: QobuzAlbumImage;
    artist: {
        id: number;
        name: string;
    };
    label?: {
        id: number;
        name: string;
    };
}

interface QobuzTrack {
    id: number;
    title: string;
    version?: string;
    duration: number;
    track_number: number;
    media_number: number;
    isrc: string;
    copyright?: string;
    maximum_bit_depth: number;
    maximum_sampling_rate: number;
    hires: boolean;
    hires_streamable: boolean;
    release_date_original?: string;
    performer: QobuzPerformer;
    album: QobuzAlbumInfo;
}

interface QobuzSearchResponse {
    query: string;
    tracks: {
        items: QobuzTrack[];
        limit: number;
        offset: number;
        total: number;
    };
}

export async function getById(id: string) {
    const client = getQobuzClient();

    const res = await client.get<QobuzTrack>(QOBUZ_ROUTES.TRACK.GET, {
        params: { track_id: id },
    });

    return assertData(res.data, 'Track not found');
}

export async function getByLink(link: string) {
    const id = extractQobuzId(link, 'track');

    return getById(id);
}

export async function getByIsrc(isrc: string) {
    const client = getQobuzClient();

    const res = await client.get<QobuzSearchResponse>(QOBUZ_ROUTES.TRACK.SEARCH, {
        params: {
            query: isrc,
            limit: 10,
            offset: 0,
        },
    });

    const data = assertData(res.data, 'Search failed');

    // Find exact ISRC match
    const exactMatch = data.tracks.items.find((track) => track.isrc === isrc);

    if (exactMatch) {
        return exactMatch;
    }

    // Return first result if no exact match
    if (data.tracks.items.length > 0) {
        return data.tracks.items[0];
    }

    return null;
}

export async function search({ query, limit, offset }: { query: string; limit: number; offset: number }) {
    const { limit: safeLimit, offset: safeOffset } = normalizePagination(limit, offset);

    const client = getQobuzClient();

    const res = await client.get<QobuzSearchResponse>(QOBUZ_ROUTES.TRACK.SEARCH, {
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

/**
 * Get track ISRC
 */
export async function getIsrc(id: string): Promise<string> {
    const track = await getById(id);
    return track.isrc;
}
