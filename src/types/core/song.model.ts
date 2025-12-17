import { Prettify } from '../helper.type';
import type { AlbumBase } from './album.model';
import type { ArtistBase } from './artist.model';
import type { ImageAsset } from './image.model';

export type SongAudioQuality = 'low' | 'medium' | 'high' | 'lossless';

export type SongAudio = {
    low: string;
    medium: string;
    high: string;
    lossless?: string;
};

export type SongBase = {
    id: string;
    name: string;
    type: 'song';
    duration: number;
    explicit: boolean;
    language: string | null;
    disc_number: number;
    track_number: number;
    image: ImageAsset;
    release_date: string | null;
    year: number | null;
    copyright: string | null;
};

export type Song = Prettify<
    SongBase & {
        album: AlbumBase;
        artists: ArtistBase[];
        audio: SongAudio;
    }
>;
