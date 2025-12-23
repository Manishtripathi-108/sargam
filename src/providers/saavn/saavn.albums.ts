import type { Album } from '../../types/core/album.model';
import type { SaavnAlbumAPIResponse } from '../../types/saavn/albums.types';
import { assertData } from '../../utils/error.utils';
import { saavnClient } from './saavn.client';
import { mapAlbum } from './saavn.mapper';
import SAAVN_ROUTES from './saavn.routes';
import { extractAlbumToken } from './saavn.utils';

export async function getById(id: string): Promise<Album> {
    const res = await saavnClient.get<SaavnAlbumAPIResponse>('/', {
        params: {
            albumid: id,
            __call: SAAVN_ROUTES.ALBUM.DETAILS,
        },
    });

    return mapAlbum(assertData(res.data, 'Album not found'));
}

export async function getByLink(link: string): Promise<Album> {
    const token = extractAlbumToken(link);

    const res = await saavnClient.get<SaavnAlbumAPIResponse>('/', {
        params: {
            token,
            type: 'album',
            __call: SAAVN_ROUTES.ALBUM.LINK,
        },
    });

    return mapAlbum(assertData(res.data, 'Album not found'));
}
