import { SaavnProvider } from '../providers/saavn/saavn.provider';
import type { Album } from '../types/core/album.model';
import type { Artist } from '../types/core/artist.model';
import type { Song } from '../types/core/song.model';
import { AppError } from '../utils/error.utils';

type Provider = 'saavn';

interface ServiceOptions {
    provider?: Provider;
}

const providers = {
    saavn: SaavnProvider,
};

export class DefaultArtistService {
    private getProvider(opts?: ServiceOptions) {
        const provider = providers[opts?.provider ?? 'saavn'];
        if (!provider) {
            throw new AppError('Provider not found', 500);
        }
        return provider;
    }

    async getById(id: string, opts?: ServiceOptions): Promise<Artist> {
        if (!id) {
            throw new AppError('Artist id is required', 400);
        }

        const provider = this.getProvider(opts);

        try {
            return await provider.artists.getById(id);
        } catch (err: any) {
            if (err instanceof AppError) throw err;
            throw new AppError(`Failed to fetch artist: ${err?.message}`, 500);
        }
    }

    async getByLink(link: string, opts?: ServiceOptions): Promise<Artist> {
        if (!link) {
            throw new AppError('Artist link is required', 400);
        }

        const provider = this.getProvider(opts);

        try {
            return await provider.artists.getByLink(link);
        } catch (err: any) {
            if (err instanceof AppError) throw err;
            throw new AppError(`Failed to fetch artist: ${err?.message}`, 500);
        }
    }

    async getSongs(
        id: string,
        offset: number,
        limit: number,
        sortBy: string,
        sortOrder: string,
        opts?: ServiceOptions
    ): Promise<{ total: number; songs: Song[] }> {
        if (!id) {
            throw new AppError('Artist id is required', 400);
        }

        const page = Math.floor(offset / limit) + 1;
        const provider = this.getProvider(opts);

        try {
            return await provider.artists.getSongs(id, page, sortBy, sortOrder);
        } catch (err: any) {
            if (err instanceof AppError) throw err;
            throw new AppError(`Failed to fetch artist songs: ${err?.message}`, 500);
        }
    }

    async getAlbums(
        id: string,
        offset: number,
        limit: number,
        sortBy: string,
        sortOrder: string,
        opts?: ServiceOptions
    ): Promise<{ total: number; albums: Omit<Album, 'songs'>[] }> {
        if (!id) {
            throw new AppError('Artist id is required', 400);
        }

        const page = Math.floor(offset / limit) + 1;
        const provider = this.getProvider(opts);

        try {
            return await provider.artists.getAlbums(id, page, sortBy, sortOrder);
        } catch (err: any) {
            if (err instanceof AppError) throw err;
            throw new AppError(`Failed to fetch artist albums: ${err?.message}`, 500);
        }
    }
}
