import { SaavnProvider } from '../providers/saavn/saavn.provider';
import type { Album } from '../types/core/album.model';
import type { Artist } from '../types/core/artist.model';
import type { Paginated } from '../types/core/pagination.model';
import type { Song } from '../types/core/song.model';
import { AppError, wrapError } from '../utils/error.utils';

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
        } catch (err: unknown) {
            return wrapError(err, 'Failed to fetch artist', 500);
        }
    }

    async getByLink(link: string, opts?: ServiceOptions): Promise<Artist> {
        if (!link) {
            throw new AppError('Artist link is required', 400);
        }

        const provider = this.getProvider(opts);

        try {
            return await provider.artists.getByLink(link);
        } catch (err: unknown) {
            return wrapError(err, 'Failed to fetch artist', 500);
        }
    }

    async getSongs({
        id,
        offset,
        limit,
        sortBy,
        sortOrder,
        opts,
    }: {
        id: string;
        offset: number;
        limit: number;
        sortBy: string;
        sortOrder: string;
        opts?: ServiceOptions;
    }): Promise<Paginated<Song>> {
        if (!id) {
            throw new AppError('Artist id is required', 400);
        }

        const provider = this.getProvider(opts);

        try {
            return await provider.artists.getSongs({ id, limit, offset, sortBy, sortOrder });
        } catch (err: unknown) {
            return wrapError(err, 'Failed to fetch artist songs', 500);
        }
    }

    async getAlbums({
        id,
        offset,
        limit,
        sortBy,
        sortOrder,
        opts,
    }: {
        id: string;
        offset: number;
        limit: number;
        sortBy: string;
        sortOrder: string;
        opts?: ServiceOptions;
    }): Promise<Paginated<Omit<Album, 'songs'>>> {
        if (!id) {
            throw new AppError('Artist id is required', 400);
        }

        const provider = this.getProvider(opts);

        try {
            return await provider.artists.getAlbums({ id, limit, offset, sortBy, sortOrder });
        } catch (err: unknown) {
            return wrapError(err, 'Failed to fetch artist albums', 500);
        }
    }
}
