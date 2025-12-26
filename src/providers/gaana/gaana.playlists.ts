import { assertData } from '../../utils/error.utils';
import { normalizePagination } from '../../utils/pagination.utils';
import { extractSeoToken } from '../../utils/url.utils';
import { gaanaClient } from './gaana.client';
import GAANA_ROUTES from './gaana.routes';

export async function getById(id: string) {
    // const { page } = normalizePagination(limit, offset);

    const res = await gaanaClient.post('/', null, {
        params: {
            seokey: id,
            page: 0,
            limit: 10,
            type: GAANA_ROUTES.PLAYLIST.DETAILS,
        },
    });

    return assertData(res.data, 'Playlist not found');
}

export async function getByLink(link: string) {
    const seokey = extractSeoToken(link, 'gaana', 'playlist');
    // const { page } = normalizePagination(limit, offset);

    const res = await gaanaClient.post('/', null, {
        params: {
            seokey,
            page: 0,
            limit: 10,
            type: GAANA_ROUTES.PLAYLIST.DETAILS,
        },
    });

    return assertData(res.data, 'Playlist not found');
}
