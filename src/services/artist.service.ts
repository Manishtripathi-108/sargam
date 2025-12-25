import type { Album } from '../types/core/album.model';
import type { Artist } from '../types/core/artist.model';
import type { Paginated } from '../types/core/pagination.model';
import type { Song } from '../types/core/song.model';
import { AppError, wrapError } from '../utils/error.utils';
import { getProvider, type ServiceOptions } from '../utils/provider.util';
import type { SortBy, SortOrder } from '../validators/common.validators';

export async function getArtistById(id: string, opts?: ServiceOptions): Promise<Artist> {
    if (!id) {
        throw new AppError('Artist id is required', 400);
    }

    try {
        return await getProvider(opts).artists.getById(id);
    } catch (err) {
        return wrapError(err, 'Failed to fetch artist', 500);
    }
}

export async function getArtistByLink(link: string, opts?: ServiceOptions): Promise<Artist> {
    if (!link) {
        throw new AppError('Artist link is required', 400);
    }

    try {
        return await getProvider(opts).artists.getByLink(link);
    } catch (err) {
        return wrapError(err, 'Failed to fetch artist', 500);
    }
}

export async function getArtistSongs(params: {
    id: string;
    offset: number;
    limit: number;
    sortBy: SortBy;
    sortOrder: SortOrder;
    opts?: ServiceOptions;
}): Promise<Paginated<Song>> {
    if (!params.id) {
        throw new AppError('Artist id is required', 400);
    }

    try {
        return await getProvider(params.opts).artists.getSongs(params);
    } catch (err) {
        return wrapError(err, 'Failed to fetch artist songs', 500);
    }
}

export async function getArtistAlbums(params: {
    id: string;
    offset: number;
    limit: number;
    sortBy: SortBy;
    sortOrder: SortOrder;
    opts?: ServiceOptions;
}): Promise<Paginated<Omit<Album, 'songs'>>> {
    if (!params.id) {
        throw new AppError('Artist id is required', 400);
    }

    try {
        return await getProvider(params.opts).artists.getAlbums(params);
    } catch (err) {
        return wrapError(err, 'Failed to fetch artist albums', 500);
    }
}
