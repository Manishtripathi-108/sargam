
/**
 * Image/artwork with multiple sizes
 */
export type QobuzImage = {
    small: string;
    thumbnail: string;
    large: string;
};

/**
 * Extended artist image sizes
 */
export type QobuzArtistImage = {
    small: string;
    medium: string;
    large: string;
    extralarge: string;
    mega: string;
};

/**
 * Base artist reference - used in tracks and albums
 */
export type QobuzArtistBase = {
    name: 'Djo';
    id: 872872;
    albums_count: 50;
    slug: 'djo';
};

/**
 * Performer information (track-level artist reference)
 */
export type QobuzPerformer = {
    id: number;
    name: string;
};

/**
 * Label information
 */
export type QobuzLabel = {
    id: number;
    name: string;
    slug: string;
    albums_count: number;
    supplier_id: number;
};

/**
 * Genre information
 */
export type QobuzGenre = {
    id: number;
    name: string;
    slug: string;
    path: number[];
    color?: string;
};

export type QobuzTag = {
    featured_tag_id: string;
    name_json: string;
    slug: string;
    genre_tag?: QobuzGenreTag;
    is_discover: boolean;
};

export type QobuzGenreTag = {
    genre_id: string;
    name: string;
};

/**
 * Owner information for playlists
 */
export type QobuzOwner = {
    id: number;
    name: string;
};

/**
 * Artist biography
 */
export type QobuzBiography = {
    summary?: string;
    content?: string;
};

/**
 * Audio quality information
 */
export type QobuzAudioQuality = {
    maximum_bit_depth: number;
    maximum_channel_count: number;
    maximum_sampling_rate: number;
    hires: boolean;
    hires_streamable: boolean;
};

/**
 * Audio info details
 */
export type QobuzAudioInfo = {
    replaygain_track_peak: number;
    replaygain_track_gain: number;
};

/**
 * Availability flags
 */
export type QobuzAvailability = {
    purchasable: boolean;
    streamable: boolean;
    previewable: boolean;
    sampleable: boolean;
    downloadable: boolean;
    displayable: boolean;
    purchasable_at: number | null;
    streamable_at: number | null;
};

/**
 * Release date information
 */
export type QobuzReleaseDates = {
    release_date_original: string;
    release_date_download: string;
    release_date_stream: string;
    release_date_purchase: string;
};

/**
 * Paginated list wrapper
 */
export type QobuzPaginatedList<T> = {
    items: T[];
    offset: number;
    limit: number;
    total: number;
};
