import { IMAGE_FALLBACKS } from '../../constants/common.constants';
import { Album } from '../../types/core/album.model';
import { Artist, ArtistBase } from '../../types/core/artist.model';
import { ImageAsset } from '../../types/core/image.model';
import { Playlist } from '../../types/core/playlist.model';
import { GlobalSearchResult, SearchAlbum, SearchPlaylist } from '../../types/core/search.model';
import { Song, SongAudio } from '../../types/core/song.model';
import type { SaavnAlbumAPIResponse, SaavnSearchAlbumAPIResponse } from '../../types/saavn/albums.types';
import type { SaavnArtistAPIResponse, SaavnArtistBaseAPIResponse } from '../../types/saavn/artists.type';
import type { SaavnPlaylistAPIResponse } from '../../types/saavn/playlist.types';
import type { SaavnSearchAPIResponse, SaavnSearchPlaylistAPIResponse } from '../../types/saavn/search.types';
import type { SaavnSongAPIResponse } from '../../types/saavn/song.types';
import crypto from 'node-forge';

const QUALITIES = [
    { id: '_96', quality: 'low' },
    { id: '_160', quality: 'medium' },
    { id: '_320', quality: 'high' },
] as const;

const QUALITY_REGEX = /150x150|50x50/;
const PROTOCOL_REGEX = /^http:\/\//;
const DES_KEY = '38346591';
const DES_IV = '00000000';

const createSaavnAudioLinks = (encryptedMediaUrl: string): SongAudio | null => {
    if (!encryptedMediaUrl) return null;

    const encrypted = crypto.util.decode64(encryptedMediaUrl);
    const decipher = crypto.cipher.createDecipher('DES-ECB', crypto.util.createBuffer(DES_KEY));
    decipher.start({ iv: crypto.util.createBuffer(DES_IV) });
    decipher.update(crypto.util.createBuffer(encrypted));
    decipher.finish();

    const decryptedLink = decipher.output.getBytes();

    return QUALITIES.reduce((acc, { id, quality }) => {
        acc[quality] = decryptedLink.replace('_96', id).replace(PROTOCOL_REGEX, 'https://');
        return acc;
    }, {} as SongAudio);
};

const createSaavnImageAssets = (link?: string | null): ImageAsset => {
    if (!link || link.includes('default')) {
        return {
            low: IMAGE_FALLBACKS.AUDIO_COVER,
            medium: IMAGE_FALLBACKS.AUDIO_COVER,
            high: IMAGE_FALLBACKS.AUDIO_COVER,
        };
    }

    return {
        low: link.replace(QUALITY_REGEX, '50x50').replace(PROTOCOL_REGEX, 'https://'),
        medium: link.replace(QUALITY_REGEX, '150x150').replace(PROTOCOL_REGEX, 'https://'),
        high: link.replace(QUALITY_REGEX, '500x500').replace(PROTOCOL_REGEX, 'https://'),
    };
};

export const createArtistBasePayload = (artist: SaavnArtistBaseAPIResponse): ArtistBase => ({
    id: artist.id,
    name: artist.name,
    type: 'artist',
});

export const createSongPayload = (song: SaavnSongAPIResponse): Song => {
    if (createSaavnAudioLinks(song.more_info?.encrypted_media_url) === null) {
        throw new Error(`Invalid encrypted media URL for song ID: ${song.id}`);
    } else {
        return {
            id: song.id,
            name: song.title.replace(/&amp;/g, '&').replace(/&quot;/g, '"'),
            type: 'song',
            year: song.year ? Number(song.year) : null,
            release_date: song.more_info?.release_date || null,
            duration: song.more_info?.duration ? Number(song.more_info.duration) : 0,
            explicit: song.explicit_content === '1',
            language: song.language,
            disc_number: 0,
            track_number: 0,
            copyright: song.more_info?.copyright_text || null,
            album: {
                id: song.more_info?.album_id,
                name: song.more_info?.album?.replace(/&amp;/g, '&').replace(/&quot;/g, '"'),
                type: 'album',
            },
            artists: song.more_info?.artistMap?.primary_artists?.map(createArtistBasePayload),
            image: createSaavnImageAssets(song.image),
            audio: createSaavnAudioLinks(song.more_info?.encrypted_media_url)!,
        };
    }
};

