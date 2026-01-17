import type {
    QobuzArtistBase,
    QobuzAudioQuality,
    QobuzAvailability,
    QobuzGenre,
    QobuzImage,
    QobuzLabel,
    QobuzPaginatedList,
    QobuzReleaseDates,
} from './common.types';
import type { QobuzSearchTrack } from './song.response';

/**
 * Full album response
 */
export type QobuzAlbum = QobuzAudioQuality &
    QobuzAlbumAdditionalDetails &
    QobuzAvailability &
    QobuzReleaseDates & {
        id: string;
        qobuz_id: number;
        title: string;
        version?: string;
        duration: number;
        tracks_count: number;
        media_count: number;
        copyright?: string;
        upc: string;
        url: string;
        image: QobuzImage;
        artist: QobuzArtistBase;
        artists: {
            id: number;
            name: string;
            roles: string[];
        };
        label: QobuzLabel;
        genre: QobuzGenre;
        parental_warning: boolean;
        tracks: QobuzPaginatedList<Omit<QobuzSearchTrack, 'album'>>;
        released_at: number;
        genres_list?: string[];
    };

type QobuzAlbumAdditionalDetails = {
    description?: string;
    description_language?: string;
    catchline?: string;
    composer: QobuzArtistBase;
    created_at: number;
    genres_list: string[];
    is_official: boolean;
    maximum_technical_specifications: string;
    product_sales_factors_monthly: number;
    product_sales_factors_weekly: number;
    product_sales_factors_yearly: number;
    product_type: string;
    product_url: string;
    recording_information: string;
    relative_url: string;
    release_tags: string[];
    release_type: string;
    subtitle: string;
};

export type QobuzSearchAlbum = QobuzAudioQuality &
    QobuzAvailability &
    QobuzReleaseDates & {
        id: string;
        qobuz_id: number;
        title: string;
        version?: string;
        duration: number;
        tracks_count: number;
        media_count: number;
        copyright?: string;
        upc: string;
        url: string;
        image: QobuzImage;
        artist: QobuzArtistBase;
        artists: {
            id: number;
            name: string;
            roles: string[];
        };
        label: QobuzLabel;
        genre: QobuzGenre;
        popularity: number;
        parental_warning: boolean;
        released_at: number;
    };

/**
 * Simplified album info used in track/artist contexts
 */
export type QobuzSearchTrackAlbum = Omit<QobuzAlbum, 'tracks' | 'artists'>;

export type QobuzTrackAlbum = Omit<QobuzAlbum, 'tracks' | 'artists' | keyof QobuzAlbumAdditionalDetails>;

/**
 * Album in artist context (simplified)
 */
export type QobuzArtistAlbum = {
    id: string;
    title: string;
    duration: number;
    tracks_count: number;
    release_date_original?: string;
    hires: boolean;
    hires_streamable: boolean;
    image: QobuzImage;
};
