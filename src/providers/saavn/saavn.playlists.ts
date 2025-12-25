import type { Playlist } from '../../types/core/playlist.model';
import type { SaavnPlaylistResponse } from '../../types/saavn/playlist.types';
import { assertData } from '../../utils/error.utils';
import { normalizePagination } from '../../utils/main.utils';
import { saavnClient } from './saavn.client';
import { mapPlaylist } from './saavn.mapper';
import SAAVN_ROUTES from './saavn.routes';
import { extractSeoToken } from './saavn.utils';

export async function getPlaylistById({
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

export async function getPlaylistByLink({
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
