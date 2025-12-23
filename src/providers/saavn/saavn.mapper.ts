import type { Album } from '../../types/core/album.model';
import type { Artist, ArtistBase } from '../../types/core/artist.model';
import type { ImageAsset } from '../../types/core/image.model';
import type { Playlist } from '../../types/core/playlist.model';
import type { GlobalSearchResult, SearchAlbum, SearchArtist, SearchPlaylist } from '../../types/core/search.model';
import type { Song, SongAudio, SongBase } from '../../types/core/song.model';
import type { SaavnAlbumAPIResponse, SaavnSearchAlbumAPIResponse } from '../../types/saavn/albums.types';
import type { SaavnArtistAPIResponse, SaavnArtistBaseAPIResponse } from '../../types/saavn/artists.type';
import type { SaavnPlaylistAPIResponse } from '../../types/saavn/playlist.types';
import type {
    SaavnSearchAPIResponse,
    SaavnSearchArtistAPIResponse,
    SaavnSearchPlaylistAPIResponse,
} from '../../types/saavn/search.types';
import type { SaavnSongAPIResponse } from '../../types/saavn/song.types';
import { decodeHtml, fallbackImage, safeNumber, toHttps } from '../../utils/helper.utils';
import crypto from 'node-forge';

/* -------------------------------------------------------------------------- */
/*                                   helpers                                  */
/* -------------------------------------------------------------------------- */

const IMG_SIZE_RX = /150x150|50x50/;
const DES_KEY = '38346591';
const DES_IV = '00000000';

const AUDIO_QUALITIES = [
    { id: '_96', key: 'low' },
    { id: '_160', key: 'medium' },
    { id: '_320', key: 'high' },
] as const;

/* -------------------------------------------------------------------------- */
/*                              low level mappers                             */
/* -------------------------------------------------------------------------- */

const audioFromSaavn = (encrypted?: string): SongAudio | null => {
    if (!encrypted) return null;

    const decoded = crypto.util.decode64(encrypted);
    const decipher = crypto.cipher.createDecipher('DES-ECB', crypto.util.createBuffer(DES_KEY));

    decipher.start({ iv: crypto.util.createBuffer(DES_IV) });
    decipher.update(crypto.util.createBuffer(decoded));
    decipher.finish();

    const base = decipher.output.getBytes();

    return AUDIO_QUALITIES.reduce((acc, q) => {
        acc[q.key] = toHttps(base.replace('_96', q.id));
        return acc;
    }, {} as SongAudio);
};

const imgFromSaavn = (link?: string | null): ImageAsset => {
    if (!link || link.includes('default')) return fallbackImage();

    return {
        low: toHttps(link.replace(IMG_SIZE_RX, '50x50')),
        medium: toHttps(link.replace(IMG_SIZE_RX, '150x150')),
        high: toHttps(link.replace(IMG_SIZE_RX, '500x500')),
    };
};

/* -------------------------------------------------------------------------- */
/*                              entity mappers                                */
/* -------------------------------------------------------------------------- */

export const mapArtistBase = (a: SaavnArtistBaseAPIResponse): ArtistBase => ({
    id: a.id,
    name: a.name,
    type: 'artist',
});

export const mapSong = (s: SaavnSongAPIResponse): Song => {
    const audio = audioFromSaavn(s.more_info?.encrypted_media_url);
    if (!audio) {
        throw new Error(`Audio missing for song ${s.id}`);
    }

    return {
        id: s.id,
        name: decodeHtml(s.title) ?? s.title,
        type: 'song',
        year: s.year ? Number(s.year) : null,
        release_date: s.more_info?.release_date ?? null,
        duration_ms: safeNumber(s.more_info?.duration),
        explicit: s.explicit_content === '1',
        language: s.language,
        disc_number: 0,
        track_number: 0,
        copyright: s.more_info?.copyright_text ?? null,
        album: {
            id: s.more_info?.album_id,
            name: decodeHtml(s.more_info?.album) ?? 'unknown album',
            type: 'album',
        },
        artists: s.more_info?.artistMap?.primary_artists?.map(mapArtistBase) ?? [],
        image: imgFromSaavn(s.image),
        audio,
    };
};

export const mapSongBase = (s: SaavnSongAPIResponse): SongBase => ({
    id: s.id,
    name: decodeHtml(s.title) ?? s.title,
    type: 'song',
    year: s.year ? Number(s.year) : null,
    duration_ms: safeNumber(s.more_info?.duration),
    explicit: s.explicit_content === '1',
    language: s.language,
    album: decodeHtml(s.more_info?.album) ?? 'unknown album',
    artists: s.more_info?.artistMap?.primary_artists?.map((a) => a.name).join(', ') ?? 'unknown artists',
    image: imgFromSaavn(s.image),
});

