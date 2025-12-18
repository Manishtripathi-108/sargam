import { SaavnProvider } from '../providers/saavn/saavn.provider';
import type { Album } from '../types/core/album.model';
import { AppError } from '../utils/error.utils';

type Provider = 'saavn';

interface ServiceOptions {
    provider?: Provider;
}

const providers = {
    saavn: SaavnProvider,
};

export class DefaultAlbumService {
    private getProvider(opts?: ServiceOptions) {
        const provider = providers[opts?.provider ?? 'saavn'];
        if (!provider) {
            throw new AppError('Provider not found', 500);
        }
        return provider;
    }

    async getById(id: string, opts?: ServiceOptions): Promise<Album> {
        if (!id) {
            throw new AppError('Album id is required', 400);
        }

        const provider = this.getProvider(opts);

        try {
            return await provider.albums.getById(id);
        } catch (err: any) {
            if (err instanceof AppError) throw err;
            throw new AppError(`Failed to fetch album: ${err?.message}`, 500);
        }
    }

    async getByLink(link: string, opts?: ServiceOptions): Promise<Album> {
        if (!link) {
            throw new AppError('Album link is required', 400);
        }

        const provider = this.getProvider(opts);

        try {
            return await provider.albums.getByLink(link);
        } catch (err: any) {
            if (err instanceof AppError) throw err;
            throw new AppError(`Failed to fetch album: ${err?.message}`, 500);
        }
    }
}
