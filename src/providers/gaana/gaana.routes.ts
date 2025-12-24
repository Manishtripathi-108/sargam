const GAANA_ROUTES = {
    BASE: 'https://gaana.com/apiv2',
    BASE_V2: 'https://apiv2.gaana.com',

    TRENDING: {
        SONGS: 'miscTrendingSongs',
    },

    SEARCH: {
        SONGS: 'search',
        ALBUMS: 'search',
        ARTISTS: 'search',
        PLAYLISTS: 'search',
    },

    SONG: {
        DETAILS: 'songDetail',
    },

    ALBUM: {
        DETAILS: 'albumDetail',
    },

    ARTIST: {
        DETAILS: 'artistDetail',
        TOP_TRACKS: 'artistTrackList',
        SIMILAR: '/player/similar-artists',
    },

    PLAYLIST: {
        DETAILS: 'playlistDetail',
        CHARTS: '/home/playlist/top-charts',
    },

    BROWSE: {
        NEW_RELEASES: 'miscNewRelease',
    },
} as const;

export default GAANA_ROUTES;
