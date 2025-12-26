import type { Playlist } from '../types/core/playlist.model';
import { AppError, wrapError } from '../utils/error.utils';
import { resolveProvider, type ServiceOptions } from '../utils/provider.utils';

export async function getPlaylistById(id: string, opts: ServiceOptions): Promise<Playlist> {
    if (!id) {
        throw new AppError('Playlist id is required', 400);
    }

    try {
        return await resolveProvider(opts).playlists.getById(id);
    } catch (err) {
        return wrapError(err, 'Failed to fetch playlist', 500);
    }
}

export async function getPlaylistByLink(link: string, opts: ServiceOptions): Promise<Playlist> {
    if (!link) {
        throw new AppError('Playlist link is required', 400);
    }

    try {
        return await resolveProvider(opts).playlists.getByLink(link);
    } catch (err) {
        return wrapError(err, 'Failed to fetch playlist', 500);
    }
}
