import type { Playlist } from '../../types/core/playlist.model';
import { SaavnPlaylistAPIResponse } from '../../types/saavn/playlist.types';
import { AppError } from '../../utils/error.utils';
import { saavnClient } from './saavn.client';
import { mapPlaylist } from './saavn.mapper';
import SAAVN_ROUTES from './saavn.routes';

const extractPlaylistToken = (link: string) => {
    const token = link.match(/jiosaavn\.com\/playlist\/([^/]+)$/)?.[1];
    if (!token) throw new AppError('Invalid playlist link', 400);
    return token;
};

export async function getPlaylistById(id: string, page: number, limit: number): Promise<Playlist> {
    const res = await saavnClient.get<SaavnPlaylistAPIResponse>('/', {
        params: {
            listid: id,
            p: page,
            n: limit,
            __call: SAAVN_ROUTES.PLAYLIST.DETAILS,
        },
    });

    if (!res.data) {
        throw new AppError('Playlist not found', 404);
    }

    return mapPlaylist(res.data);
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

    if (!res.data) {
        throw new AppError('Playlist not found', 404);
    }

    return mapPlaylist(res.data);
}
