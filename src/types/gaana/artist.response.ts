/**
 * Gaana Artist Response Types
 */
import type { GaanaArtistBase, GaanaLoudness, GaanaRole } from './common.types';

/**
 * Artist detail response from Gaana API
 */
export type GaanaArtistResponse = {
    artist: GaanaArtistItem[];
    count: string;
    status: number;
    response_time?: number;
};

/**
 * Complete artist details
 */
export type GaanaArtistItem = GaanaArtistBase & {
    isWebp: number;
    popularity: number;
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
    roles: GaanaRole[];
};

/**
 * Artist tracks/songs response
 */
export type GaanaArtistTrackResponse = {
    count: string;
    status: number;
    eof: number;
    entities: GaanaArtistEntity[];
    user_token_status: string;
};

/**
 * Entity in artist tracks/albums response
 */
export type GaanaArtistEntity = {
    language: string;
    seokey: string;
    name: string;
    artwork: string;
    atw: string;
    atwj: string;
    entity_id: string;
    entity_type: 'TR' | 'AL' | string;
    artwork_medium: string;
    favorite_count: number;
    premium_content: string;
    user_favorite: number;
    entity_info: GaanaArtistEntityInfo[];
    loudness: GaanaLoudness;
};

/**
 * Entity metadata
 */
export type GaanaArtistEntityInfo = {
    key: string;
    value?: GaanaArtistEntityInfoValue[] | GaanaArtistEntityStreamInfo | number | string;
};

/**
 * Entity info value element (artist, album, tag, etc.)
 */
export type GaanaArtistEntityInfoValue = {
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

/**
 * Stream info with quality levels
 */
export type GaanaArtistEntityStreamInfo = {
    medium?: GaanaStreamQualityInfo;
    high?: GaanaStreamQualityInfo;
    auto?: GaanaStreamQualityInfo;
    message?: string;
    expiryTime?: number;
};

/**
 * Individual stream quality info
 */
export type GaanaStreamQualityInfo = {
    message: string;
    bitRate: string;
    expiryTime: number;
};
