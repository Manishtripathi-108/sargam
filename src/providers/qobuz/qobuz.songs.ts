import type { QobuzTrack, QobuzTrackSearchResponse } from '../../types/qobuz';
import { assertData } from '../../utils/error.utils';
import { extractQobuzId } from '../../utils/url.utils';
import { getQobuzClient } from './qobuz.client';
import QOBUZ_ROUTES from './qobuz.routes';

export async function getById(id: string) {
    const client = getQobuzClient();

    const res = await client.get<QobuzTrack>(QOBUZ_ROUTES.TRACK.GET, {
        params: { track_id: id },
    });

    return assertData(res.data, 'Track not found');
}

export async function getByLink(link: string) {
    const id = extractQobuzId(link, 'track');

    return getById(id);
}

export async function getByIsrc(isrc: string) {
    const client = getQobuzClient();

    const res = await client.get<QobuzTrackSearchResponse>(QOBUZ_ROUTES.TRACK.SEARCH, {
        params: {
            query: isrc,
            limit: 10,
            offset: 0,
        },
    });

    const data = assertData(res.data, 'Search failed');

    // Find exact ISRC match
    const exactMatch = data.tracks.items.find((track) => track.isrc === isrc);

    if (exactMatch) {
        return exactMatch;
    }

    // Return first result if no exact match
    if (data.tracks.items.length > 0) {
        return data.tracks.items[0];
    }

    return null;
}

/**
 * Get track ISRC
 */
export async function getIsrc(id: string): Promise<string> {
    const track = await getById(id);
    return track.isrc;
}
