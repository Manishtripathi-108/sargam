import type { Album } from './album.model';
import type { Artist } from './artist.model';
import type { ImageAsset } from './image.model';
import type { Playlist } from './playlist.model';
import type { SongBase } from './song.model';

export type SearchResult<T> = {
    position: number | null;
    results: T[];
};

export type SearchBase = {
    id: string;
    name: string;
    image: ImageAsset;
    type: 'song' | 'album' | 'artist' | 'playlist';
};

export type GlobalSearchResult = {
    topQuery: SearchResult<SearchBase>;
    artists: SearchResult<SearchBase>;
    playlists: SearchResult<SearchBase>;
    songs: SearchResult<SearchBase & { artists: string; album: string }>;
    albums: SearchResult<SearchBase & { artists: string }>;
};

export type SearchPlaylist = {
    total: number;
    start: number;
    results: Omit<Playlist, 'songs' | 'description'>[];
};

export type SearchArtist = {
    total: number;
    start: number;
    results: Omit<Artist, 'bio' | 'follower_count'>[];
};

export type SearchAlbum = {
    total: number;
    start: number;
    results: Omit<Album, 'songs' | 'popularity' | 'total_songs' | 'artists'>[];
};

export type SearchSong = {
    total: number;
    start: number;
    results: SongBase[];
};
