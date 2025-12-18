import { Prettify } from '../helper.types';
import type { ArtistBase } from './artist.model';
import type { ImageAsset } from './image.model';
import type { SongBase } from './song.model';

export type AlbumType = 'single' | 'album' | 'compilation';

export type AlbumBase = {
    id: string;
    name: string;
    type: AlbumType;
};

export type Album = Prettify<
    AlbumBase & {
        image: ImageAsset;
        language?: string | null;
        artists: ArtistBase[];
        songs: SongBase[];
        popularity: number;
        release_date: string;
        explicit: boolean;
        total_songs: number;
    }
>;
