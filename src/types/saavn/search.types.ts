import type { SaavnArtistBase } from './artists.type';
import type { SaavnEntityBase, SaavnSearchAPIResponseSection } from './global.types';
import type { SaavnSongAPIResponse } from './song.types';

type SaavnAlbumRaw = SaavnEntityBase & {
    more_info: {
        music: string;
        ctr: number;
        year: string;
        is_movie: string;
        language: string;
        song_pids: string;
    };
};

type SaavnSongRaw = SaavnEntityBase & {
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

type SaavnPlaylistRaw = SaavnEntityBase & {
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

type SaavnArtistRaw = Omit<SaavnEntityBase, 'explicit_content' | 'perma_url'> & {
    extra: string;
    name: string;
    isRadioPresent: boolean;
    ctr: number;
    entity: number;
    position: number;
};

export type SaavnSearchAPIResponse = {
    albums: SaavnSearchAPIResponseSection<SaavnAlbumRaw>;
    songs: SaavnSearchAPIResponseSection<SaavnSongRaw>;
    playlists: SaavnSearchAPIResponseSection<SaavnPlaylistRaw>;
    artists: SaavnSearchAPIResponseSection<SaavnArtistRaw>;
    topquery: SaavnSearchAPIResponseSection<SaavnSongRaw>;
};

/* --------------------- Search API Normalized Response --------------------- */

export type SaavnSearchPlaylistAPIResponse = {
    total: number;
    start: number;
    results: Array<
        SaavnPlaylistRaw & {
            more_info: SaavnPlaylistRaw['more_info'] & {
                uid: string;
                song_count: string;
            };
            numsongs: unknown;
        }
    >;
};

export type SaavnSearchArtistAPIResponse = {
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

export type SaavnSearchArtist = {
    total: number;
    start: number;
    results: SaavnArtistBase[];
};

export type SaavnSearchSongAPIResponse = {
    total: number;
    start: number;
    results: SaavnSongAPIResponse[];
};
