import { AppError } from '../../utils/error.utils';

type SaavnEntity = 'song' | 'album' | 'artist' | 'playlist';

const TOKEN_PATTERNS: Record<SaavnEntity, RegExp> = {
    song: /jiosaavn\.com\/song\/[^/]+\/([^/]+)$/,
    album: /jiosaavn\.com\/album\/[^/]+\/([^/]+)$/,
    artist: /jiosaavn\.com\/artist\/[^/]+\/([^/]+)$/,
    playlist: /jiosaavn\.com\/playlist\/([^/]+)$/,
};

export const extractSaavnToken = (entity: SaavnEntity, link: string): string => {
    const rx = TOKEN_PATTERNS[entity];
    const token = link.match(rx)?.[1];
    if (!token) {
        throw new AppError(`Invalid ${entity} link`, 400);
    }
    return token;
};

export const extractSongToken = (link: string) => extractSaavnToken('song', link);
export const extractAlbumToken = (link: string) => extractSaavnToken('album', link);
export const extractArtistToken = (link: string) => extractSaavnToken('artist', link);
export const extractPlaylistToken = (link: string) => extractSaavnToken('playlist', link);
