import type { Playlist } from '../../types/core/playlist.model';
import type { SaavnPlaylistAPIResponse } from '../../types/saavn/playlist.types';
import { AppError, assertData, notFound } from '../../utils/error.utils';
import { saavnClient } from './saavn.client';
import { mapPlaylist } from './saavn.mapper';
import SAAVN_ROUTES from './saavn.routes';
import { extractPlaylistToken } from './saavn.utils';

export async function getPlaylistById(id: string, page: number, limit: number): Promise<Playlist> {
    const res = await saavnClient.get<SaavnPlaylistAPIResponse>('/', {
        params: {
            listid: id,
            p: page,
            n: limit,
            __call: SAAVN_ROUTES.PLAYLIST.DETAILS,
        },
    });

    return mapPlaylist(assertData(res.data, 'Playlist not found'));
}

export async function getPlaylistByLink(link: string, page: number, limit: number): Promise<Playlist> {
    const token = extractPlaylistToken(link);

    const res = await saavnClient.get<SaavnPlaylistAPIResponse>('/', {
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
