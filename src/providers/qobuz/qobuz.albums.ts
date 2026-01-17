import type { QobuzAlbum } from '../../types/qobuz';
import { assertData } from '../../utils/error.utils';
import { createPaginatedResponse, normalizePagination } from '../../utils/pagination.utils';
import { extractQobuzId } from '../../utils/url.utils';
import { getQobuzClient } from './qobuz.client';
import QOBUZ_ROUTES from './qobuz.routes';

export async function getById(album_id: string) {
    const client = getQobuzClient();

    const res = await client.get<QobuzAlbum>(QOBUZ_ROUTES.ALBUM.GET, {
        params: { album_id },
    });

    return assertData(res.data, 'Album not found');
}

export async function getByLink(link: string) {
    const album_id = extractQobuzId(link, 'album');

    return getById(album_id);
}

export async function getTracks({ id, limit, offset }: { id: string; limit: number; offset: number }) {
    const { limit: safeLimit, offset: safeOffset } = normalizePagination(limit, offset);

    // Qobuz returns tracks in the album response
    const res = await client.get<QobuzAlbum>(QOBUZ_ROUTES.ALBUM.GET, {
        params: {
            album_id: id,
            limit: safeLimit,
            offset: safeOffset,
        },
    });

    const album = assertData(res.data, 'Album Songs not found', () => res.data?.tracks?.items?.length > 0);

    // Apply pagination to tracks
    return createPaginatedResponse({
        items: album.tracks.items,
        total: album.tracks.total,
        offset: safeOffset,
        limit: safeLimit,
    });
}
