import type { TidalPaginatedResponse, TidalTrack } from '../../types/tidal';
import { assertData } from '../../utils/error.utils';
import { extractTidalId } from '../../utils/url.utils';
import { getTidalClient } from './tidal.client';
import TIDAL_ROUTES from './tidal.routes';

export async function getById(id: string) {
    const client = await getTidalClient();

    const res = await client.get<TidalTrack>(`${TIDAL_ROUTES.TRACK.DETAILS}/${id}`);

    return assertData(res.data, '[Tidal] Track not found');
}

export async function getByIds(ids: string[]) {
    const tracks = await Promise.all(ids.map((id) => getById(id).catch(() => null)));

    return tracks.filter((track): track is TidalTrack => track !== null);
}

export async function getByLink(link: string) {
    const id = extractTidalId(link, 'track');

    return getById(id);
}

export async function getByIsrc(isrc: string) {
    const client = await getTidalClient();

    const res = await client.get<TidalPaginatedResponse<TidalTrack>>(TIDAL_ROUTES.SEARCH.TRACKS, {
        params: {
            query: isrc,
            limit: 10,
            offset: 0,
        },
    });

    const data = assertData(res.data, '[Tidal] Search failed');

    const exactMatch = data.items.find((track) => track.isrc === isrc);

    if (exactMatch) {
        return exactMatch;
    }

    if (data.items.length > 0) {
        return data.items[0];
    }

    return null;
}

export async function getIsrc(id: string): Promise<string> {
    const track = await getById(id);
    return track.isrc;
}
