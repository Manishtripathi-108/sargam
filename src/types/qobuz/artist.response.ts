import type {
    QobuzArtistBase,
    QobuzArtistImage,
    QobuzAudioQuality,
    QobuzGenre,
    QobuzImage,
    QobuzLabel,
} from './common.types';

/**
 * Full artist response (from /artist/get)
 */
export type QobuzArtist = QobuzArtistBase & {
    albums_as_primary_artist_count: number;
    albums_as_primary_composer_count: number;
    picture?: string;
    image?: QobuzArtistImage;
    similar_artist_ids: number[];
    information?: string;
    biography?: QobuzArtistBiography;
};

export type QobuzSearchArtist = QobuzArtistBase & {
    picture?: string;
    image: QobuzArtistImage;
};

type QobuzArtistBiography = {
    summary: string;
    content: string;
    source: string;
    language: string;
};

/**
 * Display name wrapper used in artist page response
 */
export type QobuzDisplayName = {
    display: string;
};

/**
 * Portrait image hash info
 */
export type QobuzPortraitImage = {
    hash: string;
    format: string;
};

/**
 * Artist images in page response
 */
export type QobuzArtistImages = {
    portrait?: QobuzPortraitImage;
};

/**
 * Biography in artist page response
 */
export type QobuzArtistPageBiography = {
    content: string;
    source: string | null;
    language: string;
};

/**
 * Similar artist in artist page response
 */
export type QobuzSimilarArtist = {
    id: number;
    name: QobuzDisplayName;
    images: QobuzArtistImages;
};

/**
 * Similar artists section
 */
export type QobuzSimilarArtists = {
    has_more: boolean;
    items: QobuzSimilarArtist[];
};

/**
 * Artist reference in page response (uses display name format)
 */
export type QobuzPageArtist = {
    id: number;
    name: QobuzDisplayName;
};

/**
 * Composer reference in page response
 */
export type QobuzPageComposer = {
    id: number;
    name: QobuzDisplayName;
};

/**
 * Audio quality info (simplified for page response)
 */
export type QobuzPageAudioInfo = Omit<QobuzAudioQuality, 'hires' | 'hires_streamable'>;

/**
 * Rights/availability flags
 */
export type QobuzRights = {
    streamable: boolean;
    hires_streamable: boolean;
    hires_purchasable: boolean;
    purchasable: boolean;
    downloadable: boolean;
    previewable: boolean;
    sampleable: boolean;
};

/**
 * Physical support info (disc and track number)
 */
export type QobuzPhysicalSupport = {
    media_number: number;
    track_number: number;
};

/**
 * Album reference in track context (page response)
 */
export type QobuzPageTrackAlbum = {
    id: string;
    title: string;
    version: string | null;
    image: QobuzImage;
    label: Pick<QobuzLabel, 'id' | 'name'>;
    genre: Omit<QobuzGenre, 'slug' | 'color'>;
};

/**
 * Top track in artist page response
 */
export type QobuzTopTrack = {
    id: number;
    isrc: string;
    title: string;
    work: string | null;
    version: string | null;
    duration: number;
    parental_warning: boolean;
    composer: QobuzPageComposer;
    artist: QobuzPageArtist;
    artists: QobuzPageArtist[];
    audio_info: QobuzPageAudioInfo;
    rights: QobuzRights;
    physical_support: QobuzPhysicalSupport;
    album: QobuzPageTrackAlbum;
};

/**
 * Artist reference with roles (for album artists)
 */
export type QobuzAlbumArtist = {
    id: number;
    name: string;
    roles: string[];
};

/**
 * Release dates in page response
 */
export type QobuzPageDates = {
    download: string;
    original: string;
    stream: string;
};

/**
 * Simplified rights for releases
 */
export type QobuzReleaseRights = {
    purchasable: boolean;
    streamable: boolean;
    downloadable: boolean;
    hires_streamable: boolean;
    hires_purchasable: boolean;
};

/**
 * Release item (album) in artist page response
 */
export type QobuzReleaseItem = {
    id: string;
    title: string;
    version?: string;
    tracks_count: number;
    artist: QobuzPageArtist;
    artists: QobuzAlbumArtist[];
    image: QobuzImage;
    label: Pick<QobuzLabel, 'id' | 'name'>;
    genre: Omit<QobuzGenre, 'slug' | 'color'>;
    release_type: string;
    release_tags: string[];
    duration: number;
    dates: QobuzPageDates;
    parental_warning: boolean;
    audio_info: QobuzPageAudioInfo;
    rights: QobuzReleaseRights;
    awards: unknown[];
};

/**
 * Release group (by type: album, single, etc.)
 */
export type QobuzRelease = {
    type: string;
    has_more: boolean;
    items: QobuzReleaseItem[];
};

/**
 * Track the artist appears on
 */
export type QobuzTracksAppearsOn = {
    id: number;
    isrc: string;
    title: string;
    work: string | null;
    version: string | null;
    duration: number;
    parental_warning: boolean;
    composer?: QobuzPageComposer;
    artist: QobuzPageArtist;
    artists: QobuzPageArtist[];
    audio_info: QobuzPageAudioInfo;
    rights: QobuzRights;
    physical_support: QobuzPhysicalSupport;
    album: QobuzPageTrackAlbum;
};

/**
 * Playlists section in artist page
 */
export type QobuzArtistPlaylists = {
    has_more: boolean;
    items: unknown[];
};

/**
 * Full artist page response (from /artist/page)
 */
export type QobuzArtistPage = {
    id: number;
    name: QobuzDisplayName;
    artist_category: string;
    biography: QobuzArtistPageBiography;
    images: QobuzArtistImages;
    similar_artists: QobuzSimilarArtists;
    top_tracks: QobuzTopTrack[];
    last_release: QobuzReleaseItem | null;
    releases: QobuzRelease[];
    tracks_appears_on: QobuzTracksAppearsOn[];
    playlists: QobuzArtistPlaylists;
};
