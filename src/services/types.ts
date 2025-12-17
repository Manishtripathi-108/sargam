import type {
    Album,
    AlbumSummary,
    Artist,
    ArtistSummary,
    PlaylistSummary,
    SearchEntityType,
    SearchResultItem,
    Song,
    SongSummary,
} from '../types/music.types';

export interface SearchService {
    globalSearch(params: { q: string; type?: SearchEntityType; limit: number; offset: number }): Promise<{
        meta: { total: number; limit: number; offset: number };
        results: SearchResultItem[];
    }>;
    searchSongs(params: { q: string; limit: number; offset: number }): Promise<SongSummary[]>;
    searchAlbums(params: { q: string; limit: number; offset: number }): Promise<AlbumSummary[]>;
    searchArtists(params: { q: string; limit: number; offset: number }): Promise<ArtistSummary[]>;
    searchPlaylists(params: { q: string; limit: number; offset: number }): Promise<PlaylistSummary[]>;
}

export interface SongService {
    getSongsByIdOrLink(params: { id?: string; link?: string }): Promise<Song[]>;
    getSongById(id: string): Promise<Song>;
    getSongSuggestions(params: { id: string; limit: number }): Promise<SongSummary[]>;
}

export interface AlbumService {
    getAlbumByIdOrLink(params: { id?: string; link?: string }): Promise<Album>;
    getAlbumById(id: string): Promise<Album>;
}

export interface ArtistService {
    getArtistsByIdOrLink(params: { id?: string; link?: string }): Promise<Artist[]>;
    getArtistById(id: string): Promise<Artist>;
    getArtistSongs(params: { id: string; limit: number; offset: number }): Promise<SongSummary[]>;
    getArtistAlbums(params: { id: string; limit: number; offset: number }): Promise<AlbumSummary[]>;
}

export interface Services {
    searchService: SearchService;
    songService: SongService;
    albumService: AlbumService;
    artistService: ArtistService;
}
