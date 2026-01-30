import type { QobuzTrack } from '../../types/qobuz';
import { assertData } from '../../utils/error.utils';
import { extractQobuzId } from '../../utils/url.utils';
import { qobuzClient } from './qobuz.client';
import QOBUZ_ROUTES from './qobuz.routes';

export async function getById(track_id: string) {
    const res = await qobuzClient.get<QobuzTrack>(QOBUZ_ROUTES.TRACK.GET, {
        params: { track_id },
    });

    return assertData(res.data, 'Track not found');
}

export async function getByLink(link: string) {
    const id = extractQobuzId(link, 'track');

    return getById(id);
}
