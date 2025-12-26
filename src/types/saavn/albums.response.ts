/**
 * Saavn Album Response Types
 */
import type { SaavnArtistBaseResponse, SaavnEntityBase } from './common.types';
import type { SaavnSongResponse } from './song.response';

/**
 * Complete album details from Saavn API
 */
export type SaavnAlbumResponse = SaavnEntityBase & {
    header_desc: string;
    play_count: string;
    list_count: string;
    list_type: string;
    year: string;
    language: string;
    list: SaavnSongResponse[];
    more_info: {
        artistMap: SaavnSongResponse['more_info']['artistMap'];
        song_count: string;
        copyright_text: string;
        is_dolby_content: boolean;
        label_url: string;
    };
};

/**
 * Album item in search results
 */
export type SaavnSearchAlbumItem = {
    id: string;
    title: string;
    subtitle: string;
    header_desc: string;
    type: string;
    perma_url: string;
    image: string;
    language: string;
    year: string;
    play_count: string;
    explicit_content: string;
    list_count: string;
    list_type: string;
    list: SaavnSongResponse[];
    more_info: {
        query: string;
        text: string;
        music: string;
        song_count: string;
        artistMap: {
            primary_artists: SaavnArtistBaseResponse[];
            featured_artists: SaavnArtistBaseResponse[];
            artists: SaavnArtistBaseResponse[];
        };
    };
};

/**
 * Album search response with pagination
 */
export type SaavnSearchAlbumResponse = {
    total: number;
    start: number;
    results: SaavnSearchAlbumItem[];
};
