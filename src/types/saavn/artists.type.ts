import type { SaavnAlbumResponse } from './albums.types';
import type { SaavnSongResponse } from './song.types';

type SaavnSocialLinks = {
    dob: string | null;
    fb: string | null;
    twitter: string | null;
    wiki: string | null;
};

type SaavnArtistURLs = {
    albums: string;
    bio: string;
    comments: string;
    songs: string;
    overview: string;
};

type SaavnArtistPlaylist = SaavnArtistBaseResponse & {
    title: string;
    subtitle: string;
    explicit_content: string;
    mini_obj: boolean;
    numsongs: number;
    more_info: {
        uid: string;
        firstname: string;
        artist_name: string[];
        entity_type: string;
        entity_sub_type: string;
        video_available: boolean;
        is_dolby_content: boolean;
        sub_types: string;
        images: string;
        lastname: string;
        song_count: string;
        language: string;
    };
};

type SaavnSimilarArtist = Omit<SaavnArtistBaseResponse, 'role'> &
    SaavnSocialLinks & {
        languages: string | null;
        isRadioPresent: boolean;
        dominantType: string;
        aka: string;
        bio: string | null;
        similar: string | null;
    };

export type SaavnArtistBase = {
    id: string;
    name: string;
    role?: string;
    type: string;
};

export type SaavnArtistBaseResponse = SaavnArtistBase & {
    image: string;
    perma_url: string;
};

export type SaavnArtistResponse = SaavnArtistBaseResponse &
    SaavnSocialLinks & {
        artistId: string;
        subtitle: string;
        follower_count: string;
        isVerified: boolean;
        dominantLanguage: string;
        dominantType: string;
        topSongs: SaavnSongResponse[];
        topAlbums: SaavnAlbumResponse[];
        singles: SaavnSongResponse[];
        dedicated_artist_playlist: SaavnArtistPlaylist[];
        featured_artist_playlist: SaavnArtistPlaylist[];
        similarArtists: SaavnSimilarArtist[];
        isRadioPresent: boolean;
        bio: string;
        urls: SaavnArtistURLs;
        availableLanguages: string[];
        fan_count: string;
        topEpisodes: string[];
        is_followed: boolean;
    };

export type SaavnArtistSongResponse = {
    artistId: string;
    name: string;
    subtitle: string;
    image: string;
    follower_count: string;
    type: string;
    isVerified: boolean;
    dominantLanguage: string;
    dominantType: string;
    topSongs: {
        songs: SaavnSongResponse[];
        total: number;
        last_page: boolean;
    };
};

export type SaavnArtistAlbumResponse = {
    artistId: string;
    name: string;
    subtitle: string;
    image: string;
    follower_count: string;
    type: string;
    isVerified: boolean;
    dominantLanguage: string;
    dominantType: string;
    topAlbums: {
        albums: SaavnAlbumResponse[];
        total: number;
        last_page: boolean;
    };
};
