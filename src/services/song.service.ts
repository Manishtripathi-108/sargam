import { SaavnProvider } from '../providers/saavn/saavn.provider';
import type { Song } from '../types/core/song.model';
import { AppError } from '../utils/error.utils';

type Provider = 'saavn';

interface ServiceOptions {
    provider?: Provider;
}

const providers = {
    saavn: SaavnProvider,
};

export class DefaultSongService {
    async getSongById(id: string, opts?: ServiceOptions): Promise<Song> {
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
        } catch (err: any) {
            if (err instanceof AppError) throw err;
            throw new AppError(`Failed to fetch song: ${err?.message}`, 500);
        }
    }

    async getSongByIds(id: string, opts?: ServiceOptions): Promise<Song[]> {
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
        } catch (err: any) {
            if (err instanceof AppError) throw err;
            throw new AppError(`Failed to fetch song: ${err?.message}`, 500);
        }
    }

    async getSongByLink(link: string): Promise<Song> {
        if (!link) {
            throw new AppError('Link is required', 400);
        }

        const provider = providers['saavn'];
        try {
            const song = await provider.songs.getByLink(link);
            return song;
        } catch (err: any) {
            if (err instanceof AppError) throw err;
            throw new AppError(`Failed to fetch songs: ${err?.message}`, 500);
        }
    }

    async getSongSuggestions(id: string, limit: number = 10): Promise<Song[]> {
        const provider = providers['saavn'];
        try {
            const suggestions = await provider.songs.getSuggestions(id, limit);
            return suggestions || [];
        } catch (err: any) {
            if (err instanceof AppError) throw err;
            throw new AppError(`Failed to fetch suggestions: ${err?.message}`, 500);
        }
    }
}
