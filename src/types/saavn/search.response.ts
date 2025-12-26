/**
 * Saavn Search Response Types
 */
import type { SaavnArtistBase, SaavnEntityBase, SaavnSearchResponseSection } from './common.types';
import type { SaavnSongResponse } from './song.response';

/* ========================= Raw Search Response ========================= */

/**
 * Album item in raw search response
 */
type SaavnSearchAlbumRaw = SaavnEntityBase & {
    more_info: {
        music: string;
        ctr: number;
        year: string;
        is_movie: string;
        language: string;
        song_pids: string;
    };
};

/**
 * Track item in raw search response
 */
type SaavnSearchSongRaw = SaavnEntityBase & {
    more_info: {
        album: string;
        ctr: number;
        score?: string;
        vcode: string;
        vlink?: string;
        primary_artists: string;
        singers: string;
        video_available: boolean;
        triller_available: boolean;
        language: string;
    };
};

/**
 * Playlist item in raw search response
 */
type SaavnSearchPlaylistRaw = SaavnEntityBase & {
    more_info: {
        firstname: string;
        artist_name: string[];
        entity_type: string;
        entity_sub_type: string;
        video_available: boolean;
        is_dolby_content: boolean;
        sub_types: unknown;
        images: Record<string, unknown>;
        lastname: string;
        language: string;
    };
};

/**
 * Artist item in raw search response
 */
type SaavnSearchArtistRaw = Omit<SaavnEntityBase, 'explicit_content' | 'perma_url'> & {
    extra: string;
    name: string;
    isRadioPresent: boolean;
    ctr: number;
    entity: number;
    position: number;
};

/**
 * Main search response with raw data
 */
export type SaavnSearchResponse = {
    albums: SaavnSearchResponseSection<SaavnSearchAlbumRaw>;
    songs: SaavnSearchResponseSection<SaavnSearchSongRaw>;
    playlists: SaavnSearchResponseSection<SaavnSearchPlaylistRaw>;
    artists: SaavnSearchResponseSection<SaavnSearchArtistRaw>;
    topquery: SaavnSearchResponseSection<SaavnSearchSongRaw>;
};

/* ========================= Normalized Search Responses ========================= */

/**
 * Playlist search response with pagination
 */
export type SaavnSearchPlaylistResponse = {
    total: number;
    start: number;
    results: Array<
        SaavnSearchPlaylistRaw & {
            more_info: SaavnSearchPlaylistRaw['more_info'] & {
                uid: string;
                song_count: string;
            };
            numsongs: unknown;
        }
    >;
};

/**
 * Artist search response with pagination
 */
export type SaavnSearchArtistResponse = {
    total: number;
    start: number;
    results: {
        name: string;
        id: string;
        ctr: number;
        entity: number;
        image: string;
        role: string;
        perma_url: string;
        type: string;
        mini_obj: boolean;
        isRadioPresent: boolean;
        is_followed: boolean;
    }[];
};

/**
 * Artist search results
 */
export type SaavnSearchArtistItem = {
    total: number;
    start: number;
    results: SaavnArtistBase[];
};

/**
 * Track search response with pagination
 */
export type SaavnSearchSongResponse = {
    total: number;
    start: number;
    results: SaavnSongResponse[];
};
