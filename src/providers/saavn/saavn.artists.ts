import type { Album } from '../../types/core/album.model';
import type { Artist } from '../../types/core/artist.model';
import type { Song } from '../../types/core/song.model';
import type {
    SaavnArtistAlbumAPIResponse,
    SaavnArtistAPIResponse,
    SaavnArtistSongAPIResponse,
} from '../../types/saavn/artists.type';
import { AppError } from '../../utils/error.utils';
import { saavnClient } from './saavn.client';
import { mapArtist, mapAlbum, mapSong } from './saavn.mapper';
import SAAVN_ROUTES from './saavn.routes';

const extractArtistToken = (link: string) => {
    const token = link.match(/jiosaavn\.com\/artist\/[^/]+\/([^/]+)$/)?.[1];
    if (!token) throw new AppError('Invalid artist link', 400);
    return token;
};

type ArtistQuery = {
    page: number;
    songCount: number;
    albumCount: number;
    sortBy: string;
    sortOrder: string;
};

export async function getArtistById(id: string, q: ArtistQuery): Promise<Artist> {
    const res = await saavnClient.get<SaavnArtistAPIResponse>('/', {
        params: {
            artistId: id,
            page: q.page,
            n_song: q.songCount,
            n_album: q.albumCount,
            category: q.sortBy,
            sort_order: q.sortOrder,
            __call: SAAVN_ROUTES.ARTIST.DETAILS,
        },
    });

    if (!res.data) {
        throw new AppError('Artist not found', 404);
    }

    return mapArtist(res.data);
}

export async function getArtistByLink(link: string, q: ArtistQuery): Promise<Artist> {
    const token = extractArtistToken(link);

    const res = await saavnClient.get<SaavnArtistAPIResponse>('/', {
        params: {
            token,
            type: 'artist',
            page: q.page,
            n_song: q.songCount,
            n_album: q.albumCount,
            category: q.sortBy,
            sort_order: q.sortOrder,
            __call: SAAVN_ROUTES.ARTIST.LINK,
        },
    });

    if (!res.data) {
        throw new AppError('Artist not found', 404);
    }

    return mapArtist(res.data);
}

export async function getArtistSongs(
    id: string,
    page: number,
    sortBy: string,
    sortOrder: string
): Promise<{ total: number; songs: Song[] }> {
    const res = await saavnClient.get<SaavnArtistSongAPIResponse>('/', {
        params: {
            artistId: id,
            page,
            category: sortBy,
            sort_order: sortOrder,
            __call: SAAVN_ROUTES.ARTIST.SONGS,
        },
    });

    return {
        total: Number(res.data?.topSongs?.total ?? 0),
        songs: res.data?.topSongs?.songs?.map(mapSong) ?? [],
    };
}

export async function getArtistAlbums(
    id: string,
    page: number,
    sortBy: string,
    sortOrder: string
): Promise<{ total: number; albums: Album[] }> {
    const res = await saavnClient.get<SaavnArtistAlbumAPIResponse>('/', {
        params: {
            artistId: id,
            page,
            category: sortBy,
            sort_order: sortOrder,
            __call: SAAVN_ROUTES.ARTIST.ALBUMS,
        },
    });

    return {
        total: Number(res.data?.topAlbums?.total ?? 0),
        albums: res.data?.topAlbums?.albums?.map(mapAlbum) ?? [],
    };
}
