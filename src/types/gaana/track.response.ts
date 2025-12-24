import type {
    GaanaArtist,
    GaanaArtistDetail,
    GaanaBitrateMap,
    GaanaComposer,
    GaanaFaq,
    GaanaGenre,
    GaanaLoudness,
    GaanaOperator,
    GaanaPerson,
    GaanaPreviewUrl,
    GaanaStreamUrls,
    GaanaTag,
    GaanaTrackFormat,
} from './common';

/**
 * Song detail bucket response
 * Used after fetching seokeys from search
 */
export type GaanaSongResponse = {
    count: number;
    tracks: GaanaSongDetail[];
    'user-token-status': number;
    user_token_status: number;
    status: number;
    status_code: number;
};

/**
 * Complete track/song details response from Gaana API
 */
export type GaanaSongDetail = {
    track_id: string;
    seokey: string;
    track_title: string;
    track_title_trans?: string;

    album_id: string;
    album_title: string;
    albumseokey: string;

    language: string;
    secondary_language?: string;
    language_id: string;

    duration: string;
    isrc: string;

    artwork: string;
    artwork_web: string;
    artwork_large: string;
    atw?: string;

    popularity: string;
    rating: string;
    play_ct: string;
    total_favourite_count: number;
    total_downloads: number;

    release_date: string;
    release_status: number;

    is_most_popular: number;
    is_premium: number;
    premium_content: string;

    mobile: number;
    country: number;
    vendor: string;
    vendor_name: string;
    vendor_seokey: string;
    parent_vendor_name?: string;
    parent_vendor_seoKey?: string;

    cached: number;
    podcastNoIndex: number;
    parental_warning: number;

    stream_type: string;
    content_source: string;

    artist: GaanaArtist[];
    artist_detail?: GaanaArtistDetail[];

    cast?: GaanaPerson[];
    lyricist?: GaanaPerson[];
    composer?: GaanaComposer[];

    gener: GaanaGenre[];
    tags?: GaanaTag[];

    urls: GaanaStreamUrls;
    preview_url?: GaanaPreviewUrl;

    track_format: GaanaTrackFormat | { [key: string]: GaanaBitrateMap };

    faq_details_response?: GaanaFaq[];
    loudness?: GaanaLoudness;

    operator?: GaanaOperator[];
    operators?: GaanaOperator[];

    lyrics_url?: string;
    youtube_id?: string;
    description?: string;

    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;
    meta_h1_tag?: string;

    vgid: string;
    rest_lev: string;
    vert_priority: number;
    modified_on_solr: string;

    // Additional fields found in album track listings
    rtmp?: string;
    http?: string;
    https?: string;
    rtsp?: string;
    display_global?: string;
    is_local?: number;
    sap_id?: string;
    lyrics_type?: string | null;
    download_enabled?: number;
    av_ad?: number;
    is_dolby?: number;
    vendor_rest_lev?: string;
    ppd?: number;
    user_favorite?: number;
    user_rating?: number;
};
