import type { QobuzQuality, QobuzStreamResponse, QobuzTrack } from '../../types/qobuz';
import { assertData } from '../../utils/error.utils';
import { extractQobuzId } from '../../utils/url.utils';
import { qobuzClient } from './qobuz.client';
import QOBUZ_ROUTES from './qobuz.routes';
import axios from 'axios';

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

/**
 * Get stream/download URL for a Qobuz track
 * Tries multiple external APIs with fallback support
 *
 * @param trackId - Qobuz track ID
 * @param quality - Quality code (5=MP3, 6=FLAC 16-bit, 7=FLAC 24-bit 96kHz, 27=FLAC 24-bit 192kHz)
 * @returns Stream URL object with the download URL
 */
export async function getStreamUrl(
    trackId: string,
    quality: QobuzQuality = '6'
): Promise<{ url: string; source: string }> {
    const apis = [
        { url: QOBUZ_ROUTES.STREAM.PRIMARY, name: 'primary', paramKey: 'trackId' },
        { url: QOBUZ_ROUTES.STREAM.FALLBACK_1, name: 'fallback_1', paramKey: 'trackId' },
        { url: QOBUZ_ROUTES.STREAM.FALLBACK_2, name: 'fallback_2', paramKey: 'track_id' },
    ];

    const errors: string[] = [];

    for (const api of apis) {
        try {
            const params = api.paramKey === 'track_id' ? { track_id: trackId, quality } : { trackId, quality };

            const res = await axios.get<QobuzStreamResponse>(api.url, {
                params,
                timeout: 30000,
            });

            if (res.data?.url) {
                return { url: res.data.url, source: api.name };
            }

            errors.push(`${api.name}: Empty URL in response`);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            errors.push(`${api.name}: ${message}`);
        }
    }

    throw new Error(`Failed to get stream URL from all APIs. Errors: ${errors.join('; ')}`);
}
