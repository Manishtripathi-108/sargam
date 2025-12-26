/**
 * Gaana Album Response Types
 */
import type { GaanaArtistBase, GaanaComposer, GaanaCustomArtworks, GaanaFaq, GaanaGenre } from './common.types';
import type { GaanaSongArtistDetail, GaanaSongItem } from './track.response';

/**
 * Complete album details response from Gaana API
 */
export type GaanaAlbumResponse = {
    tracks: GaanaSongItem[];
    count: string;
    status: number;
    custom_artworks: GaanaCustomArtworks;
    release_year: string;
    favorite_count: string;
    'user-token-status'?: string;
    user_token_status?: string;
    album: GaanaAlbumItem;
    composers?: GaanaComposer[];
    cached: number;
    parental_warning: number;
    atw: string;
    artist_detail: GaanaSongArtistDetail[];
    template?: string;
    faq_details_response: GaanaFaq[];
    is_sponsored: number;
};

/**
 * Album metadata within album details response
 */
export type GaanaAlbumItem = {
    seokey: string;
    title: string;
    language: string;
    rating: string;
    duration: string;
    artwork: string;
    artist: GaanaAlbumArtist[];
    mobile: number;
    country: number;
    month: number;
    day: number;
    year: number;
    status: string;
    album_id: string;
    release_date: string;
    trackcount: string;
    recordlevel: string;
    primaryartist: GaanaAlbumArtist[];
    gener?: GaanaGenre[];
    trackids: string;
    custom_artworks: GaanaCustomArtworks;
    favorite_count: string;
    premium_content: string;
    user_favorite: number;
    vendor: string;
    cached: number;
    parental_warning: number;
    atw: string;
    is_sponsored: number;
    al_play_ct: string;
    is_notification_subscribed: number;
    detailed_description: string;
    vendor_seokey: string;
    vendor_name: string;
    parent_vendor_seoKey: string;
    parent_vendor_name: string;
};

/**
 * Album artist reference
 */
export type GaanaAlbumArtist = GaanaArtistBase & {
    atw: string;
    cached: number;
    popularity: number;
    isWebp: number;
    favorite_count: string;
};
