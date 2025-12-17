export type SearchEntityType = 'song' | 'album' | 'artist' | 'playlist' | 'all';

export interface SearchResultItem {
    id: string;
    type: Exclude<SearchEntityType, 'all'>;
    title: string;
    snippet: string;
}

export interface SongSummary {
    id: string;
    title: string;
    artists: string[];
    album: string;
    duration: number;
}

export interface AlbumSummary {
    id: string;
    title: string;
    artists: string[];
    year: number;
}

export interface ArtistSummary {
    id: string;
    name: string;
    genres: string[];
}

export interface PlaylistSummary {
    id: string;
    title: string;
    ownerId: string;
}

export type AlbumTrackSummary = SongSummary;

export interface Album {
    id: string;
    title: string;
    artists: string[];
    tracks: AlbumTrackSummary[];
}

export interface SongAlbumInfo {
    id: string;
    title: string;
}

export interface Song {
    id: string;
    title: string;
    artists: string[];
    album: SongAlbumInfo;
    duration: number;
    streamingUrl?: string;
}

export interface Artist {
    id: string;
    name: string;
    bio?: string;
    genres: string[];
    topTracks: SongSummary[];
}
