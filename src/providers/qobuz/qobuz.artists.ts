import { assertData } from '../../utils/error.utils';
import { createPaginatedResponse, normalizePagination } from '../../utils/pagination.utils';
import { extractQobuzId } from '../../utils/url.utils';
import { getQobuzClient } from './qobuz.client';
import QOBUZ_ROUTES from './qobuz.routes';

interface QobuzArtistImage {
    small?: string;
    medium?: string;
    large?: string;
    extralarge?: string;
}

interface QobuzAlbum {
    id: string;
    title: string;
    duration: number;
    tracks_count: number;
    release_date_original?: string;
    hires: boolean;
    hires_streamable: boolean;
    image: {
        small: string;
        thumbnail: string;
        large: string;
    };
}

interface QobuzArtist {
    id: number;
    name: string;
    slug?: string;
    picture?: string;
    image?: QobuzArtistImage;
    albums_count?: number;
    biography?: {
        summary?: string;
        content?: string;
    };
    albums?: {
        items: QobuzAlbum[];
        offset: number;
        limit: number;
        total: number;
    };
}

interface QobuzArtistSearchResponse {
    query: string;
    artists: {
        items: QobuzArtist[];
        limit: number;
        offset: number;
        total: number;
    };
}

export async function getById(id: string) {
    const client = getQobuzClient();

    const res = await client.get<QobuzArtist>(QOBUZ_ROUTES.ARTIST.GET, {
        params: { artist_id: id },
    });

    return assertData(res.data, 'Artist not found');
}

export async function getByLink(link: string) {
    const id = extractQobuzId(link, 'artist');

    return getById(id);
}

export async function getAlbums({ id, limit, offset }: { id: string; limit: number; offset: number }) {
    const { limit: safeLimit, offset: safeOffset } = normalizePagination(limit, offset);

    // Qobuz returns albums in the artist response
    const artist = await getById(id);

    if (!artist.albums) {
        return createPaginatedResponse({
            items: [],
            total: 0,
            offset: safeOffset,
            limit: safeLimit,
            hasNext: false,
        });
    }

    // Apply pagination to albums
    const paginatedAlbums = artist.albums.items.slice(safeOffset, safeOffset + safeLimit);

    return createPaginatedResponse({
        items: paginatedAlbums,
        total: artist.albums.total,
        offset: safeOffset,
        limit: safeLimit,
        hasNext: safeOffset + paginatedAlbums.length < artist.albums.total,
    });
}

export async function search({ query, limit, offset }: { query: string; limit: number; offset: number }) {
    const { limit: safeLimit, offset: safeOffset } = normalizePagination(limit, offset);

    const client = getQobuzClient();

    const res = await client.get<QobuzArtistSearchResponse>(QOBUZ_ROUTES.ARTIST.SEARCH, {
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
