/**
 * Qobuz User Module - User-specific features (favorites, playlists, purchases)
 */
import type { QobuzFavoriteAlbumsResponse, QobuzFavoriteArtistsResponse, QobuzFavoriteTracksResponse, QobuzPurchasesResponse, QobuzUserPlaylistsResponse } from '../../types/qobuz';
import { assertData } from '../../utils/error.utils';
import { getUserAuthToken, getUserSession, isAuthenticated } from './qobuz.auth';
import { qobuzClient } from './qobuz.client';
import QOBUZ_ROUTES from './qobuz.routes';









const getAuthHeaders = (): Record<string, string> => {
    const token = getUserAuthToken();
    if (!token) throw new Error('User authentication required');
    return { 'X-User-Auth-Token': token };
};

const requireAuth = () => {
    if (!isAuthenticated()) throw new Error('User authentication required');
};

/* -------------------------------------------------------------------------- */
/*                                  FAVORITES                                 */
/* -------------------------------------------------------------------------- */

export async function getFavoriteTracks(limit = 50, offset = 0): Promise<QobuzFavoriteTracksResponse> {
    requireAuth();
    const res = await qobuzClient.get<QobuzFavoriteTracksResponse>(QOBUZ_ROUTES.FAVORITE.GET_TRACKS, {
        params: { user_id: getUserSession().userId, limit, offset },
        headers: getAuthHeaders(),
    });
    return assertData(res.data, 'Failed to get favorite tracks');
}

export async function getFavoriteAlbums(limit = 50, offset = 0): Promise<QobuzFavoriteAlbumsResponse> {
    requireAuth();
    const res = await qobuzClient.get<QobuzFavoriteAlbumsResponse>(QOBUZ_ROUTES.FAVORITE.GET_ALBUMS, {
        params: { user_id: getUserSession().userId, limit, offset },
        headers: getAuthHeaders(),
    });
    return assertData(res.data, 'Failed to get favorite albums');
}

export async function getFavoriteArtists(limit = 50, offset = 0): Promise<QobuzFavoriteArtistsResponse> {
    requireAuth();
    const res = await qobuzClient.get<QobuzFavoriteArtistsResponse>(QOBUZ_ROUTES.FAVORITE.GET_ARTISTS, {
        params: { user_id: getUserSession().userId, limit, offset },
        headers: getAuthHeaders(),
    });
    return assertData(res.data, 'Failed to get favorite artists');
}

const toIdString = (ids: string | string[]): string => (Array.isArray(ids) ? ids.join(',') : ids);

export async function addFavoriteTrack(trackIds: string | string[]): Promise<void> {
    requireAuth();
    await qobuzClient.get(QOBUZ_ROUTES.FAVORITE.ADD, {
        params: { track_ids: toIdString(trackIds) },
        headers: getAuthHeaders(),
    });
}

export async function addFavoriteAlbum(albumIds: string | string[]): Promise<void> {
    requireAuth();
    await qobuzClient.get(QOBUZ_ROUTES.FAVORITE.ADD, {
        params: { album_ids: toIdString(albumIds) },
        headers: getAuthHeaders(),
    });
}

export async function addFavoriteArtist(artistIds: string | string[]): Promise<void> {
    requireAuth();
    await qobuzClient.get(QOBUZ_ROUTES.FAVORITE.ADD, {
        params: { artist_ids: toIdString(artistIds) },
        headers: getAuthHeaders(),
    });
}

export async function removeFavoriteTrack(trackIds: string | string[]): Promise<void> {
    requireAuth();
    await qobuzClient.get(QOBUZ_ROUTES.FAVORITE.REMOVE, {
        params: { track_ids: toIdString(trackIds) },
        headers: getAuthHeaders(),
    });
}

export async function removeFavoriteAlbum(albumIds: string | string[]): Promise<void> {
    requireAuth();
    await qobuzClient.get(QOBUZ_ROUTES.FAVORITE.REMOVE, {
        params: { album_ids: toIdString(albumIds) },
        headers: getAuthHeaders(),
    });
}

export async function removeFavoriteArtist(artistIds: string | string[]): Promise<void> {
    requireAuth();
    await qobuzClient.get(QOBUZ_ROUTES.FAVORITE.REMOVE, {
        params: { artist_ids: toIdString(artistIds) },
        headers: getAuthHeaders(),
    });
}

