import type { Song } from '../../types/core/song.model';
import type { SaavnLyrics } from '../../types/saavn/global.types';
import type { SaavnSongAPIResponse, SaavnSongSuggestionAPIResponse } from '../../types/saavn/song.types';
import { AppError, notFound } from '../../utils/error.utils';
import { saavnClient } from './saavn.client';
import { mapSong } from './saavn.mapper';
import SAAVN_ROUTES from './saavn.routes';

/* -------------------------------------------------------------------------- */
/*                                   helpers                                  */
/* -------------------------------------------------------------------------- */

const extractSongToken = (link: string): string => {
    const token = link.match(/jiosaavn\.com\/song\/[^/]+\/([^/]+)$/)?.[1];
    if (!token) {
        throw new AppError('Invalid song link', 400);
    }
    return token;
};

/* -------------------------------------------------------------------------- */
/*                                   service                                  */
/* -------------------------------------------------------------------------- */

export async function getByIds(ids: string): Promise<Song[]> {
    const res = await saavnClient.get<{ songs: SaavnSongAPIResponse[] }>('/', {
        params: {
            pids: ids,
            __call: SAAVN_ROUTES.SONG.ID,
        },
    });

    const songs = res.data?.songs;
    if (!songs?.length) {
        throw notFound('Song not found');
    }

    return songs.map(mapSong);
}

export async function getByLink(link: string): Promise<Song> {
    const token = extractSongToken(link);

    const res = await saavnClient.get<{ songs: SaavnSongAPIResponse[] }>('/', {
        params: {
            token,
            type: 'song',
            __call: SAAVN_ROUTES.SONG.LINK,
        },
    });

    const songs = res.data?.songs;
    if (!songs?.length) {
        throw notFound('Song not found');
    }

    return mapSong(songs[0]);
}

export async function getStation(songId: string): Promise<string> {
    const encoded = JSON.stringify([encodeURIComponent(songId)]);

    const res = await saavnClient.get<{ stationid: string }>(SAAVN_ROUTES.SONG.STATION, {
        params: {
            entity_id: encoded,
            entity_type: 'queue',
            ctx: 'android',
        },
    });

    const stationId = res.data?.stationid;
    if (!stationId) {
        throw new AppError('Failed to create song station', 502);
    }

    return stationId;
}

export async function getSuggestions(id: string, limit: number): Promise<Song[]> {
    const stationId = await getStation(id);

    const res = await saavnClient.get<SaavnSongSuggestionAPIResponse>(SAAVN_ROUTES.SONG.SUGGESTIONS, {
        params: {
            stationid: stationId,
            k: limit,
            ctx: 'android',
        },
    });

    if (!res.data) {
        throw new AppError('Failed to fetch song suggestions', 502);
    }

    return Object.values(res.data)
        .map((entry) => {
            if (typeof entry === 'object' && entry.song) {
                return mapSong(entry.song);
            }
            return null;
        })
        .filter((s) => s !== null)
        .slice(0, limit);
}

export async function getLyrics(songId: string): Promise<string> {
    const res = await saavnClient.get<SaavnLyrics>(SAAVN_ROUTES.SONG.LYRICS, {
        params: {
            id: songId,
            __call: SAAVN_ROUTES.SONG.LYRICS,
        },
    });

    if (!res.data?.lyrics) {
        throw notFound('Lyrics not found');
    }

    return res.data.lyrics;
}
