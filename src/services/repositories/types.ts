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
} from '../../types/music.types';

export interface MusicRepository {
    search(params: { q: string; type?: SearchEntityType; limit: number; offset: number }): Promise<{
        total: number;
        results: SearchResultItem[];
    }>;
    searchSongs(params: { q: string; limit: number; offset: number }): Promise<SongSummary[]>;
    searchAlbums(params: { q: string; limit: number; offset: number }): Promise<AlbumSummary[]>;
    searchArtists(params: { q: string; limit: number; offset: number }): Promise<ArtistSummary[]>;
    searchPlaylists(params: { q: string; limit: number; offset: number }): Promise<PlaylistSummary[]>;
    findSongsByIdOrLink(params: { id?: string; link?: string }): Promise<Song[]>;
    findSongById(id: string): Promise<Song | null>;
    findSongSuggestions(id: string, limit: number): Promise<SongSummary[]>;
    findAlbumByIdOrLink(params: { id?: string; link?: string }): Promise<Album | null>;
    findArtistsByIdOrLink(params: { id?: string; link?: string }): Promise<Artist[]>;
    findArtistById(id: string): Promise<Artist | null>;
    findSongsByArtist(params: { id: string; limit: number; offset: number }): Promise<SongSummary[]>;
    findAlbumsByArtist(params: { id: string; limit: number; offset: number }): Promise<AlbumSummary[]>;
}
