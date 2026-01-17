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

// Tidal URL patterns
// Supports: https://listen.tidal.com/track/123456, https://tidal.com/browse/track/123456
// Playlists use UUIDs: https://listen.tidal.com/playlist/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
type TidalEntity = 'track' | 'album' | 'artist' | 'playlist';

const TIDAL_URL_PATTERNS: Record<TidalEntity, RegExp> = {
    track: /tidal\.com\/(?:browse\/)?track\/(\d+)/i,
    album: /tidal\.com\/(?:browse\/)?album\/(\d+)/i,
    artist: /tidal\.com\/(?:browse\/)?artist\/(\d+)/i,
    // Playlist UUIDs: 8-4-4-4-12 format
    playlist: /tidal\.com\/(?:browse\/)?playlist\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i,
};

/**
 * Extracts the Tidal ID from a Tidal URL.
 * @param link - The Tidal URL to extract the ID from.
 * @param entity - The type of entity (track, album, artist, or playlist).
 * @returns The extracted Tidal ID (numeric for tracks/albums/artists, UUID for playlists).
 * @throws {AppError} If the link is empty or doesn't match the expected format.
 * @example
 * extractTidalId("https://listen.tidal.com/track/123456", "track") => "123456"
 * extractTidalId("https://tidal.com/browse/album/789", "album") => "789"
 */
export const extractTidalId = (link: string, entity: TidalEntity): string => {
    if (!link) {
        throw new AppError('Link is required', 400);
    }

    const id = link.match(TIDAL_URL_PATTERNS[entity])?.[1];

    if (!id) {
        throw new AppError(`Link does not match Tidal ${entity} format`, 400);
    }

    return id;
};
