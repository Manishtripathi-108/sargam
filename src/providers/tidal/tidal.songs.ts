import { assertData } from '../../utils/error.utils';
import { extractTidalId } from '../../utils/url.utils';
import { getTidalClient } from './tidal.client';
import TIDAL_ROUTES from './tidal.routes';

interface TidalArtist {
    id: number;
    name: string;
    artistTypes?: string[];
    picture?: string;
}

interface TidalAlbum {
    id: number;
    title: string;
    cover: string;
    releaseDate: string;
}

interface TidalTrack {
    id: number;
    title: string;
    duration: number;
    trackNumber: number;
    volumeNumber: number;
    isrc: string;
    explicit: boolean;
    audioQuality: string;
    copyright?: string;
    album: TidalAlbum;
    artist: TidalArtist;
    artists: TidalArtist[];
    mediaMetadata?: {
        tags: string[];
    };
}

export async function getById(id: string) {
    const client = await getTidalClient();

    const res = await client.get<TidalTrack>(`${TIDAL_ROUTES.TRACK.DETAILS}/${id}`);

    return assertData(res.data, 'Track not found');
}

export async function getByIds(ids: string[]) {
    // Tidal doesn't have a bulk endpoint, fetch in parallel
    const tracks = await Promise.all(ids.map((id) => getById(id).catch(() => null)));

    return tracks.filter((track): track is TidalTrack => track !== null);
}

export async function getByLink(link: string) {
    const id = extractTidalId(link, 'track');

    return getById(id);
}

/**
 * Search for track by ISRC
 * Uses search endpoint with ISRC as query
 */
export async function getByIsrc(isrc: string) {
    const client = await getTidalClient();

    const res = await client.get<{
        items: TidalTrack[];
        limit: number;
        offset: number;
        totalNumberOfItems: number;
    }>(TIDAL_ROUTES.SEARCH.TRACKS, {
        params: {
            query: isrc,
            limit: 10,
            offset: 0,
        },
    });

    const data = assertData(res.data, 'Search failed');

    // Find exact ISRC match
    const exactMatch = data.items.find((track) => track.isrc === isrc);

    if (exactMatch) {
        return exactMatch;
    }

    // Return first result if no exact match
    if (data.items.length > 0) {
        return data.items[0];
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
