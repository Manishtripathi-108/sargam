import type { QobuzArtistAlbum } from './album.response';
import type { QobuzArtistBase, QobuzArtistImage, QobuzPaginatedList } from './common.types';

/**
 * Full artist response
 */
export type QobuzArtist = QobuzArtistBase & {
    albums_as_primary_artist_count: number;
    albums_as_primary_composer_count: number;
    picture?: string;
    image?: QobuzArtistImage;
    similar_artist_ids: number[];
    information?: string;
    biography?: QobuzArtistBiography;
};

export type QobuzSearchArtist = QobuzArtistBase & {
    picture?: string;
    image: QobuzArtistImage;
};

type QobuzArtistBiography = {
    summary: string;
    content: string;
    source: string;
    language: string;
};
