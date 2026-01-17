/**
 * Qobuz Search Response Types
 */
import type { QobuzSearchAlbum } from './album.response';
import type { QobuzSearchArtist } from './artist.response';
import type { QobuzPaginatedList } from './common.types';
import type { QobuzSearchPlaylist } from './playlist.response';
import type { QobuzSearchTrack } from './song.response';

/**
 * Catalog search response (multi-type search)
 */
export type QobuzCatalogSearchResponse = {
    query: string;
    albums?: QobuzPaginatedList<QobuzSearchAlbum>;
    artists?: QobuzPaginatedList<QobuzSearchArtist>;
    tracks?: QobuzPaginatedList<QobuzSearchTrack>;
    playlists?: QobuzPaginatedList<QobuzSearchPlaylist>;
};
