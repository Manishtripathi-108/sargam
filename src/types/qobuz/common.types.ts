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

/* -------------------------------------------------------------------------- */
/*                            AUTHENTICATION TYPES                            */
/* -------------------------------------------------------------------------- */

/**
 * User credentials for login
 */
export type QobuzUserCredentials = {
    email: string;
    password: string;
};

/**
 * App credentials (app_id and secret)
 */
export type QobuzAppCredentials = {
    appId: string;
    appSecret: string;
};

/**
 * User subscription/credential info
 */
export type QobuzUserCredential = {
    id: number;
    label: string;
    description: string;
    parameters: {
        lossy_streaming: boolean;
        lossless_streaming: boolean;
        hires_streaming: boolean;
        hires_purchases_streaming: boolean;
        mobile_streaming: boolean;
        offline_streaming: boolean;
        hfp_purchase: boolean;
        included_format_group_ids: number[];
        color_scheme: {
            logo: string;
        };
        label: string;
        short_label: string;
        source: string;
    };
};

/**
 * User information from login/get response
 */
export type QobuzUser = {
    id: number;
    publicId: string;
    email: string;
    login: string;
    display_name: string;
    firstname?: string;
    lastname?: string;
    country_code: string;
    language_code: string;
    zone: string;
    store: string;
    avatar?: string;
    genre?: string;
    age?: number;
    creation_date: string;
    credential?: QobuzUserCredential;
    subscription?: {
        offer: string;
        end_date: string;
        is_canceled: boolean;
        periodicity: string;
        household_size_actual: number;
        household_size_max: number;
    };
};

/**
 * Login response
 */
export type QobuzLoginResponse = {
    user_auth_token: string;
    user: QobuzUser;
};

/* -------------------------------------------------------------------------- */
/*                            USER LIBRARY TYPES                             */
/* -------------------------------------------------------------------------- */

/**
 * Favorite tracks response
 */
export type QobuzFavoriteTracksResponse = {
    tracks: {
        items: QobuzFavoriteTrack[];
        offset: number;
        limit: number;
        total: number;
    };
};

/**
 * Favorite track item
 */
export type QobuzFavoriteTrack = {
    id: number;
    title: string;
    duration: number;
    track_number: number;
    media_number: number;
    performer: QobuzPerformer;
    album: {
        id: string;
        title: string;
        image: QobuzImage;
        artist: QobuzArtistBase;
    };
    created_at: number;
};

/**
 * Favorite albums response
 */
export type QobuzFavoriteAlbumsResponse = {
    albums: {
        items: QobuzFavoriteAlbum[];
        offset: number;
        limit: number;
        total: number;
    };
};

/**
 * Favorite album item
 */
export type QobuzFavoriteAlbum = {
    id: string;
    title: string;
    artist: QobuzArtistBase;
    image: QobuzImage;
    release_date_original: string;
    hires_streamable: boolean;
    created_at: number;
};

/**
 * Favorite artists response
 */
export type QobuzFavoriteArtistsResponse = {
    artists: {
        items: QobuzFavoriteArtist[];
        offset: number;
        limit: number;
        total: number;
    };
};

/**
 * Favorite artist item
 */
export type QobuzFavoriteArtist = {
    id: number;
    name: string;
    slug: string;
    image?: QobuzArtistImage;
    albums_count: number;
    created_at: number;
};

/**
 * User playlists response
 */
export type QobuzUserPlaylistsResponse = {
    playlists: {
        items: QobuzUserPlaylist[];
        offset: number;
        limit: number;
        total: number;
    };
};

/**
 * User playlist item
 */
export type QobuzUserPlaylist = {
    id: number;
    name: string;
    description?: string;
    is_public: boolean;
    is_collaborative: boolean;
    tracks_count: number;
    duration: number;
    created_at: number;
    updated_at: number;
    owner: QobuzOwner;
    images?: string[];
    images300?: string[];
};

/**
 * Purchases response
 */
export type QobuzPurchasesResponse = {
    purchases: {
        items: QobuzPurchase[];
        offset: number;
        limit: number;
        total: number;
    };
};

/**
 * Purchase item
 */
export type QobuzPurchase = {
    id: number;
    created_at: number;
    type: 'album' | 'track';
    album?: {
        id: string;
        title: string;
        artist: QobuzArtistBase;
        image: QobuzImage;
    };
    track?: {
        id: number;
        title: string;
        album: {
            id: string;
            title: string;
            image: QobuzImage;
        };
    };
};

/* -------------------------------------------------------------------------- */
/*                                LABEL TYPES                                 */
/* -------------------------------------------------------------------------- */

/**
 * Label with full details
 */
export type QobuzLabelFull = QobuzLabel & {
    description?: string;
    image?: {
        small: string;
        medium: string;
        large: string;
    };
};

/**
 * Label albums response
 */
export type QobuzLabelAlbumsResponse = {
    albums: QobuzPaginatedList<import('./album.response').QobuzAlbum>;
};

/**
 * Label search response
 */
export type QobuzLabelSearchResponse = {
    query: string;
    labels: QobuzPaginatedList<QobuzLabel>;
};

/* -------------------------------------------------------------------------- */
/*                          FEATURED/EDITORIAL TYPES                          */
/* -------------------------------------------------------------------------- */

/**
 * Featured item (can be album, playlist, or article)
 */
export type QobuzFeaturedItem = {
    id: string;
    type: 'album' | 'playlist' | 'article' | 'label';
    title: string;
    subtitle?: string;
    image?: {
        small: string;
        large: string;
    };
    album?: import('./album.response').QobuzAlbum;
    playlist?: import('./playlist.response').QobuzPlaylist;
};

/**
 * Featured albums response
 */
export type QobuzFeaturedAlbumsResponse = {
    albums: QobuzPaginatedList<import('./album.response').QobuzAlbum>;
};

/**
 * Featured playlists response
 */
export type QobuzFeaturedPlaylistsResponse = {
    playlists: QobuzPaginatedList<import('./playlist.response').QobuzPlaylist>;
};

/**
 * Genre list response
 */
export type QobuzGenreListResponse = {
    genres: QobuzPaginatedList<QobuzGenreInfo>;
};

/**
 * Genre information (extended)
 */
export type QobuzGenreInfo = {
    id: number;
    name: string;
    slug: string;
    path: number[];
    color?: string;
    image?: {
        small: string;
        large: string;
    };
    subgenres?: QobuzGenreInfo[];
};

/**
 * Type for album list types (used in featured endpoints)
 */
export type QobuzAlbumListType =
    | 'new-releases'
    | 'new-releases-full'
    | 'press-awards'
    | 'best-sellers'
    | 'editor-picks'
    | 'most-streamed'
    | 'most-featured'
    | 'ideal-discography'
    | 'recent-releases';
