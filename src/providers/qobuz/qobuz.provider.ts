import * as QobuzSongs from './qobuz.songs';
import * as QobuzAlbums from './qobuz.albums';
import * as QobuzArtists from './qobuz.artists';
import * as QobuzPlaylists from './qobuz.playlists';
import * as QobuzSearch from './qobuz.search';
import { isQobuzConfigured, resetQobuzClient, getCurrentAppId } from './qobuz.client';
import QOBUZ_ROUTES from './qobuz.routes';

export const QobuzProvider = {
    songs: QobuzSongs,
    albums: QobuzAlbums,
    artists: QobuzArtists,
    playlists: QobuzPlaylists,
    search: QobuzSearch,

    // Utility functions
    isConfigured: isQobuzConfigured,
    resetClient: resetQobuzClient,
    getCurrentAppId,

    // Quality constants
    QUALITY: QOBUZ_ROUTES.QUALITY,
};

export default QobuzProvider;
