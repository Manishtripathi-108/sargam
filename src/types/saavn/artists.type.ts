import type { SaavnAlbum, SaavnAlbumAPIResponse } from './albums.types';
import type { SaavnImageLink } from './global.types';
import type { SaavnSong, SaavnSongAPIResponse } from './song.types';

type SaavnSocialLinks = {
    dob: string | null;
    fb: string | null;
    twitter: string | null;
    wiki: string | null;
};

type SaavnBioBlock = {
    text: string | null;
    title: string | null;
    sequence: number | null;
};

type SaavnArtistURLs = {
    albums: string;
    bio: string;
    comments: string;
    songs: string;
    overview: string;
};

type SaavnArtistPlaylistApiResponse = SaavnArtistBaseAPIResponse & {
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

type SaavnSimilarArtistApiResponse = Omit<SaavnArtistBaseAPIResponse, 'role'> &
    SaavnSocialLinks & {
        languages: string | null;
        isRadioPresent: boolean;
        dominantType: string;
        aka: string;
        bio: string | null;
        similar: string | null;
    };

type SaavnSimilarArtist = Omit<SaavnArtistBase, 'role'> &
    SaavnSocialLinks & {
        languages: Record<string, string> | null;
        isRadioPresent: boolean;
        dominantType: string;
        aka: string;
        bio: string | null;
        similarArtists: { id: string; name: string }[] | null;
    };

export type SaavnArtistBase = {
    id: string;
    name: string;
    role?: string;
    type: string;
    image: SaavnImageLink[];
    url?: string;
};

export type SaavnArtistBaseAPIResponse = Omit<SaavnArtistBase, 'image' | 'url'> & {
    image: string;
    perma_url: string;
};

export type SaavnArtistAPIResponse = SaavnArtistBaseAPIResponse &
    SaavnSocialLinks & {
        artistId: string;
        subtitle: string;
        follower_count: string;
        isVerified: boolean;
        dominantLanguage: string;
        dominantType: string;
        topSongs: SaavnSongAPIResponse[];
        topAlbums: SaavnAlbumAPIResponse[];
        singles: SaavnSongAPIResponse[];
        dedicated_artist_playlist: SaavnArtistPlaylistApiResponse[];
        featured_artist_playlist: SaavnArtistPlaylistApiResponse[];
        similarArtists: SaavnSimilarArtistApiResponse[];
        isRadioPresent: boolean;
        bio: string;
        urls: SaavnArtistURLs;
        availableLanguages: string[];
        fan_count: string;
        topEpisodes: string[];
        is_followed: boolean;
    };

export type SaavnArtist = SaavnSocialLinks & {
    id: string;
    name: string;
    url: string;
    type: string;
    image: SaavnImageLink[];
    followerCount: number | null;
    fanCount: string | null;
    isVerified: boolean | null;
    dominantLanguage: string | null;
    dominantType: string | null;
    bio: SaavnBioBlock[] | null;
    availableLanguages: string[];
    isRadioPresent: boolean | null;
    topSongs: SaavnSong[] | null;
    topAlbums: SaavnAlbum[] | null;
    singles: SaavnSong[] | null;
    similarArtists: SaavnSimilarArtist[] | null;
};

export type SaavnArtistSongAPIResponse = {
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
        songs: SaavnSongAPIResponse[];
        total: number;
    };
};

export type SaavnArtistSong = {
    total: number;
    songs: SaavnSong[];
};

export type SaavnArtistAlbumAPIResponse = {
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
        albums: SaavnAlbumAPIResponse[];
        total: number;
    };
};

export type SaavnArtistAlbum = {
    total: number;
    albums: SaavnAlbum[];
};
