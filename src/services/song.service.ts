import type { Song } from '../types/core/song.model';
import { AppError, wrapError } from '../utils/error.utils';
import { getProvider, type ServiceOptions } from '../utils/provider.util';

export async function getSongById(id: string, opts?: ServiceOptions): Promise<Song> {
    if (!id) {
        throw new AppError('Song id is required', 400);
    }

    try {
        const list = await getProvider(opts).songs.getByIds(id);
        return list[0];
    } catch (err) {
        return wrapError(err, 'Failed to fetch song', 500);
    }
}

export async function getSongsByIds(ids: string, opts?: ServiceOptions): Promise<Song[]> {
    try {
        return await getProvider(opts).songs.getByIds(ids);
    } catch (err) {
        return wrapError(err, 'Failed to fetch song', 500);
    }
}

export async function getSongByLink(link: string, opts?: ServiceOptions): Promise<Song> {
    if (!link) {
        throw new AppError('Link is required', 400);
    }

    try {
        return await getProvider(opts).songs.getByLink(link);
    } catch (err) {
        return wrapError(err, 'Failed to fetch song', 500);
    }
}

export async function getSongSuggestions(id: string, limit = 10, opts?: ServiceOptions): Promise<Song[]> {
    try {
        return await await getProvider(opts).songs.getSuggestions(id, limit);
    } catch (err) {
        return wrapError(err, 'Failed to fetch suggestions', 500);
    }
}