export const createArtistPayload = (artist: SaavnArtistAPIResponse): Artist => ({
    id: artist.artistId || artist.id,
    name: artist.name,
    type: 'artist',
    followerCount: artist.follower_count ? Number(artist.follower_count) : 0,
    bio: artist.bio ? JSON.parse(artist.bio) : null,
    image: createSaavnImageAssets(artist.image),
});

export const createSearchPayload = (search: SaavnSearchAPIResponse): GlobalSearchResult => ({
    topQuery: {
        results: search?.topquery?.data.map((item) => ({
            id: item?.id,
            name: item?.title,
            image: createSaavnImageAssets(item?.image),
            type: item?.type as 'song' | 'album' | 'artist' | 'playlist',
            artists: item?.more_info?.primary_artists,
        })),
        position: search?.topquery?.position,
    },
    songs: {
        results: search?.songs?.data.map((song) => ({
            id: song?.id,
            name: song?.title,
            image: createSaavnImageAssets(song?.image),
            album: song?.more_info.album,
            type: 'song',
            artists: song?.more_info?.primary_artists || song?.more_info?.singers,
        })),
        position: search.songs.position,
    },
    albums: {
        results: search?.albums?.data.map((album) => ({
            id: album?.id,
            name: album?.title,
            image: createSaavnImageAssets(album.image),
            artists: album?.more_info.music,
            type: 'album',
        })),
        position: search?.albums?.position,
    },
    artists: {
        results: search?.artists?.data.map((artist) => ({
            id: artist?.id,
            name: artist?.name || artist?.title,
            image: createSaavnImageAssets(artist?.image),
            type: 'artist',
        })),
        position: search?.artists?.position,
    },
    playlists: {
        results: search?.playlists?.data.map((playlist) => ({
            id: playlist?.id,
            name: playlist?.title,
            image: createSaavnImageAssets(playlist.image),
            type: 'playlist',
        })),
        position: search?.playlists?.position,
    },
});

export const createSearchPlaylistPayload = (playlist: SaavnSearchPlaylistAPIResponse): SearchPlaylist => ({
    total: Number(playlist.total),
    start: Number(playlist.start),
    results: playlist.results.map((item) => ({
        id: item.id,
        name: item.title,
        type: 'playlist',
        image: createSaavnImageAssets(item.image),
        url: item.perma_url,
        total_songs: item.more_info.song_count ? Number(item.more_info.song_count) : 0,
        language: item.more_info.language,
        explicit: item.explicit_content === '1',
    })),
});

export const createSearchAlbumPayload = (album: SaavnSearchAlbumAPIResponse): SearchAlbum => ({
    total: Number(album.total),
    start: Number(album.start),
    results: album.results.map((item) => ({
        id: item.id,
        name: item.title,
        url: item.perma_url,
        release_date: item.year ? `${item.year}-01-01` : '0000-01-01',
        type: 'album',
        language: item.language,
        explicit: item.explicit_content === '1',
        image: createSaavnImageAssets(item.image),
    })),
});

export const createAlbumPayload = (album: SaavnAlbumAPIResponse): Album => ({
    id: album.id,
    name: album.title,
    type: 'album',
    release_date: album.year ? `${album.year}-01-01` : '0000-01-01',
    language: album.language,
    explicit: album.explicit_content === '1',
    total_songs: album.more_info.song_count ? Number(album.more_info.song_count) : 0,
    popularity: album.play_count ? Number(album.play_count) : 0,
    artists: album.more_info?.artistMap?.artists?.map(createArtistBasePayload),
    image: createSaavnImageAssets(album.image),
    songs: (album.list && album.list?.map(createSongPayload)) || null,
});

export const createPlaylistPayload = (playlist: SaavnPlaylistAPIResponse): Playlist => ({
    id: playlist.id,
    name: playlist.title,
    description: playlist.header_desc,
    type: 'playlist',
    explicit: playlist.explicit_content === '1',
    total_songs: playlist.list_count ? Number(playlist.list_count) : 0,
    image: createSaavnImageAssets(playlist.image),
    songs: (playlist.list && playlist.list?.map(createSongPayload)) || null,
});
