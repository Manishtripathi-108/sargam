import type { GaanaAlbumResponse, GaanaSearchItem, GaanaSearchResponse, GaanaSongResponse } from '../../types/gaana';
import { assertData, notFound } from '../../utils/error.utils';
import { normalizePagination } from '../../utils/main.utils';
import { gaanaClient } from './gaana.client';
import GAANA_ROUTES from './gaana.routes';
import type { AxiosResponse } from 'axios';

type SearchParams = {
    query: string;
    limit: number;
    offset: number;
};

/* -------------------------------------------------------------------------- */
/*                                   helpers                                  */
/* -------------------------------------------------------------------------- */

const extractSeoKeys = (data: GaanaSearchResponse, limit: number): string[] => {
    const groups = data?.gr;
    if (!Array.isArray(groups) || !groups[0]?.gd) return [];

    return groups[0].gd
        .slice(0, limit)
        .map((i: GaanaSearchItem) => i?.seo)
        .filter((seo): seo is string => Boolean(seo));
};

/* -------------------------------------------------------------------------- */
/*                                   service                                  */
/* -------------------------------------------------------------------------- */

export async function songs(p: SearchParams) {
    const { page, limit } = normalizePagination(p.limit, p.offset);

    const res = await gaanaClient.post<GaanaSearchResponse>('/', null, {
        params: {
            type: GAANA_ROUTES.SEARCH.SONGS,
            secType: 'track',
            keyword: p.query,
            page: page - 1,
        },
    });

    const data = assertData(res.data, 'No songs found', (): boolean => {
        const groups = res.data?.gr;
        return !Array.isArray(groups) || !groups[0]?.gd;
    });

    return data.gr[0].gd.slice(0, limit);

    // const data = assertData(res.data, 'No songs found');

    // const seoKeys = extractSeoKeys(data, limit);
    // if (!seoKeys.length) {
    //     throw notFound('No songs found');
    // }

    // const requests = seoKeys.map((seokey) =>
    //     gaanaClient.post<GaanaSongResponse>('/', null, {
    //         params: {
    //             type: GAANA_ROUTES.SONG.DETAILS,
    //             seokey,
    //         },
    //     })
    // );

    // const results = await Promise.allSettled(requests);

    // return results
    //     .filter((r): r is PromiseFulfilledResult<AxiosResponse<GaanaSongResponse>> => r.status === 'fulfilled')
    //     .map((r) => r.value.data)
    //     .filter(Boolean);
}

export async function albums(p: SearchParams) {
    const { page, limit } = normalizePagination(p.limit, p.offset);

    const res = await gaanaClient.post<GaanaSearchResponse>('/', null, {
        params: {
            type: GAANA_ROUTES.SEARCH.ALBUMS,
            secType: 'album',
            keyword: p.query,
            page: page - 1,
        },
    });

    const data = assertData(res.data, 'No albums found', (): boolean => {
        const groups = res.data?.gr;
        return !Array.isArray(groups) || !groups[0]?.gd;
    });

    return data.gr[0].gd.slice(0, limit);

    // const data = assertData(res.data, 'No albums found');

    // const seoKeys = extractSeoKeys(data, limit);
    // if (!seoKeys.length) {
    //     throw notFound('No albums found');
    // }

    // const requests = seoKeys.map((seokey) =>
    //     gaanaClient.post<GaanaAlbumResponse>('/', null, {
    //         params: {
    //             type: GAANA_ROUTES.ALBUM.DETAILS,
    //             seokey,
    //         },
    //     })
    // );

    // const results = await Promise.allSettled(requests);

    // return results
    //     .filter((r): r is PromiseFulfilledResult<AxiosResponse<GaanaAlbumResponse>> => r.status === 'fulfilled')
    //     .map((r) => r.value.data)
    //     .filter(Boolean);
}

export async function artists(p: SearchParams) {
    const { page, limit } = normalizePagination(p.limit, p.offset);

    const res = await gaanaClient.post<GaanaSearchResponse>('/', null, {
        params: {
            type: GAANA_ROUTES.SEARCH.ARTISTS,
            secType: 'artist',
            keyword: p.query,
            page: page - 1,
        },
    });

    const data = assertData(res.data, 'No artists found', (): boolean => {
        const groups = res.data?.gr;
        return !Array.isArray(groups) || !groups[0]?.gd;
    });

    return data.gr[0].gd.slice(0, limit);
}

export async function playlists(p: SearchParams) {
    const { page, limit } = normalizePagination(p.limit, p.offset);

    const res = await gaanaClient.post<GaanaSearchResponse>('/', null, {
        params: {
            type: GAANA_ROUTES.SEARCH.PLAYLISTS,
            secType: 'playlist',
            keyword: p.query,
            page: page - 1,
        },
    });

    const data = assertData(res.data, 'No playlists found', (): boolean => {
        const groups = res.data?.gr;
        return !Array.isArray(groups) || !groups[0]?.gd;
    });

    return data.gr[0].gd.slice(0, limit);
}
