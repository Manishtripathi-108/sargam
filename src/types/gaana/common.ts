/**
 * Person entity (cast, lyricist, etc.)
 */
export type GaanaPerson = {
    e_id: string;
    name: string;
    seokey: string;
    artwork: string;
    atw: string;
    e_type: string;
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
 * Track formats available (mp3, mp4_aac)
 */
export type GaanaTrackFormat = {
    mp3: GaanaBitrateMap;
    mp4_aac: GaanaBitrateMap;
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
 * Custom artwork sizes
 */
export type GaanaCustomArtworks = {
    '110x110': string;
    '80x80': string;
    '175x175': string;
    '40x40': string;
    '480x480': string;
};

export type Role = {
    id: number;
    name: string;
};
