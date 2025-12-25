import { AppError } from './error.utils';

type Provider = 'saavn' | 'gaana';
type Entity = 'song' | 'album' | 'artist' | 'playlist';

const SAAVN_PATTERNS: Record<Entity, RegExp> = {
    song: /jiosaavn\.com\/song\/[^/]+\/([^/?#]+)/i,
    album: /jiosaavn\.com\/album\/[^/]+\/([^/?#]+)/i,
    artist: /jiosaavn\.com\/artist\/[^/]+\/([^/?#]+)/i,
    playlist: /jiosaavn\.com\/playlist\/([^/?#]+)/i,
};

const GAANA_PATTERNS: Record<Entity, RegExp> = {
    song: /gaana\.com\/song\/([a-zA-Z0-9-]+)/i,
    album: /gaana\.com\/album\/([a-zA-Z0-9-]+)/i,
    artist: /gaana\.com\/artist\/([a-zA-Z0-9-]+)/i,
    playlist: /gaana\.com\/playlist\/([a-zA-Z0-9-]+)/i,
};

const PATTERNS: Record<Provider, Record<Entity, RegExp>> = {
    saavn: SAAVN_PATTERNS,
    gaana: GAANA_PATTERNS,
};

export const extractSeoToken = (link: string, provider: Provider, entity: Entity): string => {
    if (!link) {
        throw new AppError('Link is required', 400);
    }

    const token = link.match(PATTERNS[provider][entity])?.[1];

    if (!token) {
        throw new AppError(`Link does not match ${provider} ${entity} format`, 400);
    }

    return token;
};
