import { assertData } from '../../utils/error.utils';
import { createPaginatedResponse, normalizePagination } from '../../utils/pagination.utils';
import { extractQobuzId } from '../../utils/url.utils';
import { getQobuzClient } from './qobuz.client';
import QOBUZ_ROUTES from './qobuz.routes';

interface QobuzPlaylistOwner {
    id: number;
    name: string;
}

interface QobuzPlaylistImage {
    small: string;
    thumbnail: string;
    large: string;
}

interface QobuzTrack {
    id: number;
    title: string;
    version?: string;
    duration: number;
    track_number: number;
    isrc: string;
    hires: boolean;
    hires_streamable: boolean;
    performer: {
        id: number;
        name: string;
    };
    album: {
        id: string;
        title: string;
        image: QobuzPlaylistImage;
    };
}

interface QobuzPlaylist {
    id: number;
    name: string;
    description?: string;
    duration: number;
    tracks_count: number;
    users_count?: number;
    is_public: boolean;
    is_collaborative?: boolean;
    created_at?: string;
    updated_at?: string;
    images?: string[];
    images150?: string[];
    images300?: string[];
    owner: QobuzPlaylistOwner;
    tracks?: {
        items: QobuzTrack[];
        offset: number;
        limit: number;
        total: number;
    };
}

interface QobuzPlaylistSearchResponse {
    query: string;
    playlists: {
        items: QobuzPlaylist[];
        limit: number;
        offset: number;
        total: number;
    };
}

export async function getById(id: string) {
    const client = getQobuzClient();

    const res = await client.get<QobuzPlaylist>(QOBUZ_ROUTES.PLAYLIST.GET, {
        params: { playlist_id: id },
    });

    return assertData(res.data, 'Playlist not found');
}

export async function getByLink(link: string) {
    const id = extractQobuzId(link, 'playlist');

    return getById(id);
}

export async function getTracks({ id, limit, offset }: { id: string; limit: number; offset: number }) {
    const { limit: safeLimit, offset: safeOffset } = normalizePagination(limit, offset);

    // Qobuz returns tracks in the playlist response
    const playlist = await getById(id);

    if (!playlist.tracks) {
        return createPaginatedResponse({
            items: [],
            total: 0,
            offset: safeOffset,
            limit: safeLimit,
            hasNext: false,
        });
    }

    // Apply pagination to tracks
    const paginatedTracks = playlist.tracks.items.slice(safeOffset, safeOffset + safeLimit);

    return createPaginatedResponse({
        items: paginatedTracks,
        total: playlist.tracks.total,
        offset: safeOffset,
        limit: safeLimit,
        hasNext: safeOffset + paginatedTracks.length < playlist.tracks.total,
    });
}

export async function search({ query, limit, offset }: { query: string; limit: number; offset: number }) {
    const { limit: safeLimit, offset: safeOffset } = normalizePagination(limit, offset);

    const client = getQobuzClient();

    const res = await client.get<QobuzPlaylistSearchResponse>(QOBUZ_ROUTES.PLAYLIST.SEARCH, {
        params: {
            query,
            limit: safeLimit,
            offset: safeOffset,
        },
    });

    const data = assertData(res.data, 'Search failed');

    return createPaginatedResponse({
        items: data.playlists.items,
        total: data.playlists.total,
        offset: safeOffset,
        limit: safeLimit,
        hasNext: safeOffset + data.playlists.items.length < data.playlists.total,
    });
}
