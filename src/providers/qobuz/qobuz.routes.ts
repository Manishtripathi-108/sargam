/**
 * Qobuz API Routes
 *
 * Qobuz uses a public API with an app_id parameter.
 * Configure via environment variables:
 * - QOBUZ_APP_ID: Application ID (optional, has default)
 * - QOBUZ_APP_SECRET: Application secret for stream URLs
 * - QOBUZ_EMAIL: User email for authentication
 * - QOBUZ_PASSWORD: User password for authentication
 * - QOBUZ_USER_AUTH_TOKEN: Pre-existing auth token (alternative to email/password)
 * - QOBUZ_USER_ID: User ID (used with auth token)
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
        /**
         * GET /track/getFileUrl - Get stream URL for a track
         * Requires authentication and signature:
         * - track_id: Track ID
         * - format_id: Quality (5=MP3, 6=FLAC 16-bit, 7=FLAC 24-bit 96kHz, 27=FLAC 24-bit 192kHz)
         * - intent: 'stream'
         * - request_ts: Unix timestamp
         * - request_sig: MD5("trackgetFileUrlformat_id{quality}intentstreamtrack_id{track_id}{timestamp}{secret}")
         */
        FILE_URL: '/track/getFileUrl',
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
        /** Fallback stream API #3 (alternative parameter format) */
        FALLBACK_3: 'https://qobuzapi.vercel.app/api/stream',
        /** Fallback stream API #4 */
        FALLBACK_4: 'https://qobuz.deno.dev/stream',
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
        /** GET /album/getFeatured?type={type}&limit={n}&offset={o}&genre_id={g}&app_id={appId} */
        FEATURED: '/album/getFeatured',
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
        /** GET /playlist/getFeatured?limit={n}&offset={o}&genre_id={g}&app_id={appId} */
        FEATURED: '/playlist/getFeatured',
        /** GET /playlist/getUserPlaylists?user_id={id}&limit={n}&offset={o} (requires auth) */
        USER_PLAYLISTS: '/playlist/getUserPlaylists',
        /** GET /playlist/create?name={n}&description={d}&is_public={p} (requires auth) */
        CREATE: '/playlist/create',
        /** GET /playlist/delete?playlist_id={id} (requires auth) */
        DELETE: '/playlist/delete',
        /** GET /playlist/update?playlist_id={id}&name={n}&description={d}&is_public={p} (requires auth) */
        UPDATE: '/playlist/update',
        /** GET /playlist/addTracks?playlist_id={id}&track_ids={ids} (requires auth) */
        ADD_TRACKS: '/playlist/addTracks',
        /** GET /playlist/deleteTracks?playlist_id={id}&playlist_track_ids={ids} (requires auth) */
        REMOVE_TRACKS: '/playlist/deleteTracks',
        /** GET /playlist/subscribe?playlist_id={id} (requires auth) */
        SUBSCRIBE: '/playlist/subscribe',
        /** GET /playlist/unsubscribe?playlist_id={id} (requires auth) */
        UNSUBSCRIBE: '/playlist/unsubscribe',
    },

    /**
     * Label endpoints
     */
    LABEL: {
        /** GET /label/get?label_id={id}&app_id={appId} */
        GET: '/label/get',
        /** GET /label/search?query={q}&limit={n}&offset={o}&app_id={appId} */
        SEARCH: '/label/search',
        /** GET /label/list?label_id={id}&limit={n}&offset={o}&app_id={appId} */
        ALBUMS: '/label/list',
    },

    /**
     * Search all endpoint (combined search)
     */
    SEARCH: {
        /** GET /catalog/search?query={q}&limit={n}&offset={o}&app_id={appId} */
        CATALOG: '/catalog/search',
    },

    /**
     * User endpoints
     */
    USER: {
        /** GET /user/login?email={e}&password={p_md5}&app_id={appId} */
        LOGIN: '/user/login',
        /** GET /user/get?user_id={id} (requires auth) */
        GET: '/user/get',
    },

    /**
     * Favorite endpoints (all require authentication)
     */
    FAVORITE: {
        /** GET /favorite/getUserFavorites?user_id={id}&type=tracks&limit={n}&offset={o} */
        GET_TRACKS: '/favorite/getUserFavorites',
        /** GET /favorite/getUserFavorites?user_id={id}&type=albums&limit={n}&offset={o} */
        GET_ALBUMS: '/favorite/getUserFavorites',
        /** GET /favorite/getUserFavorites?user_id={id}&type=artists&limit={n}&offset={o} */
        GET_ARTISTS: '/favorite/getUserFavorites',
        /** GET /favorite/getUserFavorites?user_id={id}&limit={n}&offset={o} (all types) */
        GET_ALL: '/favorite/getUserFavorites',
        /** GET /favorite/create?track_ids={ids} or album_ids={ids} or artist_ids={ids} */
        ADD: '/favorite/create',
        /** GET /favorite/delete?track_ids={ids} or album_ids={ids} or artist_ids={ids} */
        REMOVE: '/favorite/delete',
    },

    /**
     * Purchase endpoints (require authentication)
     */
    PURCHASE: {
        /** GET /purchase/getUserPurchases?user_id={id}&limit={n}&offset={o} */
        GET_ALL: '/purchase/getUserPurchases',
    },

    /**
     * Genre endpoints
     */
    GENRE: {
        /** GET /genre/list?limit={n}&offset={o}&app_id={appId} */
        LIST: '/genre/list',
        /** GET /genre/get?genre_id={id}&app_id={appId} */
        GET: '/genre/get',
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
