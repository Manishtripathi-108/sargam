import type {
    Album,
    Artist,
    PlaylistSummary,
    SearchEntityType,
    SearchResultItem,
    Song,
    SongSummary,
} from '../../types/music.types';
import type { MusicRepository } from './types';

const songs: Song[] = [
    {
        id: 'song-1',
        title: 'Morning Raga',
        artists: ['Asha Verma'],
        album: { id: 'album-1', title: 'Sunrise Sessions' },
        duration: 215,
        streamingUrl: 'https://stream.example.com/songs/song-1',
    },
    {
        id: 'song-2',
        title: 'City Lights',
        artists: ['Rohan Iyer', 'Kavya Mehta'],
        album: { id: 'album-2', title: 'Neon Nights' },
        duration: 198,
        streamingUrl: 'https://stream.example.com/songs/song-2',
    },
    {
        id: 'song-3',
        title: 'Desert Bloom',
        artists: ['Asha Verma'],
        album: { id: 'album-3', title: 'Mirage' },
        duration: 240,
    },
];

const albums: Album[] = [
    {
        id: 'album-1',
        title: 'Sunrise Sessions',
        artists: ['Asha Verma'],
        tracks: [
            { id: 'song-1', title: 'Morning Raga', artists: ['Asha Verma'], album: 'Sunrise Sessions', duration: 215 },
            { id: 'song-4', title: 'Dawn Chorus', artists: ['Asha Verma'], album: 'Sunrise Sessions', duration: 189 },
        ],
    },
    {
        id: 'album-2',
        title: 'Neon Nights',
        artists: ['Rohan Iyer', 'Kavya Mehta'],
        tracks: [
            {
                id: 'song-2',
                title: 'City Lights',
                artists: ['Rohan Iyer', 'Kavya Mehta'],
                album: 'Neon Nights',
                duration: 198,
            },
            { id: 'song-5', title: 'Afterhours', artists: ['Rohan Iyer'], album: 'Neon Nights', duration: 210 },
        ],
    },
];

const albumYears: Record<string, number> = {
    'album-1': 2022,
    'album-2': 2023,
    'album-3': 2021,
};

const albumLinks: Record<string, string> = {
    'album-1': 'https://music.example.com/album/sunrise-sessions',
    'album-2': 'https://music.example.com/album/neon-nights',
};

const artists: Artist[] = [
    {
        id: 'artist-1',
        name: 'Asha Verma',
        bio: 'Known for blending classical motifs with modern ambient textures.',
        genres: ['Classical', 'Ambient'],
        topTracks: [
            { id: 'song-1', title: 'Morning Raga', artists: ['Asha Verma'], album: 'Sunrise Sessions', duration: 215 },
            { id: 'song-3', title: 'Desert Bloom', artists: ['Asha Verma'], album: 'Mirage', duration: 240 },
        ],
    },
    {
        id: 'artist-2',
        name: 'Rohan Iyer',
        genres: ['Electronic'],
        topTracks: [
            {
                id: 'song-2',
                title: 'City Lights',
                artists: ['Rohan Iyer', 'Kavya Mehta'],
                album: 'Neon Nights',
                duration: 198,
            },
        ],
    },
];

const artistLinks: Record<string, string> = {
    'artist-1': 'https://music.example.com/artist/asha-verma',
    'artist-2': 'https://music.example.com/artist/rohan-iyer',
};

const playlists: PlaylistSummary[] = [
    { id: 'playlist-1', title: 'Focus Flow', ownerId: 'user-1' },
    { id: 'playlist-2', title: 'Late Night Drive', ownerId: 'user-2' },
];

const toSongSummary = (song: Song): SongSummary => ({
    id: song.id,
    title: song.title,
    artists: song.artists,
    album: song.album.title,
    duration: song.duration,
});

const includesCaseInsensitive = (source: string, term: string) => source.toLowerCase().includes(term.toLowerCase());

export class InMemoryMusicRepository implements MusicRepository {
    // Replace with DB-backed queries in production.

    async search(params: { q: string; type?: SearchEntityType; limit: number; offset: number }) {
        const { q, type, limit, offset } = params;
        const targets: SearchEntityType[] = type && type !== 'all' ? [type] : ['song', 'album', 'artist', 'playlist'];
        const results: SearchResultItem[] = [];

        if (targets.includes('song')) {
            songs.forEach((song) => {
                if (includesCaseInsensitive(song.title, q)) {
                    results.push({ id: song.id, type: 'song', title: song.title, snippet: song.artists.join(', ') });
                }
            });
        }

        if (targets.includes('album')) {
            albums.forEach((album) => {
                if (includesCaseInsensitive(album.title, q)) {
                    results.push({
                        id: album.id,
                        type: 'album',
                        title: album.title,
                        snippet: album.artists.join(', '),
                    });
                }
            });
        }

        if (targets.includes('artist')) {
            artists.forEach((artist) => {
                if (includesCaseInsensitive(artist.name, q)) {
                    results.push({
                        id: artist.id,
                        type: 'artist',
                        title: artist.name,
                        snippet: artist.genres.join(', '),
                    });
                }
            });
        }

        if (targets.includes('playlist')) {
            playlists.forEach((playlist) => {
                if (includesCaseInsensitive(playlist.title, q)) {
                    results.push({
                        id: playlist.id,
                        type: 'playlist',
                        title: playlist.title,
                        snippet: `Owner: ${playlist.ownerId}`,
                    });
                }
            });
        }

        const paged = results.slice(offset, offset + limit);
        return { total: results.length, results: paged };
    }

