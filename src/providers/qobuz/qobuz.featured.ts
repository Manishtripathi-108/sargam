/**
 * Qobuz Featured/Editorial Module
 *
 * Handles editorial and featured content:
 * - Featured albums and playlists
 * - New releases
 * - Editor's picks
 * - Genre-based recommendations
 * - Qobuz Ideal Discography
 */
import type {
    QobuzAlbumListType,
    QobuzFeaturedAlbumsResponse,
    QobuzFeaturedPlaylistsResponse,
    QobuzGenreInfo,
    QobuzGenreListResponse,
} from '../../types/qobuz';
import { assertData } from '../../utils/error.utils';
import { qobuzClient } from './qobuz.client';
import QOBUZ_ROUTES from './qobuz.routes';

interface FeaturedOptions {
    limit?: number;
    offset?: number;
    genreId?: number;
}

/** Get featured albums by type */
export async function getFeaturedAlbums(
    type: QobuzAlbumListType = 'new-releases',
    options: FeaturedOptions = {}
): Promise<QobuzFeaturedAlbumsResponse> {
    const { limit = 50, offset = 0, genreId } = options;

    const params: Record<string, string | number> = { type, limit, offset };
    if (genreId) params.genre_id = genreId;

    const res = await qobuzClient.get<QobuzFeaturedAlbumsResponse>(QOBUZ_ROUTES.ALBUM.FEATURED, { params });
    return assertData(res.data, 'Failed to get featured albums');
}

/** Get new releases */
export const getNewReleases = (options: FeaturedOptions = {}) => getFeaturedAlbums('new-releases', options);

/** Get best sellers */
export const getBestSellers = (options: FeaturedOptions = {}) => getFeaturedAlbums('best-sellers', options);

/** Get press awards (critically acclaimed albums) */
export const getPressAwards = (options: FeaturedOptions = {}) => getFeaturedAlbums('press-awards', options);

/** Get editor's picks */
export const getEditorPicks = (options: FeaturedOptions = {}) => getFeaturedAlbums('editor-picks', options);

/** Get most streamed albums */
export const getMostStreamed = (options: FeaturedOptions = {}) => getFeaturedAlbums('most-streamed', options);

/** Get Qobuz Ideal Discography (curated essential albums) */
export const getIdealDiscography = (options: Omit<FeaturedOptions, 'genreId'> = {}) =>
    getFeaturedAlbums('ideal-discography', options);

/** Get featured playlists */
export async function getFeaturedPlaylists(
    options: FeaturedOptions & { tags?: string[] } = {}
): Promise<QobuzFeaturedPlaylistsResponse> {
    const { limit = 50, offset = 0, genreId, tags } = options;

    const params: Record<string, string | number> = { limit, offset };
    if (genreId) params.genre_id = genreId;
    if (tags?.length) params.tags = tags.join(',');

    const res = await qobuzClient.get<QobuzFeaturedPlaylistsResponse>(QOBUZ_ROUTES.PLAYLIST.FEATURED, { params });
    return assertData(res.data, 'Failed to get featured playlists');
}

/** Get all genres */
export async function getGenres(options: Omit<FeaturedOptions, 'genreId'> = {}): Promise<QobuzGenreListResponse> {
    const { limit = 100, offset = 0 } = options;

    const res = await qobuzClient.get<QobuzGenreListResponse>(QOBUZ_ROUTES.GENRE.LIST, {
        params: { limit, offset },
    });

    return assertData(res.data, 'Failed to get genres');
}

/** Get genre by ID */
export async function getGenreById(genreId: number): Promise<QobuzGenreInfo> {
    const res = await qobuzClient.get<QobuzGenreInfo>(QOBUZ_ROUTES.GENRE.GET, {
        params: { genre_id: genreId },
    });

    return assertData(res.data, 'Genre not found');
}

/** Get albums by genre */
export const getAlbumsByGenre = (
    genreId: number,
    type: QobuzAlbumListType = 'new-releases',
    options: Omit<FeaturedOptions, 'genreId'> = {}
) => getFeaturedAlbums(type, { ...options, genreId });

/** Get compilation of various featured content (useful for homepage/discovery) */
export async function getDiscoveryContent() {
    const [newReleases, bestSellers, editorPicks, featuredPlaylists, genres] = await Promise.all([
        getNewReleases({ limit: 10 }),
        getBestSellers({ limit: 10 }),
        getEditorPicks({ limit: 10 }),
        getFeaturedPlaylists({ limit: 10 }),
        getGenres({ limit: 20 }),
    ]);

    return {
        newReleases: newReleases.albums.items,
        bestSellers: bestSellers.albums.items,
        editorPicks: editorPicks.albums.items,
        featuredPlaylists: featuredPlaylists.playlists.items,
        genres: genres.genres.items,
    };
}
