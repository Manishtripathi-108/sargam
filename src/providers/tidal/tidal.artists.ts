import { assertData } from '../../utils/error.utils';
import { createPaginatedResponse, normalizePagination } from '../../utils/pagination.utils';
import { extractTidalId } from '../../utils/url.utils';
import { getTidalClient } from './tidal.client';
import TIDAL_ROUTES from './tidal.routes';

interface TidalArtist {
    id: number;
    name: string;
    artistTypes?: string[];
    picture?: string;
    popularity?: number;
    url?: string;
}

interface TidalAlbum {
    id: number;
    title: string;
    cover: string;
    releaseDate: string;
    numberOfTracks: number;
    explicit: boolean;
    audioQuality: string;
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

export async function getById(id: string) {
    const client = await getTidalClient();

    const res = await client.get<TidalArtist>(`${TIDAL_ROUTES.ARTIST.DETAILS}/${id}`);

    return assertData(res.data, 'Artist not found');
}

export async function getByIds(ids: string[]) {
    const artists = await Promise.all(ids.map((id) => getById(id).catch(() => null)));

    return artists.filter((artist): artist is TidalArtist => artist !== null);
}

export async function getByLink(link: string) {
    const id = extractTidalId(link, 'artist');

    return getById(id);
}

export async function getTopTracks({ id, limit, offset }: { id: string; limit: number; offset: number }) {
    const { limit: safeLimit, offset: safeOffset } = normalizePagination(limit, offset);

    const client = await getTidalClient();

    const res = await client.get<{
        items: TidalTrack[];
        limit: number;
        offset: number;
        totalNumberOfItems: number;
    }>(TIDAL_ROUTES.ARTIST.TOP_TRACKS.replace('{id}', id), {
        params: {
            limit: safeLimit,
            offset: safeOffset,
        },
    });

    const data = assertData(res.data, 'Top tracks not found');

    return createPaginatedResponse({
        items: data.items,
        total: data.totalNumberOfItems,
        offset: safeOffset,
        limit: safeLimit,
        hasNext: safeOffset + data.items.length < data.totalNumberOfItems,
    });
}

export async function getAlbums({ id, limit, offset }: { id: string; limit: number; offset: number }) {
    const { limit: safeLimit, offset: safeOffset } = normalizePagination(limit, offset);

    const client = await getTidalClient();

    const res = await client.get<{
        items: TidalAlbum[];
        limit: number;
        offset: number;
        totalNumberOfItems: number;
    }>(TIDAL_ROUTES.ARTIST.ALBUMS.replace('{id}', id), {
        params: {
            limit: safeLimit,
            offset: safeOffset,
        },
    });

    const data = assertData(res.data, 'Albums not found');

    return createPaginatedResponse({
        items: data.items,
        total: data.totalNumberOfItems,
        offset: safeOffset,
        limit: safeLimit,
        hasNext: safeOffset + data.items.length < data.totalNumberOfItems,
    });
}

export async function getSimilarArtists({ id, limit, offset }: { id: string; limit: number; offset: number }) {
    const { limit: safeLimit, offset: safeOffset } = normalizePagination(limit, offset);

    const client = await getTidalClient();

    const res = await client.get<{
        items: TidalArtist[];
        limit: number;
        offset: number;
        totalNumberOfItems: number;
    }>(TIDAL_ROUTES.ARTIST.SIMILAR.replace('{id}', id), {
        params: {
            limit: safeLimit,
            offset: safeOffset,
        },
    });

    const data = assertData(res.data, 'Similar artists not found');

    return createPaginatedResponse({
        items: data.items,
        total: data.totalNumberOfItems,
        offset: safeOffset,
        limit: safeLimit,
        hasNext: safeOffset + data.items.length < data.totalNumberOfItems,
    });
}
