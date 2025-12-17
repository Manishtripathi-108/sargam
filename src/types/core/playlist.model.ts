import { Prettify } from '../helper.type';
import type { ImageAsset } from './image.model';
import type { Song } from './song.model';

export type PlaylistBase = {
    id: string;
    name: string;
    description: string | null;
    type: 'playlist';
    explicit: boolean;
    image: ImageAsset;
    total_songs: number;
};

export type Playlist = Prettify<
    PlaylistBase & {
        songs: Song[] | null;
    }
>;
