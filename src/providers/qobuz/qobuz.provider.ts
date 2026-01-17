import * as QobuzAlbums from './qobuz.albums';
import * as QobuzArtists from './qobuz.artists';
import { resetQobuzClient, getCurrentAppId } from './qobuz.client';
import * as QobuzPlaylists from './qobuz.playlists';
import QOBUZ_ROUTES from './qobuz.routes';
import * as QobuzSearch from './qobuz.search';
import * as QobuzSongs from './qobuz.songs';

export const QobuzProvider = {
    songs: QobuzSongs,
    albums: QobuzAlbums,
    artists: QobuzArtists,
    playlists: QobuzPlaylists,
    search: QobuzSearch,

    // Utility functions
    resetClient: resetQobuzClient,
    getCurrentAppId,

    // Quality constants
    QUALITY: QOBUZ_ROUTES.QUALITY,
};

export default QobuzProvider;
