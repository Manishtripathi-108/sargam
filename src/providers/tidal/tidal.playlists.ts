import type { TidalPaginatedResponse, TidalPlaylist, TidalPlaylistItem, TidalTrack } from '../../types/tidal';
import { assertData } from '../../utils/error.utils';
import { createPaginatedResponse, normalizePagination } from '../../utils/pagination.utils';
import { extractId } from '../../utils/url.utils';
import { getTidalClient } from './tidal.client';
import TIDAL_ROUTES from './tidal.routes';

export async function getById(id: string) {
    const client = await getTidalClient();

    const res = await client.get<TidalPlaylist>(`${TIDAL_ROUTES.PLAYLIST.DETAILS}/${id}`);

    return assertData(res.data, '[Tidal] Playlist not found');
}

export async function getByLink(link: string) {
    const id = extractId(link, 'tidal', 'playlist');

    return getById(id);
}

export async function getTracks({ id, limit, offset }: { id: string; limit: number; offset: number }) {
    const { limit: safeLimit, offset: safeOffset } = normalizePagination(limit, offset);

    const client = await getTidalClient();

    const res = await client.get<TidalPaginatedResponse<TidalTrack>>(
        TIDAL_ROUTES.PLAYLIST.TRACKS.replace('{uuid}', id),
        {
            params: {
                limit: safeLimit,
                offset: safeOffset,
            },
        }
    );

    const data = assertData(res.data, '[Tidal] Playlist tracks not found');

    return createPaginatedResponse({
        items: data.items,
        total: data.totalNumberOfItems,
        offset: safeOffset,
        limit: safeLimit,
        hasNext: safeOffset + data.items.length < data.totalNumberOfItems,
    });
}

export async function getItems({ id, limit, offset }: { id: string; limit: number; offset: number }) {
    const { limit: safeLimit, offset: safeOffset } = normalizePagination(limit, offset);

    const client = await getTidalClient();

    const res = await client.get<TidalPaginatedResponse<TidalPlaylistItem>>(
        TIDAL_ROUTES.PLAYLIST.ITEMS.replace('{uuid}', id),
        {
            params: {
                limit: safeLimit,
                offset: safeOffset,
            },
        }
    );

    const data = assertData(res.data, '[Tidal] Playlist items not found');

    return createPaginatedResponse({
        items: data.items,
        total: data.totalNumberOfItems,
        offset: safeOffset,
        limit: safeLimit,
        hasNext: safeOffset + data.items.length < data.totalNumberOfItems,
    });
}
