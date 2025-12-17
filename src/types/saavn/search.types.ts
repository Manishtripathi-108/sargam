import type { SaavnArtistBase } from './artists.type';
import type {
    SaavnEntityBase,
    SaavnImageLink,
    SaavnNormalizedEntityBase,
    SaavnSearchAPIResponseSection,
    SaavnSearchSection,
} from './global.types';
import type { SaavnSong, SaavnSongAPIResponse } from './song.types';

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
export type SaavnSearchResponse = {
    albums: SaavnSearchSection<
        SaavnNormalizedEntityBase & {
            artist: string;
            url: string;
            year: string;
            language: string;
            songIds: string;
        }
    >;
    songs: SaavnSearchSection<
        SaavnNormalizedEntityBase & {
            album: string;
            url: string;
            primaryArtists: string;
            singers: string;
            language: string;
        }
    >;
    artists: SaavnSearchSection<SaavnNormalizedEntityBase>;
    playlists: SaavnSearchSection<
        SaavnNormalizedEntityBase & {
            url: string;
            language: string;
        }
    >;
    topQuery: SaavnSearchSection<
        SaavnNormalizedEntityBase & {
            album: string;
            url: string;
            primaryArtists: string;
            singers: string;
            language: string;
        }
    >;
};

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

export type SaavnSearchPlaylist = {
    total: number;
    start: number;
    results: {
        id: string;
        name: string;
        type: string;
        image: SaavnImageLink[];
        url: string;
        songCount: number | null;
        language: string;
        explicitContent: boolean;
    }[];
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

export type SaavnSearchSong = {
    total: number;
    start: number;
    results: SaavnSong[];
};
