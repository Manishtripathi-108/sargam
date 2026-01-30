/**
 * Qobuz API Routes
 *
 * Qobuz uses a public API with an app_id parameter.
 * Configure via environment variables:
 * - QOBUZ_APP_ID: Application ID (optional, has default)
 */

const QOBUZ_ROUTES = {
    /**
     * API base URL
     */
    BASE: 'https://www.qobuz.com/api.json/0.2',

    /**
     * Track endpoints
     */
    TRACK: {
        /** GET /track/get?track_id={id}&app_id={appId} */
        GET: '/track/get',
        /** GET /track/search?query={q}&limit={n}&offset={o}&app_id={appId} */
        SEARCH: '/track/search',
    },

    /**
     * Stream API endpoints (external services)
     * These are third-party APIs that provide stream URLs for Qobuz tracks
     */
    STREAM: {
        /** Primary stream API */
        PRIMARY: 'https://dab.yeet.su/api/stream',
        /** Fallback stream API #1 */
        FALLBACK_1: 'https://dabmusic.xyz/api/stream',
        /** Fallback stream API #2 */
        FALLBACK_2: 'https://qobuz.squid.wtf/api/download-music',
    },

    /**
     * Album endpoints
     */
    ALBUM: {
        /** GET /album/get?album_id={id}&app_id={appId} */
        GET: '/album/get',
        /** GET /album/search?query={q}&limit={n}&offset={o}&app_id={appId} */
        SEARCH: '/album/search',
        /** GET /album/suggest?album_id={id}&app_id={appId} */
        SUGGEST: '/album/suggest',
    },

    /**
     * Artist endpoints
     */
    ARTIST: {
        /** GET /artist/get?artist_id={id}&app_id={appId} */
        GET: '/artist/get',
        /** GET /artist/search?query={q}&limit={n}&offset={o}&app_id={appId} */
        SEARCH: '/artist/search',
        /** GET /artist/page?artist_id={id}&sort={sort}&app_id={appId}&extra={extra} */
        PAGE: '/artist/page',
    },

    /**
     * Playlist endpoints
     */
    PLAYLIST: {
        /** GET /playlist/get?playlist_id={id}&app_id={appId} */
        GET: '/playlist/get',
        /** GET /playlist/search?query={q}&limit={n}&offset={o}&app_id={appId} */
        SEARCH: '/playlist/search',
    },

    /**
     * Label endpoints
     */
    LABEL: {
        /** GET /label/get?label_id={id}&app_id={appId} */
        GET: '/label/get',
        /** GET /label/search?query={q}&limit={n}&offset={o}&app_id={appId} */
        SEARCH: '/label/search',
    },

    /**
     * Search all endpoint (combined search)
     */
    SEARCH: {
        /** GET /catalog/search?query={q}&limit={n}&offset={o}&app_id={appId} */
        CATALOG: '/catalog/search',
    },

    /**
     * Quality codes for streaming
     * 5 = MP3 320kbps
     * 6 = FLAC 16-bit/44.1kHz (CD quality)
     * 7 = FLAC 24-bit up to 96kHz
     * 27 = FLAC 24-bit up to 192kHz (Hi-Res)
     */
    QUALITY: {
        MP3_320: '5',
        FLAC_16: '6',
        FLAC_24_96: '7',
        FLAC_24_192: '27',
    },
} as const;

export default QOBUZ_ROUTES;
