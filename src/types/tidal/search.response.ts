import type { TidalAlbum, TidalArtist, TidalPaginatedResponse, TidalPlaylist, TidalTrack } from './common.types';

/* -------------------------------------------------------------------------- */
/*                            SEARCH RESPONSE TYPES                           */
/* -------------------------------------------------------------------------- */

export type TidalSearchAllResponse = {
    artists?: TidalPaginatedResponse<TidalArtist>;
    albums?: TidalPaginatedResponse<TidalAlbum>;
    tracks?: TidalPaginatedResponse<TidalTrack>;
    playlists?: TidalPaginatedResponse<TidalPlaylist>;
    topHit?: {
        type: string;
        value: TidalArtist | TidalAlbum | TidalTrack | TidalPlaylist;
    };
};
