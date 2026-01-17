import type { QobuzAlbum } from '../../types/qobuz';
import { assertData } from '../../utils/error.utils';
import { createPaginatedResponse, normalizePagination } from '../../utils/pagination.utils';
import { extractQobuzId } from '../../utils/url.utils';
import { getQobuzClient } from './qobuz.client';
import QOBUZ_ROUTES from './qobuz.routes';

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
