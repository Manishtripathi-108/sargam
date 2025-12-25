import type { Album } from '../../types/core/album.model';
import type { SaavnAlbumResponse } from '../../types/saavn/albums.types';
import { assertData } from '../../utils/error.utils';
import { saavnClient } from './saavn.client';
import { mapAlbum } from './saavn.mapper';
import SAAVN_ROUTES from './saavn.routes';
import { extractSeoToken } from './saavn.utils';

export async function getById(id: string): Promise<Album> {
    const res = await saavnClient.get<SaavnAlbumResponse>('/', {
        params: {
            albumid: id,
            __call: SAAVN_ROUTES.ALBUM.DETAILS,
        },
    });

    return mapAlbum(assertData(res.data, 'Album not found'));
}

export async function getByLink(link: string): Promise<Album> {
    const token = extractSeoToken(link, 'saavn', 'album');

    const res = await saavnClient.get<SaavnAlbumResponse>('/', {
        params: {
            token,
            type: 'album',
            __call: SAAVN_ROUTES.ALBUM.LINK,
        },
    });

    return mapAlbum(assertData(res.data, 'Album not found'));
}
