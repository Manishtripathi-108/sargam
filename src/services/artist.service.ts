import { SaavnProvider } from '../providers/saavn/saavn.provider';
import type { AlbumSummary } from '../types/core/album.model';
import type { Artist, ArtistSummary } from '../types/core/artist.model';
import type { SongSummary } from '../types/core/song.model';
import { AppError } from '../utils/error.utils';

type Provider = 'saavn';

interface ServiceOptions {
    provider?: Provider;
}

const providers = {
    saavn: SaavnProvider,
};

export class DefaultArtistService {
    async getArtistById(id: string, opts?: ServiceOptions): Promise<Artist> {
        const provider = providers[opts?.provider ?? 'saavn'];
        if (!provider) {
            throw new AppError(`Provider not found`, 500);
        }

        try {
            const artist = await provider.artists.getById(id);
            if (!artist) {
                throw new AppError('Artist not found', 404);
            }
            return artist;
        } catch (err: any) {
            if (err instanceof AppError) throw err;
            throw new AppError(`Failed to fetch artist: ${err?.message}`, 500);
        }
    }

    async getArtistByIdOrLink(params: { id?: string; link?: string }): Promise<Artist[]> {
        if (!params.id && !params.link) {
            throw new AppError('Either id or link is required', 400);
        }

        const provider = providers['saavn'];
        try {
            const artists = await provider.artists.getByIdOrLink(params);
            if (!artists || artists.length === 0) {
                throw new AppError('Artist not found', 404);
            }
            return artists;
        } catch (err: any) {
            if (err instanceof AppError) throw err;
            throw new AppError(`Failed to fetch artists: ${err?.message}`, 500);
        }
    }

    async searchArtists(
        query: string,
        limit: number = 20,
        offset: number = 0,
        opts?: ServiceOptions
    ): Promise<ArtistSummary[]> {
        const provider = providers[opts?.provider ?? 'saavn'];
        if (!provider) {
            throw new AppError(`Provider not found`, 500);
        }

        try {
            const page = Math.floor(offset / limit) + 1;
            const result = await provider.search.artists({ q: query, limit, offset, page });
            return (result.results || []).map((a: any) => ({
                id: a.id,
                name: a.name,
                genres: Array.isArray(a.genres) ? a.genres : [],
            }));
        } catch (err: any) {
            if (err instanceof AppError) throw err;
            throw new AppError(`Failed to search artists: ${err?.message}`, 500);
        }
    }

    async getArtistSongs(
        id: string,
        limit: number = 50,
        offset: number = 0,
        opts?: ServiceOptions
    ): Promise<SongSummary[]> {
        const provider = providers[opts?.provider ?? 'saavn'];
        if (!provider) {
            throw new AppError(`Provider not found`, 500);
        }

        try {
            // Verify artist exists first
            const artist = await provider.artists.getById(id);
            if (!artist) {
                throw new AppError('Artist not found', 404);
            }

            const page = Math.floor(offset / limit) + 1;
            const songs = await provider.artists.songs(id, page, limit);
            return (songs || []).map((s: any) => ({
                id: s.id,
                title: s.title || s.name,
                artists: Array.isArray(s.artists) ? s.artists.map((a: any) => a.name || a) : [],
                album: s.album?.name || s.album || '',
                duration: Number(s.duration || 0),
            }));
        } catch (err: any) {
            if (err instanceof AppError) throw err;
            throw new AppError(`Failed to fetch artist songs: ${err?.message}`, 500);
        }
    }

    async getArtistAlbums(
        id: string,
        limit: number = 50,
        offset: number = 0,
        opts?: ServiceOptions
    ): Promise<AlbumSummary[]> {
        const provider = providers[opts?.provider ?? 'saavn'];
        if (!provider) {
            throw new AppError(`Provider not found`, 500);
        }

        try {
            // Verify artist exists first
            const artist = await provider.artists.getById(id);
            if (!artist) {
                throw new AppError('Artist not found', 404);
            }

            const page = Math.floor(offset / limit) + 1;
            const albums = await provider.artists.albums(id, page, limit);
            return (albums || []).map((a: any) => ({
                id: a.id,
                title: a.title || a.name,
                artists: Array.isArray(a.artists) ? a.artists.map((ar: any) => ar.name || ar) : [],
                year: Number(a.year || 0),
            }));
        } catch (err: any) {
            if (err instanceof AppError) throw err;
            throw new AppError(`Failed to fetch artist albums: ${err?.message}`, 500);
        }
    }
}
