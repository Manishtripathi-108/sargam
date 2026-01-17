/**
 * Tidal API Routes
 *
 * Tidal uses OAuth2 Client Credentials for API access.
 * Configure via environment variables:
 * - TIDAL_CLIENT_ID: OAuth client ID
 * - TIDAL_CLIENT_SECRET: OAuth client secret
 */

const TIDAL_ROUTES = {
    /**
     * OAuth2 token endpoint
     * POST /v1/oauth2/token
     */
    AUTH: 'https://auth.tidal.com/v1/oauth2/token',

    /**
     * API base URL
     */
    BASE: 'https://api.tidal.com/v1',

    /**
     * Track endpoints
     */
    TRACK: {
        /** GET /tracks/{id}?countryCode={code} */
        DETAILS: '/tracks',
        /** GET /tracks/{id}/playbackinfo?... (requires premium) */
        PLAYBACK_INFO: '/tracks/{id}/playbackinfo',
    },

    /**
     * Album endpoints
     */
    ALBUM: {
        /** GET /albums/{id}?countryCode={code} */
        DETAILS: '/albums',
        /** GET /albums/{id}/tracks?countryCode={code}&limit={n}&offset={o} */
        TRACKS: '/albums/{id}/tracks',
        /** GET /albums/{id}/items?countryCode={code}&limit={n}&offset={o} */
        ITEMS: '/albums/{id}/items',
    },

    /**
     * Artist endpoints
     */
    ARTIST: {
        /** GET /artists/{id}?countryCode={code} */
        DETAILS: '/artists',
        /** GET /artists/{id}/toptracks?countryCode={code}&limit={n}&offset={o} */
        TOP_TRACKS: '/artists/{id}/toptracks',
        /** GET /artists/{id}/albums?countryCode={code}&limit={n}&offset={o} */
        ALBUMS: '/artists/{id}/albums',
        /** GET /artists/{id}/similar?countryCode={code}&limit={n}&offset={o} */
        SIMILAR: '/artists/{id}/similar',
    },

    /**
     * Playlist endpoints
     */
    PLAYLIST: {
        /** GET /playlists/{uuid}?countryCode={code} */
        DETAILS: '/playlists',
        /** GET /playlists/{uuid}/tracks?countryCode={code}&limit={n}&offset={o} */
        TRACKS: '/playlists/{uuid}/tracks',
        /** GET /playlists/{uuid}/items?countryCode={code}&limit={n}&offset={o} */
        ITEMS: '/playlists/{uuid}/items',
    },

    /**
     * Search endpoints
     */
    SEARCH: {
        /** GET /search?query={q}&type={type}&countryCode={code}&limit={n}&offset={o} */
        BASE: '/search',
        /** GET /search/tracks?query={q}&countryCode={code}&limit={n}&offset={o} */
        TRACKS: '/search/tracks',
        /** GET /search/albums?query={q}&countryCode={code}&limit={n}&offset={o} */
        ALBUMS: '/search/albums',
        /** GET /search/artists?query={q}&countryCode={code}&limit={n}&offset={o} */
        ARTISTS: '/search/artists',
        /** GET /search/playlists?query={q}&countryCode={code}&limit={n}&offset={o} */
        PLAYLISTS: '/search/playlists',
    },

    /**
     * Image URLs (resources.tidal.com)
     */
    IMAGES: {
        /** Album art: https://resources.tidal.com/images/{uuid}/1280x1280.jpg */
        BASE: 'https://resources.tidal.com/images',
        SIZES: {
            SMALL: '160x160',
            MEDIUM: '320x320',
            LARGE: '640x640',
            XL: '1280x1280',
        },
    },
} as const;

export default TIDAL_ROUTES;