/* -------------------------------------------------------------------------- */
/*                                  PLAYLISTS                                 */
/* -------------------------------------------------------------------------- */

export async function getUserPlaylists(limit = 50, offset = 0): Promise<QobuzUserPlaylistsResponse> {
    requireAuth();
    const res = await qobuzClient.get<QobuzUserPlaylistsResponse>(QOBUZ_ROUTES.PLAYLIST.USER_PLAYLISTS, {
        params: { user_id: getUserSession().userId, limit, offset },
        headers: getAuthHeaders(),
    });
    return assertData(res.data, 'Failed to get user playlists');
}

export async function createPlaylist(name: string, description?: string, isPublic = false): Promise<{ id: string }> {
    requireAuth();
    const res = await qobuzClient.get<{ id: string }>(QOBUZ_ROUTES.PLAYLIST.CREATE, {
        params: { name, description: description || '', is_public: isPublic },
        headers: getAuthHeaders(),
    });
    return assertData(res.data, 'Failed to create playlist');
}

export async function deletePlaylist(playlistId: string): Promise<void> {
    requireAuth();
    await qobuzClient.get(QOBUZ_ROUTES.PLAYLIST.DELETE, {
        params: { playlist_id: playlistId },
        headers: getAuthHeaders(),
    });
}

export async function updatePlaylist(
    playlistId: string,
    name?: string,
    description?: string,
    isPublic?: boolean
): Promise<void> {
    requireAuth();
    const params: Record<string, string | boolean> = { playlist_id: playlistId };
    if (name !== undefined) params.name = name;
    if (description !== undefined) params.description = description;
    if (isPublic !== undefined) params.is_public = isPublic;

    await qobuzClient.get(QOBUZ_ROUTES.PLAYLIST.UPDATE, { params, headers: getAuthHeaders() });
}

export async function addTracksToPlaylist(playlistId: string, trackIds: string | string[]): Promise<void> {
    requireAuth();
    await qobuzClient.get(QOBUZ_ROUTES.PLAYLIST.ADD_TRACKS, {
        params: { playlist_id: playlistId, track_ids: toIdString(trackIds) },
        headers: getAuthHeaders(),
    });
}

export async function removeTracksFromPlaylist(playlistId: string, playlistTrackIds: string | string[]): Promise<void> {
    requireAuth();
    await qobuzClient.get(QOBUZ_ROUTES.PLAYLIST.REMOVE_TRACKS, {
        params: { playlist_id: playlistId, playlist_track_ids: toIdString(playlistTrackIds) },
        headers: getAuthHeaders(),
    });
}

export async function subscribeToPlaylist(playlistId: string): Promise<void> {
    requireAuth();
    await qobuzClient.get(QOBUZ_ROUTES.PLAYLIST.SUBSCRIBE, {
        params: { playlist_id: playlistId },
        headers: getAuthHeaders(),
    });
}

export async function unsubscribeFromPlaylist(playlistId: string): Promise<void> {
    requireAuth();
    await qobuzClient.get(QOBUZ_ROUTES.PLAYLIST.UNSUBSCRIBE, {
        params: { playlist_id: playlistId },
        headers: getAuthHeaders(),
    });
}

/* -------------------------------------------------------------------------- */
/*                            LIBRARY & PURCHASES                             */
/* -------------------------------------------------------------------------- */

export async function getAllFavorites(limit = 50, offset = 0) {
    requireAuth();
    const res = await qobuzClient.get(QOBUZ_ROUTES.FAVORITE.GET_ALL, {
        params: { user_id: getUserSession().userId, limit, offset },
        headers: getAuthHeaders(),
    });
    return assertData(res.data, 'Failed to get all favorites');
}

export async function getPurchases(limit = 50, offset = 0): Promise<QobuzPurchasesResponse> {
    requireAuth();
    const res = await qobuzClient.get<QobuzPurchasesResponse>(QOBUZ_ROUTES.PURCHASE.GET_ALL, {
        params: { user_id: getUserSession().userId, limit, offset },
        headers: getAuthHeaders(),
    });
    return assertData(res.data, 'Failed to get purchases');
}
