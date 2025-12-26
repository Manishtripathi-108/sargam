import type { Playlist } from '../../types/core/playlist.model';
import type { SaavnPlaylistResponse } from '../../types/saavn/playlist.types';
import { assertData } from '../../utils/error.utils';
import { normalizePagination } from '../../utils/pagination.utils';
import { extractSeoToken } from '../../utils/url.utils';
import { saavnClient } from './saavn.client';
import { mapPlaylist } from './saavn.mapper';
import SAAVN_ROUTES from './saavn.routes';

export async function getById({
    id,
    limit,
    offset,
}: {
    id: string;
    limit: number;
    offset: number;
}): Promise<Playlist> {
    const { page } = normalizePagination(limit, offset);

    const res = await saavnClient.get<SaavnPlaylistResponse>('/', {
        params: {
            listid: id,
            p: page,
            n: limit,
            __call: SAAVN_ROUTES.PLAYLIST.DETAILS,
        },
    });

    return mapPlaylist(assertData(res.data, 'Playlist not found'));
}

export async function getByLink({
    link,
    offset,
    limit,
}: {
    link: string;
    offset: number;
    limit: number;
}): Promise<Playlist> {
    const token = extractSeoToken(link, 'saavn', 'playlist');
    const { page } = normalizePagination(limit, offset);

    const res = await saavnClient.get<SaavnPlaylistResponse>('/', {
        params: {
            token,
            type: 'playlist',
            p: page,
            n: limit,
            __call: SAAVN_ROUTES.PLAYLIST.LINK,
        },
    });

    return mapPlaylist(assertData(res.data, 'Playlist not found'));
}
