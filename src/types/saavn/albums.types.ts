import type { SaavnArtistBase, SaavnArtistBaseAPIResponse } from './artists.type';
import type { SaavnEntityBase, SaavnImageLink } from './global.types';
import type { SaavnSong, SaavnSongAPIResponse } from './song.types';

export type SaavnSearchAlbumAPIResponse = {
    total: number;
    start: number;
    results: {
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
        list: SaavnSong[];
        more_info: {
            query: string;
            text: string;
            music: string;
            song_count: string;
            artistMap: {
                primary_artists: SaavnArtistBaseAPIResponse[];
                featured_artists: SaavnArtistBaseAPIResponse[];
                artists: SaavnArtistBaseAPIResponse[];
            };
        };
    }[];
};

export type avnSearchAlbum = {
    total: number;
    start: number;
    results: {
        id: string;
        name: string;
        description: string;
        year: number | null;
        type: string;
        playCount: number | null;
        language: string;
        explicitContent: boolean;
        artists: {
            primary: SaavnArtistBase[];
            featured: SaavnArtistBase[];
            all: SaavnArtistBase[];
        };
        url: string;
        image: SaavnImageLink[];
    }[];
};

export type SaavnAlbumAPIResponse = SaavnEntityBase & {
    header_desc: string;
    play_count: string;
    list_count: string;
    list_type: string;
    year: string;
    language: string;
    list: SaavnSongAPIResponse[];
    more_info: {
        artistMap: SaavnSongAPIResponse['more_info']['artistMap'];
        song_count: string;
        copyright_text: string;
        is_dolby_content: boolean;
        label_url: string;
    };
};

export type SaavnAlbum = {
    id: string;
    name: string;
    description: string;
    year: number | null;
    type: string;
    playCount: number | null;
    language: string;
    explicitContent: boolean;
    artists: SaavnSong['artists'];
    songCount: number | null;
    url: string;
    image: SaavnImageLink[];
    songs: SaavnSong[] | null;
};
