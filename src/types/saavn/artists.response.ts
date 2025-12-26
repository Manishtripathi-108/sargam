/**
 * Saavn Artist Response Types
 */
import type { SaavnAlbumResponse } from './albums.response';
import type { SaavnArtistBaseResponse, SaavnArtistUrls, SaavnSocialLinks } from './common.types';
import type { SaavnSongResponse } from './song.response';

/**
 * Artist playlist item
 */
export type SaavnArtistPlaylistItem = SaavnArtistBaseResponse & {
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

/**
 * Similar artist reference
 */
export type SaavnArtistSimilarItem = Omit<SaavnArtistBaseResponse, 'role'> &
    SaavnSocialLinks & {
        languages: string | null;
        isRadioPresent: boolean;
        dominantType: string;
        aka: string;
        bio: string | null;
        similar: string | null;
    };

/**
 * Complete artist details response from Saavn API
 */
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
        dedicated_artist_playlist: SaavnArtistPlaylistItem[];
        featured_artist_playlist: SaavnArtistPlaylistItem[];
        similarArtists: SaavnArtistSimilarItem[];
        isRadioPresent: boolean;
        bio: string;
        urls: SaavnArtistUrls;
        availableLanguages: string[];
        fan_count: string;
        topEpisodes: string[];
        is_followed: boolean;
    };

/**
 * Artist songs response with pagination
 */
export type SaavnArtistSongsResponse = {
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

/**
 * Artist albums response with pagination
 */
export type SaavnArtistAlbumsResponse = {
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
