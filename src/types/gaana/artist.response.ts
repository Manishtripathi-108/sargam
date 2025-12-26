import type { Role } from './common';

/**
 * Artist detail response from Gaana API
 * Structure to be defined based on actual API usage
 */
export type GaanaArtistResponse = {
    artist: GaanaArtist[];
    count: string;
    status: number;
    response_time: number;
};

export type GaanaArtist = {
    isWebp: number;
    popularity: number;
    artist_id: string;
    seokey: string;
    name: string;
    rating: string;
    songs: string;
    albums: string;
    artwork: string;
    artwork_175x175: string;
    user_favorite: number;
    user_rating: number;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    meta_h1_tag: string;
    desc: string;
    cached: number;
    episodes: string;
    podcasts: string;
    atw: string;
    favorite_count: string;
    artwork_bio: string;
    roles: Role[];
};

/**
 * Artist reference in track/album responses
 */
export type GaanaAlbumArtist = {
    artist_id: string;
    name: string;
    seokey: string;
    atw: string;
    cached: number;
    popularity: number;
    isWebp: number;
    favorite_count: string;
};

/**
 * Detailed artist information with role in album response
 */
export type GaanaAlbumArtistDetail = {
    artist_id: string;
    name: string;
    seokey?: string;
    artwork: string;
    artwork_175x175: string;
    atw: string;
    role: string;
    cached: number;
    isWebp: number;
    popularity: number;
};

export type GaanaArtistTrackResponse = {
    count: string;
    status: number;
    eof: number;
    entities: Entity[];
    user_token_status: string;
};

export type Entity = {
    language: Language;
    seokey: string;
    name: string;
    artwork: string;
    atw: string;
    atwj: string;
    entity_id: string;
    entity_type: EntityType;
    artwork_medium: string;
    favorite_count: number;
    premium_content: string;
    user_favorite: number;
    entity_info: EntityInfo[];
    loudness: Loudness;
};

export type EntityInfo = {
    key: string;
    value?: ValueElement[] | PurpleValue | number | string;
};

export type ValueElement = {
    artist_id?: string;
    name?: string;
    seokey?: string;
    album_id?: string;
    album_seokey?: string;
    st?: number;
    et?: number;
    message?: string;
    short_code?: string;
    tag_id?: number;
    tag_name?: string;
};

export type PurpleValue = {
    medium?: Auto;
    high?: Auto;
    auto?: Auto;
    message?: string;
    expiryTime?: number;
};

export type Auto = {
    message: string;
    bitRate: string;
    expiryTime: number;
};

export enum EntityType {
    Tr = 'TR',
}

export enum Language {
    Bengali = 'Bengali',
    Hindi = 'Hindi',
}

export type Loudness = {
    integrated: string;
    truePeak: string;
    lra: string;
    threshold: string;
};
