/**
 * Gaana Playlist Response Types
 */
import type { GaanaSongItem } from './song.response';

/**
 * Playlist detail response from Gaana API
 */
export type GaanaPlaylistResponse = {
    tags: string[];
    fromCache: number;
    modified_on: Date;
    count: string;
    created_on: Date;
    'user-token-status'?: string;
    favorite_count: string;
    tracks: GaanaSongItem[];
    user_token_status?: string;
    status: number;
    error: string;
    ad_code: string;
    playlist: GaanaPlaylistItem;
    sapid: string;
    detailed_description: string;
    'notify_status flag'?: number;
    is_mini_playlist: number;
    delete_mode: number;
    parental_warning: number;
    error_code: null;
    top_artists: GaanaPlaylistTopArtist[];
    top_languages: string[];
    sum_of_tracks: null;
    is_sponsored: number;
    video_list: null;
    vid_list: string[];
};

/**
 * Playlist metadata within playlist details response
 */
export type GaanaPlaylistItem = {
    atw: string;
    language: string;
    playlist_id: string;
    seokey: string;
    status: string;
    user_id: string;
    title: string;
    trackids: string;
    trackcount: number;
    lmap: null;
    lpid: string;
    popularity: string;
    tagline: string;
    createdby: string;
    action: string;
    rating: string;
    artwork: string;
    favorite_count: string;
    max_track_to_be_display: string;
    user_favorite: string;
    user_rating: string;
    modified_on: Date;
    created_on: Date;
    artwork_110: string;
    artwork_175: string;
    is_public: number;
    detailed_description: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    meta_h1_tag: string;
    parental_warning: number;
    is_sponsored: number;
    is_collaborative: number;
    pl_play_ct: string;
};

/**
 * Top artist in playlist
 */
export type GaanaPlaylistTopArtist = {
    isWebp: number;
    popularity: number;
    artist_id: string;
    name: string;
    cached: number;
};
