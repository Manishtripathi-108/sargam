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

/**
 * Stream URL response from external APIs
 */
export type QobuzStreamResponse = {
    url: string;
};

/**
 * Preview format in Qobuz file URL response
 */
export type QobuzPreviewFormat = {
    format_id: number;
    duration: number;
    url: string;
    mime_type: string;
};

/**
 * Restriction code in Qobuz file URL response
 */
export type QobuzRestriction = {
    code: string;
};

/**
 * Full file URL response from Qobuz API (/track/getFileUrl)
 * Returns either full stream (authenticated) or preview (unauthenticated)
 */
export type QobuzFileUrlResponse = {
    /** 'preview' for unauthenticated, full track for authenticated */
    file_type: string;
    track_id: number;
    format_id: number;
    /** Duration in seconds (30 for preview, full for authenticated) */
    duration: number;
    /** Stream URL */
    url: string;
    mime_type: string;
    sampling_rate: number;
    bits_depth: number;
    n_channels: number;
    /** Preview URLs in different formats (only for unauthenticated) */
    preview?: QobuzPreviewFormat[];
    /** Restrictions explaining why full stream is not available */
    restrictions?: QobuzRestriction[];
    /** Blob for authenticated streams */
    blob?: string;
};

/**
 * Quality parameter for stream requests
 * 5 = MP3 320kbps
 * 6 = FLAC 16-bit/44.1kHz (CD quality)
 * 7 = FLAC 24-bit up to 96kHz
 * 27 = FLAC 24-bit up to 192kHz (Hi-Res)
 */
export type QobuzQuality = '5' | '6' | '7' | '27';
