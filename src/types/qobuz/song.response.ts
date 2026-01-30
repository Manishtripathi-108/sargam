import type { QobuzSearchTrackAlbum, QobuzTrackAlbum } from './album.response';
import type {
    QobuzAudioInfo,
    QobuzAudioQuality,
    QobuzAvailability,
    QobuzPerformer,
    QobuzReleaseDates,
} from './common.types';

type QobuzTrackBase = QobuzAudioQuality &
    QobuzAvailability &
    QobuzReleaseDates & {
        id: number;
        title: string;
        version?: string;
        duration: number;
        track_number: number;
        media_number: number;
        isrc: string;
        parental_warning: boolean;
        copyright: string;
        performers: string;
        audio_info: QobuzAudioInfo;
        performer: QobuzPerformer;
        composer: QobuzPerformer;
    };

export type QobuzSearchTrack = QobuzTrackBase & {
    maximum_bit_depth: number;
    album: QobuzSearchTrackAlbum;
};

export type QobuzTrack = QobuzTrackBase & {
    created_at: number;
    indexed_at: number;
    work?: string;
    album: QobuzTrackAlbum;
};
