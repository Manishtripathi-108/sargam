/**
 * Gaana API Common Types
 * Shared shapes and reusable fragments across all Gaana responses
 */

/**
 * Custom artwork sizes available for content
 */
export type GaanaCustomArtworks = {
    '110x110': string;
    '80x80': string;
    '175x175': string;
    '40x40': string;
    '480x480': string;
};

/**
 * Base image/artwork with multiple quality levels
 */
export type GaanaImage = {
    artwork?: string;
    artwork_175x175?: string;
    artwork_web?: string;
    artwork_large?: string;
    artwork_medium?: string;
    artwork_110?: string;
    artwork_175?: string;
};

/**
 * Language information
 */
export type GaanaLanguage = {
    language?: string;
    secondary_language?: string;
    language_id?: string;
};

/**
 * Generic role assignment (for artists, etc.)
 */
export type GaanaRole = {
    id: number;
    name: string;
};

/**
 * Base artist reference - used in tracks and albums
 */
export type GaanaArtistBase = {
    artist_id: string;
    name: string;
    seokey: string;
};

/**
 * Base person entity (cast, lyricist, etc.)
 */
export type GaanaPerson = {
    e_id: string;
    name: string;
    seokey: string;
    artwork?: string;
    atw?: string;
    e_type?: string;
};

/**
 * Composer information
 */
export type GaanaComposer = {
    composer_id?: string;
    e_id?: string;
    name: string;
    seokey: string;
    artwork?: string;
    favorite?: number;
    e_type?: string;
};

/**
 * Genre/category information
 */
export type GaanaGenre = {
    genre_id?: string;
    gener_id?: string;
    name: string;
};

/**
 * Tag associated with content
 */
export type GaanaTag = {
    tag_id: number;
    tag_name: string;
};

/**
 * Stream URL with quality and expiry
 */
export type GaanaStreamQuality = {
    message: string;
    bitRate: string;
    expiryTime: number;
};

/**
 * Stream URLs by quality level
 */
export type GaanaStreamUrls = {
    medium?: GaanaStreamQuality;
    high?: GaanaStreamQuality;
    auto?: GaanaStreamQuality;
};

/**
 * Preview URL with expiry
 */
export type GaanaPreviewUrl = {
    message: string;
    expiryTime: number;
};

/**
 * Track format bitrate mapping
 */
export type GaanaBitrateMap = {
    normal: string;
    medium: string;
    high: string;
    extreme: string;
    auto: string;
};

/**
 * Track formats available (mp3, mp4_aac, etc.)
 */
export type GaanaSongFormat = {
    mp3?: GaanaBitrateMap;
    mp4_aac?: GaanaBitrateMap;
    [key: string]: GaanaBitrateMap | undefined;
};

/**
 * Operator/carrier information
 */
export type GaanaOperator = {
    name: string;
    st: number;
    et: number;
    message: string;
    short_code: string;
};

/**
 * FAQ entry
 */
export type GaanaFaq = {
    question: string;
    answer: string;
};

/**
 * Audio loudness metrics
 */
export type GaanaLoudness = {
    integrated: string;
    truePeak: string;
    lra: string;
    threshold: string;
};

/**
 * API response metadata - standard status codes
 */
export type GaanaApiMeta = {
    status: number;
    cached?: number;
    parental_warning?: number;
};

/**
 * User authentication/session status
 */
export type GaanaUserTokenStatus = {
    'user-token-status'?: string;
    user_token_status?: string;
};

/**
 * Pagination/result count metadata
 */
export type GaanaPaging = {
    count?: string | number;
    eof?: number;
};
