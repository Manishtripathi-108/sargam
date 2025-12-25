import type { SaavnArtistBaseResponse } from './artists.type';
import type { SaavnEntityBase } from './global.types';

export type SaavnSongResponse = SaavnEntityBase & {
    header_desc: string;
    play_count: string;
    list_count: string;
    list_type: string;
    list: string;
    year: string;
    language: string;
    more_info: {
        music: string;
        album_id: string;
        album: string;
        label: string;
        origin: string;
        is_dolby_content: boolean;
        '320kbps': string;
        encrypted_media_url: string;
        encrypted_cache_url: string;
        album_url: string;
        duration: string;
        cache_state: string;
        has_lyrics: string;
        lyrics_snippet: string;
        starred: string;
        copyright_text: string;
        release_date: string;
        label_url: string;
        vcode: string;
        vlink: string;
        triller_available: boolean;
        request_jiotune_flag: boolean;
        webp: string;
        lyrics_id: string;
        rights: {
            code: string;
            cacheable: string;
            delete_cached_object: string;
            reason: string;
        };
        artistMap: {
            primary_artists: SaavnArtistBaseResponse[];
            featured_artists: SaavnArtistBaseResponse[];
            artists: SaavnArtistBaseResponse[];
        };
    };
};

type SaavnSongStationResponse = Record<string, { song: SaavnSongResponse }>;

export type SaavnSongSuggestionResponse = {
    stationid: string;
} & SaavnSongStationResponse;
