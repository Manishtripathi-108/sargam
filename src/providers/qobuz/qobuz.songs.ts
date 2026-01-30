import type { QobuzFileUrlResponse, QobuzQuality, QobuzStreamResponse, QobuzTrack } from '../../types/qobuz';
import { assertData } from '../../utils/error.utils';
import { extractQobuzId } from '../../utils/url.utils';
import { qobuzClient } from './qobuz.client';
import QOBUZ_ROUTES from './qobuz.routes';
import axios from 'axios';
import crypto from 'crypto';

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
 * Generate the request signature for Qobuz file URL endpoint
 *
 * The signature is: MD5("trackgetFileUrlformat_id{quality}intentstreamtrack_id{track_id}{timestamp}{secret}")
 *
 * @param trackId - Track ID
 * @param formatId - Quality format ID
 * @param timestamp - Unix timestamp
 * @param secret - App secret (obtained from bundle.js)
 */
function generateRequestSignature(trackId: string, formatId: string, timestamp: number, secret: string): string {
    const rawSignature = `trackgetFileUrlformat_id${formatId}intentstreamtrack_id${trackId}${timestamp}${secret}`;
    return crypto.createHash('md5').update(rawSignature).digest('hex');
}

/**
 * Get stream URL directly from Qobuz API
 * Requires QOBUZ_APP_SECRET environment variable for full streams
 * Without authentication, returns 30-second preview
 *
 * @param trackId - Qobuz track ID
 * @param quality - Quality code (5=MP3, 6=FLAC 16-bit, 7=FLAC 24-bit 96kHz, 27=FLAC 24-bit 192kHz)
 * @returns File URL response with stream details
 */
export async function getFileUrl(trackId: string, quality: QobuzQuality = '6'): Promise<QobuzFileUrlResponse> {
    const appSecret = process.env.QOBUZ_APP_SECRET;

    if (!appSecret) {
        throw new Error('QOBUZ_APP_SECRET environment variable is required for native stream URLs');
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const requestSig = generateRequestSignature(trackId, quality, timestamp, appSecret);

    const res = await qobuzClient.get<QobuzFileUrlResponse>(QOBUZ_ROUTES.TRACK.FILE_URL, {
        params: {
            track_id: trackId,
            format_id: quality,
            intent: 'stream',
            request_ts: timestamp,
            request_sig: requestSig,
        },
    });

    return assertData(res.data, 'Failed to get file URL');
}

/**
 * Get preview URL from Qobuz (30 seconds, no auth required)
 * Useful for sampling tracks without authentication
 *
 * @param trackId - Qobuz track ID
 * @param quality - Quality code (5=MP3, 6=FLAC 16-bit, 7=FLAC 24-bit)
 * @returns Preview URL and metadata
 */
export async function getPreviewUrl(
    trackId: string,
    quality: QobuzQuality = '6'
): Promise<{
    url: string;
    duration: number;
    mimeType: string;
    samplingRate: number;
    bitDepth: number;
    isPreview: boolean;
}> {
    // For preview, we don't need the secret - just use a dummy one
    // The API will return preview data regardless
    const timestamp = Math.floor(Date.now() / 1000);
    const dummySecret = 'preview'; // API returns preview without valid secret
    const requestSig = generateRequestSignature(trackId, quality, timestamp, dummySecret);

    const res = await qobuzClient.get<QobuzFileUrlResponse>(QOBUZ_ROUTES.TRACK.FILE_URL, {
        params: {
            track_id: trackId,
            format_id: quality,
            intent: 'stream',
            request_ts: timestamp,
            request_sig: requestSig,
        },
    });

    const data = assertData(res.data, 'Failed to get preview URL');

    return {
        url: data.url,
        duration: data.duration,
        mimeType: data.mime_type,
        samplingRate: data.sampling_rate,
        bitDepth: data.bits_depth,
        isPreview: data.file_type === 'preview' || data.duration <= 30,
    };
}

/**
 * Get stream/download URL for a Qobuz track
 * Tries native Qobuz API first (if secret configured), then falls back to external APIs
 *
 * @param trackId - Qobuz track ID
 * @param quality - Quality code (5=MP3, 6=FLAC 16-bit, 7=FLAC 24-bit 96kHz, 27=FLAC 24-bit 192kHz)
 * @returns Stream URL object with the download URL
 */
export async function getStreamUrl(
    trackId: string,
    quality: QobuzQuality = '6'
): Promise<{ url: string; source: string; isPreview?: boolean }> {
    const errors: string[] = [];

    // Try native Qobuz API first if secret is configured
    const appSecret = process.env.QOBUZ_APP_SECRET;
    if (appSecret) {
        try {
            const fileUrl = await getFileUrl(trackId, quality);
            const isPreview = fileUrl.file_type === 'preview' || fileUrl.duration <= 30;

            // Check for restrictions that indicate we can't get full stream
            if (fileUrl.restrictions?.length && isPreview) {
                const restrictionCodes = fileUrl.restrictions.map((r) => r.code).join(', ');
                errors.push(`qobuz_native: Preview only (${restrictionCodes})`);
            } else {
                return { url: fileUrl.url, source: 'qobuz_native', isPreview };
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            errors.push(`qobuz_native: ${message}`);
        }
    }

    // Fallback to external APIs
    const apis = [
        { url: QOBUZ_ROUTES.STREAM.PRIMARY, name: 'primary', paramKey: 'trackId' },
        { url: QOBUZ_ROUTES.STREAM.FALLBACK_1, name: 'fallback_1', paramKey: 'trackId' },
        { url: QOBUZ_ROUTES.STREAM.FALLBACK_2, name: 'fallback_2', paramKey: 'track_id' },
    ];

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
