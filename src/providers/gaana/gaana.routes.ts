const GAANA_ROUTES = {
    BASE: 'https://gaana.com/apiv2',
    BASE_V2: 'https://apiv2.gaana.com',

    TRENDING: {
        SONGS: 'miscTrendingSongs',
    },

    SEARCH: {
        ALL: 'search',
        SONGS: 'search',
        ALBUMS: 'search',
        ARTISTS: 'search',
        PLAYLISTS: 'search',
    },

    SONG: {
        DETAILS: 'songDetail',
        LYRICS: 'songLyrics',
        SIMILAR: 'songSimilar',
        /**
         * @description This endpoint is used to get the stream URL for a song.
         * @param track_id - The unique identifier for the track.
         * @param quality - The quality of the stream. Possible values are 'low', 'medium', 'high'.
         * @example
         * POST https://gaana.com/api/stream-url?track_id=57285949&quality=high
         */
        STREAM: 'https://gaana.com/api/stream-url',
    },

    ALBUM: {
        DETAILS: 'albumDetail',
    },

    ARTIST: {
        DETAILS: 'artistDetail',
        TRACKS: 'artistTrackList',
        ALBUMS: 'artistAlbumList',
        PLAYLISTS: 'artistPlaylist',
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
