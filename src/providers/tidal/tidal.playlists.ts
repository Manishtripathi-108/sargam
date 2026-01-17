import { assertData } from '../../utils/error.utils';
import { createPaginatedResponse, normalizePagination } from '../../utils/pagination.utils';
import { extractTidalId } from '../../utils/url.utils';
import { getTidalClient } from './tidal.client';
import TIDAL_ROUTES from './tidal.routes';

interface TidalUser {
    id: number;
    nickname?: string;
    picture?: string;
}

interface TidalPlaylist {
    uuid: string;
    title: string;
    description?: string;
    duration: number;
    numberOfTracks: number;
    lastUpdated: string;
    created: string;
    type: string;
    publicPlaylist: boolean;
    url?: string;
    image?: string;
    squareImage?: string;
    creator?: TidalUser;
    popularity?: number;
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
    artist: {
        id: number;
        name: string;
    };
    artists: Array<{
        id: number;
        name: string;
    }>;
}

interface TidalPlaylistItem {
    item: TidalTrack;
    type: string;
    cut?: {
        name: string;
        startTime?: number;
        endTime?: number;
    };
}

export async function getById(id: string) {
    const client = await getTidalClient();

    const res = await client.get<TidalPlaylist>(`${TIDAL_ROUTES.PLAYLIST.DETAILS}/${id}`);

    return assertData(res.data, 'Playlist not found');
}

export async function getByLink(link: string) {
    const id = extractTidalId(link, 'playlist');

    return getById(id);
}

export async function getTracks({ id, limit, offset }: { id: string; limit: number; offset: number }) {
    const { limit: safeLimit, offset: safeOffset } = normalizePagination(limit, offset);

    const client = await getTidalClient();

    const res = await client.get<{
        items: TidalTrack[];
        limit: number;
        offset: number;
        totalNumberOfItems: number;
    }>(TIDAL_ROUTES.PLAYLIST.TRACKS.replace('{uuid}', id), {
        params: {
            limit: safeLimit,
            offset: safeOffset,
        },
    });

    const data = assertData(res.data, 'Playlist tracks not found');

    return createPaginatedResponse({
        items: data.items,
        total: data.totalNumberOfItems,
        offset: safeOffset,
        limit: safeLimit,
        hasNext: safeOffset + data.items.length < data.totalNumberOfItems,
    });
}

/**
 * Get playlist items (includes additional metadata like cuts)
 */
export async function getItems({ id, limit, offset }: { id: string; limit: number; offset: number }) {
    const { limit: safeLimit, offset: safeOffset } = normalizePagination(limit, offset);

    const client = await getTidalClient();

    const res = await client.get<{
        items: TidalPlaylistItem[];
        limit: number;
        offset: number;
        totalNumberOfItems: number;
    }>(TIDAL_ROUTES.PLAYLIST.ITEMS.replace('{uuid}', id), {
        params: {
            limit: safeLimit,
            offset: safeOffset,
        },
    });

    const data = assertData(res.data, 'Playlist items not found');

    return createPaginatedResponse({
        items: data.items,
        total: data.totalNumberOfItems,
        offset: safeOffset,
        limit: safeLimit,
        hasNext: safeOffset + data.items.length < data.totalNumberOfItems,
    });
}
