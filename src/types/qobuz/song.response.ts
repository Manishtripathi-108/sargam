/**
 * Qobuz Song/Track Response Types
 */
import type { QobuzSearchTrackAlbum, QobuzTrackAlbum } from './album.response';
import type {
    QobuzAudioInfo,
    QobuzAudioQuality,
    QobuzAvailability,
    QobuzPerformer,
    QobuzReleaseDates,
} from './common.types';

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

export type QobuzTrack = QobuzAudioQuality &
    QobuzAvailability &
    QobuzReleaseDates & {
        album: QobuzTrackAlbum;
        created_at: number;
        indexed_at: number;
        id: number;
        isrc: string;
        parental_warning: boolean;
        track_number: number;
        media_number: number;
        duration: number;
        title: string;
        performers: string;
        version?: string;
        copyright: string;
        work?: string;
        audio_info: QobuzAudioInfo;
        performer: QobuzPerformer;
        composer: QobuzPerformer;
    };
