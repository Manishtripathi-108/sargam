import type { Album } from '../types/core/album.model';
import { AppError, wrapError } from '../utils/error.utils';
import { resolveProvider, type ServiceOptions } from '../utils/provider.utils';

export async function getAlbumById(id: string, opts: ServiceOptions): Promise<Album> {
    if (!id) {
        throw new AppError('Album id is required', 400);
    }

    try {
        return await resolveProvider(opts).albums.getById(id);
    } catch (err) {
        return wrapError(err, 'Failed to fetch album', 500);
    }
}

export async function getAlbumByLink(link: string, opts: ServiceOptions): Promise<Album> {
    if (!link) {
        throw new AppError('Album link is required', 400);
    }

    try {
        return await resolveProvider(opts).albums.getByLink(link);
    } catch (err) {
        return wrapError(err, 'Failed to fetch album', 500);
    }
}
