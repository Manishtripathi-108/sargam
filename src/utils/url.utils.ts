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
