import { SaavnProvider } from '../providers/saavn/saavn.provider';
import type { Album, AlbumSummary } from '../types/core/album.model';
import { AppError } from '../utils/error.utils';

type Provider = 'saavn';

interface ServiceOptions {
    provider?: Provider;
}

const providers = {
    saavn: SaavnProvider,
};

export class DefaultAlbumService {
    async getAlbumById(id: string, opts?: ServiceOptions): Promise<Album> {
        const provider = providers[opts?.provider ?? 'saavn'];
        if (!provider) {
            throw new AppError(`Provider not found`, 500);
        }

        try {
            const album = await provider.albums.getById(id);
            if (!album) {
                throw new AppError('Album not found', 404);
            }
            return album;
        } catch (err: any) {
            if (err instanceof AppError) throw err;
            throw new AppError(`Failed to fetch album: ${err?.message}`, 500);
        }
    }

    async getAlbumByIdOrLink(params: { id?: string; link?: string }): Promise<Album> {
        if (!params.id && !params.link) {
            throw new AppError('Either id or link is required', 400);
        }

        const provider = providers['saavn'];
        try {
            const album = await provider.albums.getByIdOrLink(params);
            if (!album) {
                throw new AppError('Album not found', 404);
            }
            return album;
        } catch (err: any) {
            if (err instanceof AppError) throw err;
            throw new AppError(`Failed to fetch album: ${err?.message}`, 500);
        }
    }

    async searchAlbums(
        query: string,
        limit: number = 20,
        offset: number = 0,
        opts?: ServiceOptions
    ): Promise<AlbumSummary[]> {
        const provider = providers[opts?.provider ?? 'saavn'];
        if (!provider) {
            throw new AppError(`Provider not found`, 500);
        }

        try {
            const page = Math.floor(offset / limit) + 1;
            const result = await provider.search.albums({ q: query, limit, offset, page });
            return (result.results || []).map((a: any) => ({
                id: a.id,
                title: a.title || a.name,
                artists: Array.isArray(a.artists) ? a.artists.map((ar: any) => ar.name || ar) : [],
                year: Number(a.year || 0),
            }));
        } catch (err: any) {
            if (err instanceof AppError) throw err;
            throw new AppError(`Failed to search albums: ${err?.message}`, 500);
        }
    }
}
