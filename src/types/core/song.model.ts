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
    image: ImageAsset;
    year: number | null;
    album: string;
    artists: string;
};

export type Song = Prettify<
    Omit<SongBase, 'album' | 'artists'> & {
        disc_number: number;
        track_number: number;
        release_date: string | null;
        copyright: string | null;
        album: AlbumBase;
        artists: ArtistBase[];
        audio: SongAudio;
    }
>;
