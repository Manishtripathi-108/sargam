/**
 * Qobuz Song/Track Response Types
 */
import type { QobuzSearchTrackAlbum } from './album.response';
import type {
    QobuzAudioInfo,
    QobuzAudioQuality,
    QobuzAvailability,
    QobuzPaginatedList,
    QobuzPerformer,
    QobuzReleaseDates,
} from './common.types';

/**
 * Full track response
 */
export type QobuzTrack = QobuzAudioQuality & {
    id: number;
    title: string;
    version?: string;
    duration: number;
    track_number: number;
    media_number: number;
    isrc: string;
    copyright?: string;
    release_date_original?: string;
    performer: QobuzPerformer;
    album: QobuzSearchTrackAlbum;
};

/**
 * Track in search context (includes nested album artist)
 */
export type QobuzSearchTrack = QobuzAudioQuality &
    QobuzAvailability &
    QobuzReleaseDates & {
        id: number;
        title: string;
        version?: string;
        duration: number;
        track_number: number;
        isrc: string;
        parental_warning: boolean;
        media_number: number;
        audio_info: QobuzAudioInfo;
        performer: QobuzPerformer;
        maximum_bit_depth: number;
        copyright: string;
        performers: string;
        composer: QobuzPerformer;
        album: QobuzSearchTrackAlbum;
    };

/**
 * Track search response
 */
export type QobuzTrackSearchResponse = {
    query: string;
    tracks: QobuzPaginatedList<QobuzSearchTrack>;
};
