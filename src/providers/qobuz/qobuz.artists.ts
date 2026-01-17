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

    const res = await client.get<QobuzArtist>(QOBUZ_ROUTES.ARTIST.GET, {
        params: {
            artist_id: id,
            limit: safeLimit,
            offset: safeOffset,
        },
    });

    const artist = assertData(res.data, 'Artist Albums not found', () => res.data?.albums?.items?.length > 0);

    return createPaginatedResponse({
        items: artist.albums.items,
        total: artist.albums.total,
        offset: safeOffset,
        limit: safeLimit,
    });
}
