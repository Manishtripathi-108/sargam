import { SaavnProvider } from '../providers/saavn/saavn.provider';
import type { Song } from '../types/core/song.model';
import { AppError, wrapError } from '../utils/error.utils';

type Provider = 'saavn';

interface ServiceOptions {
    provider?: Provider;
}

const providers = {
    saavn: SaavnProvider,
};

export class DefaultSongService {
    async getById(id: string, opts?: ServiceOptions): Promise<Song> {
        const provider = providers[opts?.provider ?? 'saavn'];
        if (!provider) {
            throw new AppError(`Provider not found`, 500);
        }

        try {
            const songs = await provider.songs.getByIds(id);
            if (!songs || songs?.length === 0) {
                throw new AppError('Song not found', 404);
            }
            return songs[0];
        } catch (err: unknown) {
            return wrapError(err, 'Failed to fetch song', 500);
        }
    }

    async getByIds(id: string, opts?: ServiceOptions): Promise<Song[]> {
        const provider = providers[opts?.provider ?? 'saavn'];
        if (!provider) {
            throw new AppError(`Provider not found`, 500);
        }

        try {
            const songs = await provider.songs.getByIds(id);
            if (!songs || songs.length === 0) {
                throw new AppError('Song not found', 404);
            }
            return songs;
        } catch (err: unknown) {
            return wrapError(err, 'Failed to fetch song', 500);
        }
    }

    async getByLink(link: string): Promise<Song> {
        if (!link) {
            throw new AppError('Link is required', 400);
        }

        const provider = providers['saavn'];
        try {
            const song = await provider.songs.getByLink(link);
            return song;
        } catch (err: unknown) {
            return wrapError(err, 'Failed to fetch songs', 500);
        }
    }

    async getSuggestions(id: string, limit: number = 10): Promise<Song[]> {
        const provider = providers['saavn'];
        try {
            const suggestions = await provider.songs.getSuggestions(id, limit);
            return suggestions || [];
        } catch (err: unknown) {
            return wrapError(err, 'Failed to fetch suggestions', 500);
        }
    }
}
