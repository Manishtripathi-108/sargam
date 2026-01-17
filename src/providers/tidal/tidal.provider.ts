import * as TidalSongs from './tidal.songs';
import * as TidalAlbums from './tidal.albums';
import * as TidalArtists from './tidal.artists';
import * as TidalPlaylists from './tidal.playlists';
import * as TidalSearch from './tidal.search';
import { isTidalConfigured, resetTidalClient, getAlbumArtUrl, getCountryCode } from './tidal.client';

export const TidalProvider = {
    songs: TidalSongs,
    albums: TidalAlbums,
    artists: TidalArtists,
    playlists: TidalPlaylists,
    search: TidalSearch,

    // Utility functions
    isConfigured: isTidalConfigured,
    resetClient: resetTidalClient,
    getAlbumArtUrl,
    getCountryCode,
};

export default TidalProvider;
