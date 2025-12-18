import { Album } from '../../types/core/album.model';
import type { SaavnAlbumAPIResponse } from '../../types/saavn/albums.types';
import { AppError, notFound } from '../../utils/error.utils';
import { saavnClient } from './saavn.client';
import { mapAlbum } from './saavn.mapper';
import SAAVN_ROUTES from './saavn.routes';

const extractAlbumToken = (link: string) => {
    const token = link.match(/jiosaavn\.com\/album\/[^/]+\/([^/]+)$/)?.[1];
    if (!token) throw new AppError('Invalid album link', 400);
    return token;
};

export async function getAlbumById(id: string): Promise<Album> {
    const res = await saavnClient.get<SaavnAlbumAPIResponse>('/', {
        params: {
            albumid: id,
            __call: SAAVN_ROUTES.ALBUM.DETAILS,
        },
    });

    if (!res.data) {
        throw notFound('Album not found');
    }

    return mapAlbum(res.data);
}

export async function getAlbumByLink(link: string): Promise<Album> {
    const token = extractAlbumToken(link);

    const res = await saavnClient.get<SaavnAlbumAPIResponse>('/', {
        params: {
            token,
            type: 'album',
            __call: SAAVN_ROUTES.ALBUM.LINK,
        },
    });

    if (!res.data) {
        throw notFound('Album not found');
    }

    return mapAlbum(res.data);
}
