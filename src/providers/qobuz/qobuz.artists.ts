import type { QobuzArtist } from '../../types/qobuz';
import { assertData } from '../../utils/error.utils';
import { createPaginatedResponse, normalizePagination } from '../../utils/pagination.utils';
import { extractQobuzId } from '../../utils/url.utils';
import { getQobuzClient } from './qobuz.client';
import QOBUZ_ROUTES from './qobuz.routes';

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