    async searchSongs(params: { q: string; limit: number; offset: number }) {
        const { q, limit, offset } = params;
        const filtered = songs.filter(
            (song) => includesCaseInsensitive(song.title, q) || song.artists.some((a) => includesCaseInsensitive(a, q))
        );
        return filtered.slice(offset, offset + limit).map(toSongSummary);
    }

    async searchAlbums(params: { q: string; limit: number; offset: number }) {
        const { q, limit, offset } = params;
        const filtered = albums.filter((album) => includesCaseInsensitive(album.title, q));
        return filtered.slice(offset, offset + limit).map((album) => ({
            id: album.id,
            title: album.title,
            artists: album.artists,
            year: albumYears[album.id] ?? new Date().getFullYear(),
        }));
    }

    async searchArtists(params: { q: string; limit: number; offset: number }) {
        const { q, limit, offset } = params;
        const filtered = artists.filter((artist) => includesCaseInsensitive(artist.name, q));
        return filtered
            .slice(offset, offset + limit)
            .map((artist) => ({ id: artist.id, name: artist.name, genres: artist.genres }));
    }

    async searchPlaylists(params: { q: string; limit: number; offset: number }) {
        const { q, limit, offset } = params;
        const filtered = playlists.filter((playlist) => includesCaseInsensitive(playlist.title, q));
        return filtered.slice(offset, offset + limit);
    }

    async findSongsByIdOrLink(params: { id?: string; link?: string }) {
        const { id, link } = params;
        const filtered = songs.filter((song) => song.id === id || (link && song.streamingUrl?.includes(link)));
        return filtered;
    }

    async findSongById(id: string) {
        return songs.find((song) => song.id === id) ?? null;
    }

    async findSongSuggestions(id: string, limit: number) {
        const base = songs.find((song) => song.id === id);
        if (!base) return [];

        const sameArtist = songs.filter((song) => song.id !== id && song.artists.some((a) => base.artists.includes(a)));
        const fallback = songs.filter((song) => song.id !== id);
        const pool = sameArtist.length > 0 ? sameArtist : fallback;
        return pool.slice(0, limit).map(toSongSummary);
    }

    async findAlbumByIdOrLink(params: { id?: string; link?: string }) {
        const { id, link } = params;
        const foundById = id ? albums.find((album) => album.id === id) : undefined;
        if (foundById) return foundById;
        if (link) {
            const match = Object.entries(albumLinks).find(([, l]) => l.includes(link));
            if (match) {
                const albumId = match[0];
                return albums.find((album) => album.id === albumId) ?? null;
            }
        }
        return null;
    }

    async findArtistsByIdOrLink(params: { id?: string; link?: string }) {
        const { id, link } = params;
        const fromId = id ? artists.filter((artist) => artist.id === id) : [];
        const fromLink = link
            ? artists.filter((artist) =>
                  Object.entries(artistLinks).some(([k, v]) => k === artist.id && v.includes(link!))
              )
            : [];
        const merged = [...fromId, ...fromLink];
        const unique = Array.from(new Map(merged.map((a) => [a.id, a])).values());
        return unique;
    }

    async findArtistById(id: string) {
        return artists.find((artist) => artist.id === id) ?? null;
    }

    async findSongsByArtist(params: { id: string; limit: number; offset: number }) {
        const { id, limit, offset } = params;
        const artist = artists.find((a) => a.id === id);
        if (!artist) return [];
        const filtered = songs.filter((song) => song.artists.some((a) => artist.name === a || a === artist.id));
        return filtered.slice(offset, offset + limit).map(toSongSummary);
    }

    async findAlbumsByArtist(params: { id: string; limit: number; offset: number }) {
        const { id, limit, offset } = params;
        const artist = artists.find((a) => a.id === id);
        if (!artist) return [];
        const filtered = albums.filter((album) => album.artists.includes(artist.name));
        return filtered.slice(offset, offset + limit).map((album) => ({
            id: album.id,
            title: album.title,
            artists: album.artists,
            year: albumYears[album.id] ?? new Date().getFullYear(),
        }));
    }
}
