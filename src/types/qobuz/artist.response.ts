/**
 * Qobuz Artist Response Types
 */
import type { QobuzArtistAlbum } from './album.response';
import type { QobuzArtistBase, QobuzArtistImage, QobuzBiography, QobuzPaginatedList } from './common.types';

/**
 * Full artist response
 */
export type QobuzArtist = QobuzArtistBase & {
    picture?: string;
    image?: QobuzArtistImage;
    biography?: QobuzBiography;
    albums?: QobuzPaginatedList<QobuzArtistAlbum>;
};

export type QobuzSearchArtist = QobuzArtistBase & {
    picture?: string;
    image: QobuzArtistImage;
};
