import type { GaanaSongResponse } from '../../types/gaana';
import { assertData } from '../../utils/error.utils';
import { extractSeoToken } from '../../utils/url.utils';
import { gaanaClient } from './gaana.client';
import GAANA_ROUTES from './gaana.routes';

export async function getByIds(seokey: string) {
    const res = await gaanaClient.post<GaanaSongResponse>('/', null, {
        params: {
            seokey,
            type: GAANA_ROUTES.SONG.DETAILS,
        },
    });

    return assertData(res.data, 'Song not found');
}

export async function getByLink(link: string) {
    const seokey = extractSeoToken(link, 'gaana', 'song');

    const res = await gaanaClient.post<GaanaSongResponse>('/', null, {
        params: {
            seokey,
            type: GAANA_ROUTES.SONG.DETAILS,
        },
    });

    return assertData(res.data, 'Song not found');
}

export async function getSuggestions(seokey: string, limit: number) {
    const res = await gaanaClient.post('/', null, {
        params: {
            seokey,
            limit,
            type: GAANA_ROUTES.SONG.SIMILAR,
        },
    });

    const data = assertData(res.data, 'No suggestions found');

    return data;
}

export async function getLyrics(seokey: string) {
    const res = await gaanaClient.post('/', null, {
        params: {
            seokey,
            type: GAANA_ROUTES.SONG.LYRICS,
        },
    });

    const data = assertData(res.data, 'Lyrics not found');
}