export const mapArtist = (a: SaavnArtistAPIResponse): Artist => ({
    id: a.artistId ?? a.id,
    name: a.name,
    type: 'artist',
    follower_count: safeNumber(a.follower_count),
    bio: (() => {
        try {
            return a.bio ? (JSON.parse(a.bio) as string) : null;
        } catch {
            return null;
        }
    })(),
    image: imgFromSaavn(a.image),
});

export const mapAlbum = (a: SaavnAlbumAPIResponse): Album => ({
    id: a.id,
    name: a.title,
    type: 'album',
    release_date: a.year ? `${a.year}-01-01` : '0000-01-01',
    language: a.language,
    explicit: a.explicit_content === '1',
    total_songs: safeNumber(a.more_info?.song_count),
    popularity: safeNumber(a.play_count),
    artists: a.more_info?.artistMap?.primary_artists?.map(mapArtistBase) ?? [],
    image: imgFromSaavn(a.image),
    songs: a.list?.map(mapSongBase) ?? null,
});

export const mapAlbumBase = (a: SaavnAlbumAPIResponse): Omit<Album, 'songs'> => ({
    id: a.id,
    name: a.title,
    type: 'album',
    release_date: a.year ? `${a.year}-01-01` : '0000-01-01',
    language: a.language,
    explicit: a.explicit_content === '1',
    total_songs: safeNumber(a.more_info?.song_count),
    popularity: safeNumber(a.play_count),
    artists: a.more_info?.artistMap?.primary_artists?.map(mapArtistBase) ?? [],
    image: imgFromSaavn(a.image),
});

export const mapPlaylist = (p: SaavnPlaylistAPIResponse): Playlist => ({
    id: p.id,
    name: p.title,
    description: p.header_desc,
    type: 'playlist',
    explicit: p.explicit_content === '1',
    total_songs: safeNumber(p.list_count),
    image: imgFromSaavn(p.image),
    songs: p.list?.map(mapSong) ?? null,
});

/* -------------------------------------------------------------------------- */
/*                              search mappers                                */
/* -------------------------------------------------------------------------- */

export const mapGlobalSearch = (s: SaavnSearchAPIResponse): GlobalSearchResult => ({
    topQuery: {
        results:
            s.topquery?.data.map((i) => ({
                id: i.id,
                name: i.title,
                type: i.type as 'song' | 'album' | 'artist' | 'playlist',
                image: imgFromSaavn(i.image),
                artists: i.more_info?.primary_artists,
            })) ?? [],
        position: s.topquery?.position ?? 0,
    },
    songs: {
        results:
            s.songs?.data.map((i) => ({
                id: i.id,
                name: i.title,
                type: 'song',
                image: imgFromSaavn(i.image),
                album: i.more_info?.album,
                artists: i.more_info?.primary_artists,
            })) ?? [],
        position: s.songs?.position ?? 0,
    },
    albums: {
        results:
            s.albums?.data.map((i) => ({
                id: i.id,
                name: i.title,
                type: 'album',
                image: imgFromSaavn(i.image),
                artists: i.more_info?.music,
            })) ?? [],
        position: s.albums?.position ?? 0,
    },
    artists: {
        results:
            s.artists?.data.map((i) => ({
                id: i.id,
                name: i.name ?? i.title,
                type: 'artist',
                image: imgFromSaavn(i.image),
            })) ?? [],
        position: s.artists?.position ?? 0,
    },
    playlists: {
        results:
            s.playlists?.data.map((i) => ({
                id: i.id,
                name: i.title,
                type: 'playlist',
                image: imgFromSaavn(i.image),
            })) ?? [],
        position: s.playlists?.position ?? 0,
    },
});

export const mapSearchAlbum = (a: SaavnSearchAlbumAPIResponse): SearchAlbum => ({
    total: safeNumber(a.total),
    start: safeNumber(a.start),
    results: a.results.map((i) => ({
        id: i.id,
        name: i.title,
        url: i.perma_url,
        release_date: i.year ? `${i.year}-01-01` : '0000-01-01',
        type: 'album',
        language: i.language,
        explicit: i.explicit_content === '1',
        image: imgFromSaavn(i.image),
    })),
});

export const mapSearchPlaylist = (p: SaavnSearchPlaylistAPIResponse): SearchPlaylist => ({
    total: safeNumber(p.total),
    start: safeNumber(p.start),
    results: p.results.map((i) => ({
        id: i.id,
        name: i.title,
        type: 'playlist',
        image: imgFromSaavn(i.image),
        url: i.perma_url,
        total_songs: safeNumber(i.more_info?.song_count),
        language: i.more_info?.language,
        explicit: i.explicit_content === '1',
    })),
});

export const mapSearchArtist = (a: SaavnSearchArtistAPIResponse): SearchArtist => ({
    total: safeNumber(a.total),
    start: safeNumber(a.start),
    results: a.results.map((i) => ({
        id: i.id,
        name: i.name,
        type: 'artist',
        image: imgFromSaavn(i.image),
    })),
});
