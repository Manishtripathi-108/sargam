import type { Provider } from '../validators/common.validators';
import { AppError } from './error.utils';

const HTTP_PROTOCOL_REGEX = /^http:\/\//;

/**
 * Replaces the HTTP protocol in a given URL with HTTPS.
 * @param url - The URL to upgrade to HTTPS.
 * @returns The URL with HTTPS protocol.
 * @example
 * upgradeToHttps("http://example.com") => "https://example.com"
 * upgradeToHttps("https://example.com") => "https://example.com"
 */
export const upgradeToHttps = (url: string): string => url.replace(HTTP_PROTOCOL_REGEX, 'https://');

/**
 * Checks if a given string is a link (starts with http:// or https://).
 * @param value - The string to check.
 * @returns True if the string is a link, false otherwise.
 * @example
 * isLink("http://example.com") => true
 * isLink("https://example.com") => true
 * isLink("example.com") => false
 */
export const isLink = (value: string): boolean => /^https?:\/\//i.test(value);

type MusicEntity = 'song' | 'album' | 'artist' | 'playlist';

const SAAVN_URL_PATTERNS: Record<MusicEntity, RegExp> = {
    song: /jiosaavn\.com\/song\/[^/]+\/([^/?#]+)/i,
    album: /jiosaavn\.com\/album\/[^/]+\/([^/?#]+)/i,
    artist: /jiosaavn\.com\/artist\/[^/]+\/([^/?#]+)/i,
    playlist: /jiosaavn\.com\/playlist\/([^/?#]+)/i,
};

const GAANA_URL_PATTERNS: Record<MusicEntity, RegExp> = {
    song: /gaana\.com\/song\/([a-zA-Z0-9-]+)/i,
    album: /gaana\.com\/album\/([a-zA-Z0-9-]+)/i,
    artist: /gaana\.com\/artist\/([a-zA-Z0-9-]+)/i,
    playlist: /gaana\.com\/playlist\/([a-zA-Z0-9-]+)/i,
};

const URL_PATTERNS_BY_PROVIDER: Record<Provider, Record<MusicEntity, RegExp>> = {
    saavn: SAAVN_URL_PATTERNS,
    gaana: GAANA_URL_PATTERNS,
};

/**
 * Extracts the SEO token from a music provider URL.
 * @param link - The URL to extract the token from.
 * @param provider - The music provider (saavn or gaana).
 * @param entity - The type of entity (song, album, artist, or playlist).
 * @returns The extracted SEO token.
 * @throws {AppError} If the link is empty or doesn't match the expected format.
 * @example
 * extractSeoToken("https://jiosaavn.com/song/track-name/abc123", "saavn", "song") => "abc123"
 */
export const extractSeoToken = (link: string, provider: Provider, entity: MusicEntity): string => {
    if (!link) {
        throw new AppError('Link is required', 400);
    }

    const token = link.match(URL_PATTERNS_BY_PROVIDER[provider][entity])?.[1];

    if (!token) {
        throw new AppError(`Link does not match ${provider} ${entity} format`, 400);
    }

    return token;
};

// Qobuz URL patterns
// Supports: https://www.qobuz.com/us-en/album/title/albumid, https://play.qobuz.com/track/123456
// Track IDs are numeric, Album IDs are alphanumeric
type QobuzEntity = 'track' | 'album' | 'artist' | 'playlist' | 'label';

const QOBUZ_URL_PATTERNS: Record<QobuzEntity, RegExp> = {
    track: /qobuz\.com\/(?:[a-z]{2}-[a-z]{2}\/)?track\/(\d+)/i,
    album: /qobuz\.com\/(?:[a-z]{2}-[a-z]{2}\/)?album\/[^/]+\/([a-z0-9]+)/i,
    artist: /qobuz\.com\/(?:[a-z]{2}-[a-z]{2}\/)?interpreter\/[^/]+\/(\d+)/i,
    playlist: /qobuz\.com\/(?:[a-z]{2}-[a-z]{2}\/)?playlist\/(\d+)/i,
    label: /qobuz\.com\/(?:[a-z]{2}-[a-z]{2}\/)?label\/[^/]+\/(\d+)/i,
};

// Alternative patterns for play.qobuz.com
const QOBUZ_PLAY_URL_PATTERNS: Record<QobuzEntity, RegExp> = {
    track: /play\.qobuz\.com\/track\/(\d+)/i,
    album: /play\.qobuz\.com\/album\/([a-z0-9]+)/i,
    artist: /play\.qobuz\.com\/artist\/(\d+)/i,
    playlist: /play\.qobuz\.com\/playlist\/(\d+)/i,
    label: /play\.qobuz\.com\/label\/(\d+)/i,
};

/**
 * Extracts the Qobuz ID from a Qobuz URL.
 * @param link - The Qobuz URL to extract the ID from.
 * @param entity - The type of entity (track, album, artist, or playlist).
 * @returns The extracted Qobuz ID.
 * @throws {AppError} If the link is empty or doesn't match the expected format.
 * @example
 * extractQobuzId("https://www.qobuz.com/us-en/track/123456", "track") => "123456"
 * extractQobuzId("https://play.qobuz.com/album/abc123xyz", "album") => "abc123xyz"
 */
export const extractQobuzId = (link: string, entity: QobuzEntity): string => {
    if (!link) {
        throw new AppError('Link is required', 400);
    }

    // Try main www.qobuz.com pattern first
    let id = link.match(QOBUZ_URL_PATTERNS[entity])?.[1];

    // Try play.qobuz.com pattern as fallback
    if (!id) {
        id = link.match(QOBUZ_PLAY_URL_PATTERNS[entity])?.[1];
    }

    if (!id) {
        throw new AppError(`Link does not match Qobuz ${entity} format`, 400);
    }

    return id;
};
