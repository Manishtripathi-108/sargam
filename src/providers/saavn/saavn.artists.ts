import type { Album } from '../../types/core/album.model';
import type { Artist } from '../../types/core/artist.model';
import type { Song } from '../../types/core/song.model';
import type {
    SaavnArtistAlbumAPIResponse,
    SaavnArtistAPIResponse,
    SaavnArtistSongAPIResponse,
} from '../../types/saavn/artists.type';
import { AppError, notFound } from '../../utils/error.utils';
import { saavnClient } from './saavn.client';
import { mapArtist, mapSong, mapAlbumBase } from './saavn.mapper';
import SAAVN_ROUTES from './saavn.routes';

const extractArtistToken = (link: string) => {
    const token = link.match(/jiosaavn\.com\/artist\/[^/]+\/([^/]+)$/)?.[1];
    if (!token) throw new AppError('Invalid artist link', 400);
    return token;
};

export async function getById(id: string): Promise<Artist> {
    const res = await saavnClient.get<SaavnArtistAPIResponse>('/', {
        params: {
            artistId: id,
            __call: SAAVN_ROUTES.ARTIST.DETAILS,
        },
    });

    if (!res.data) {
        throw notFound('Artist not found');
    }

    return mapArtist(res.data);
}

export async function getByLink(link: string): Promise<Artist> {
    const token = extractArtistToken(link);

    const res = await saavnClient.get<SaavnArtistAPIResponse>('/', {
        params: {
            token,
            type: 'artist',
            __call: SAAVN_ROUTES.ARTIST.LINK,
        },
    });

    if (!res.data) {
        throw notFound('Artist not found');
    }

    return mapArtist(res.data);
}

export async function getSongs(
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

export async function getAlbums(
    id: string,
    page: number,
    sortBy: string,
    sortOrder: string
): Promise<{ total: number; albums: Omit<Album, 'songs'>[] }> {
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
        albums: res.data?.topAlbums?.albums?.map(mapAlbumBase) ?? [],
    };
}
