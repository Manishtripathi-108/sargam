import type { Album } from '../../types/core/album.model';
import type { Artist } from '../../types/core/artist.model';
import type { Song } from '../../types/core/song.model';
import type {
    SaavnArtistAlbumAPIResponse,
    SaavnArtistAPIResponse,
    SaavnArtistSongAPIResponse,
} from '../../types/saavn/artists.type';
import { assertData } from '../../utils/error.utils';
import { normalizePagination } from '../../utils/main.utils';
import { saavnClient } from './saavn.client';
import { mapArtist, mapSong, mapAlbumBase } from './saavn.mapper';
import SAAVN_ROUTES from './saavn.routes';
import { extractArtistToken } from './saavn.utils';

export async function getById(id: string): Promise<Artist> {
    const res = await saavnClient.get<SaavnArtistAPIResponse>('/', {
        params: {
            artistId: id,
            __call: SAAVN_ROUTES.ARTIST.DETAILS,
        },
    });

    return mapArtist(assertData(res.data, 'Artist not found'));
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

    return mapArtist(assertData(res.data, 'Artist not found'));
}

export async function getSongs(
    id: string,
    limit: number,
    offset: number,
    sortBy: string,
    sortOrder: string
): Promise<{ total: number; songs: Song[] }> {
    const { page } = normalizePagination(limit, offset);

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
    limit: number,
    offset: number,
    sortBy: string,
    sortOrder: string
): Promise<{ total: number; albums: Omit<Album, 'songs'>[] }> {
    const { page } = normalizePagination(limit, offset);

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
