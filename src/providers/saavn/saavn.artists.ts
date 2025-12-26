import type { Album } from '../../types/core/album.model';
import type { Artist } from '../../types/core/artist.model';
import type { Paginated } from '../../types/core/pagination.model';
import type { Song } from '../../types/core/song.model';
import type { SaavnArtistAlbumsResponse, SaavnArtistResponse, SaavnArtistSongsResponse } from '../../types/saavn';
import { assertData } from '../../utils/error.utils';
import { createPaginatedResponse, normalizePagination } from '../../utils/pagination.utils';
import { extractSeoToken } from '../../utils/url.utils';
import { saavnClient } from './saavn.client';
import { mapAlbumBase, mapArtist, mapSong } from './saavn.mapper';
import SAAVN_ROUTES from './saavn.routes';

export async function getById(id: string): Promise<Artist> {
    const res = await saavnClient.get<SaavnArtistResponse>('/', {
        params: {
            artistId: id,
            __call: SAAVN_ROUTES.ARTIST.DETAILS,
        },
    });

    return mapArtist(assertData(res.data, 'Artist not found'));
}

export async function getByLink(link: string): Promise<Artist> {
    const token = extractSeoToken(link, 'saavn', 'artist');

    const res = await saavnClient.get<SaavnArtistResponse>('/', {
        params: {
            token,
            type: 'artist',
            __call: SAAVN_ROUTES.ARTIST.LINK,
        },
    });

    return mapArtist(assertData(res.data, 'Artist not found'));
}

export async function getSongs({
    id,
    limit,
    offset,
    sortBy,
    sortOrder,
}: {
    id: string;
    limit: number;
    offset: number;
    sortBy: string;
    sortOrder: string;
}): Promise<Paginated<Song>> {
    const { page } = normalizePagination(limit, offset);

    const res = await saavnClient.get<SaavnArtistSongsResponse>('/', {
        params: {
            artistId: id,
            page: page - 1,
            category: sortBy,
            sort_order: sortOrder,
            __call: SAAVN_ROUTES.ARTIST.SONGS,
        },
    });

    const data = assertData(res.data, 'Artist not found');

    return createPaginatedResponse({
        items: data.topSongs?.songs?.map(mapSong),
        offset: (page - 1) * 10,
        total: data.topSongs?.total,
        hasNext: !data.topSongs.last_page,
    });
}

export async function getAlbums({
    id,
    limit,
    offset,
    sortBy,
    sortOrder,
}: {
    id: string;
    limit: number;
    offset: number;
    sortBy: string;
    sortOrder: string;
}): Promise<Paginated<Omit<Album, 'songs'>>> {
    const { page } = normalizePagination(limit, offset);

    const res = await saavnClient.get<SaavnArtistAlbumsResponse>('/', {
        params: {
            artistId: id,
            page: page - 1,
            category: sortBy,
            sort_order: sortOrder,
            __call: SAAVN_ROUTES.ARTIST.ALBUMS,
        },
    });

    const data = assertData(res.data, 'Artist not found');

    return createPaginatedResponse({
        items: data.topAlbums?.albums?.map(mapAlbumBase),
        offset: (page - 1) * 10,
        total: data.topAlbums?.total,
        hasNext: !data.topAlbums.last_page,
    });
}
