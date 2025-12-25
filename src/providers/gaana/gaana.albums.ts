import type { GaanaAlbumResponse } from '../../types/gaana';
import { assertData } from '../../utils/error.utils';
import { extractSeoToken } from '../../utils/one.utils';
import { gaanaClient } from './gaana.client';
import GAANA_ROUTES from './gaana.routes';

export async function getById(id: string) {
    const res = await gaanaClient.post<GaanaAlbumResponse>('/', null, {
        params: {
            type: GAANA_ROUTES.ALBUM.DETAILS,
            seokey: id,
        },
    });

    return assertData(res.data, 'Album not found');
}

export async function getByLink(link: string) {
    const token = extractSeoToken(link, 'gaana', 'album');

    const res = await gaanaClient.post<GaanaAlbumResponse>('/', null, {
        params: {
            type: GAANA_ROUTES.ALBUM.DETAILS,
            seokey: token,
        },
    });

    return assertData(res.data, 'Album not found');
}
