/* -------------------------------------------------------------------------- */
/*                                BASE TYPES                                  */
/* -------------------------------------------------------------------------- */

export type QobuzImage = {
    small: string;
    thumbnail: string;
    large: string;
};

export type QobuzArtistImage = {
    small: string;
    medium: string;
    large: string;
    extralarge: string;
    mega: string;
};

export type QobuzArtistBase = {
    id: number;
    name: string;
    slug: string;
    albums_count: number;
};

export type QobuzPerformer = {
    id: number;
    name: string;
};

export type QobuzLabel = {
    id: number;
    name: string;
    slug: string;
    albums_count: number;
    supplier_id: number;
};

export type QobuzGenre = {
    id: number;
    name: string;
    slug: string;
    path: number[];
    color?: string;
};

export type QobuzGenreTag = {
    genre_id: string;
    name: string;
};

export type QobuzTag = {
    featured_tag_id: string;
    name_json: string;
    slug: string;
    genre_tag?: QobuzGenreTag;
    is_discover: boolean;
};

export type QobuzOwner = {
    id: number;
    name: string;
};

/* -------------------------------------------------------------------------- */
/*                                AUDIO TYPES                                 */
/* -------------------------------------------------------------------------- */

export type QobuzAudioQuality = {
    maximum_bit_depth: number;
    maximum_channel_count: number;
    maximum_sampling_rate: number;
    hires: boolean;
    hires_streamable: boolean;
};

export type QobuzAudioInfo = {
    replaygain_track_peak: number;
    replaygain_track_gain: number;
};

/** 5=MP3 320, 6=FLAC 16-bit, 7=FLAC 24-bit/96kHz, 27=FLAC 24-bit/192kHz */
export type QobuzQuality = '5' | '6' | '7' | '27';

/* -------------------------------------------------------------------------- */
/*                             AVAILABILITY TYPES                             */
/* -------------------------------------------------------------------------- */

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

export type QobuzReleaseDates = {
    release_date_original: string;
    release_date_download: string;
    release_date_stream: string;
    release_date_purchase: string;
};

/* -------------------------------------------------------------------------- */
/*                                PAGINATION                                  */
/* -------------------------------------------------------------------------- */

export type QobuzPaginatedList<T> = {
    items: T[];
    offset: number;
    limit: number;
    total: number;
};

/* -------------------------------------------------------------------------- */
/*                                STREAM TYPES                                */
/* -------------------------------------------------------------------------- */

export type QobuzStreamResponse = {
    url: string;
};

export type QobuzPreviewFormat = {
    format_id: number;
    duration: number;
    url: string;
    mime_type: string;
};

export type QobuzRestriction = {
    code: string;
};

export type QobuzFileUrlResponse = {
    file_type: string;
    track_id: number;
    format_id: number;
    duration: number;
    url: string;
    mime_type: string;
    sampling_rate: number;
    bits_depth: number;
    n_channels: number;
    preview?: QobuzPreviewFormat[];
    restrictions?: QobuzRestriction[];
    blob?: string;
};
