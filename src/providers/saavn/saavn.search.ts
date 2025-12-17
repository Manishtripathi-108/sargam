import { safeAwait } from '../../utils/safeAwait.utils';
import { saavnClient } from './saavn.client';
import { SaavnMapper } from './saavn.mapper';
import SAAVN_ROUTES from './saavn.routes';

export async function searchSongs(params) {
    const [err, res] = await safeAwait(
        saavnClient.get('/', {
            params: { q: params.query, p: params.page, n: params.limit, __call: SAAVN_ROUTES.SEARCH.SONGS },
        })
    );

    if (err || !res) throw new Error('Saavn song search failed');

    return {
        total: res.data.total,
        results: res.data.results.map(SaavnMapper.song),
    };
}
