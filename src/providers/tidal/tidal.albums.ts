import { assertData } from '../../utils/error.utils';
import { createPaginatedResponse, normalizePagination } from '../../utils/pagination.utils';
import { extractTidalId } from '../../utils/url.utils';
import { getTidalClient } from './tidal.client';
import TIDAL_ROUTES from './tidal.routes';

interface TidalArtist {
    id: number;
    name: string;
    picture?: string;
}

interface TidalAlbum {
    id: number;
    title: string;
    duration: number;
    numberOfTracks: number;
    numberOfVolumes: number;
    releaseDate: string;
    copyright?: string;
    type: string;
    cover: string;
    explicit: boolean;
    upc?: string;
    audioQuality: string;
    audioModes: string[];
    artist: TidalArtist;
    artists: TidalArtist[];
    mediaMetadata?: {
        tags: string[];
    };
}

interface TidalTrack {
    id: number;
    title: string;
    duration: number;
    trackNumber: number;
    volumeNumber: number;
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

export async function getById(id: string) {
    const client = await getTidalClient();

    const res = await client.get<TidalAlbum>(`${TIDAL_ROUTES.ALBUM.DETAILS}/${id}`);

    return assertData(res.data, 'Album not found');
}

export async function getByIds(ids: string[]) {
    const albums = await Promise.all(ids.map((id) => getById(id).catch(() => null)));

    return albums.filter((album): album is TidalAlbum => album !== null);
}

export async function getByLink(link: string) {
    const id = extractTidalId(link, 'album');

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
    }>(TIDAL_ROUTES.ALBUM.TRACKS.replace('{id}', id), {
        params: {
            limit: safeLimit,
            offset: safeOffset,
        },
    });

    const data = assertData(res.data, 'Album tracks not found');

    return createPaginatedResponse({
        items: data.items,
        total: data.totalNumberOfItems,
        offset: safeOffset,
        limit: safeLimit,
        hasNext: safeOffset + data.items.length < data.totalNumberOfItems,
    });
}

/**
 * Search for album by UPC
 */
export async function getByUpc(upc: string) {
    const client = await getTidalClient();

    const res = await client.get<{
        items: TidalAlbum[];
        limit: number;
        offset: number;
        totalNumberOfItems: number;
    }>(TIDAL_ROUTES.SEARCH.ALBUMS, {
        params: {
            query: upc,
            limit: 10,
            offset: 0,
        },
    });

    const data = assertData(res.data, 'Search failed');

    // Find exact UPC match
    const exactMatch = data.items.find((album) => album.upc === upc);

    if (exactMatch) {
        return exactMatch;
    }

    // Return first result if no exact match
    if (data.items.length > 0) {
        return data.items[0];
    }

    return null;
}
