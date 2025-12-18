import { IMAGE_FALLBACKS } from '../../constants/common.constants';
import type { Album } from '../../types/core/album.model';
import type { Artist, ArtistBase } from '../../types/core/artist.model';
import type { ImageAsset } from '../../types/core/image.model';
import type { Playlist } from '../../types/core/playlist.model';
import type { GlobalSearchResult, SearchAlbum, SearchPlaylist } from '../../types/core/search.model';
import type { Song, SongAudio, SongBase } from '../../types/core/song.model';
import type { SaavnAlbumAPIResponse, SaavnSearchAlbumAPIResponse } from '../../types/saavn/albums.types';
import type { SaavnArtistAPIResponse, SaavnArtistBaseAPIResponse } from '../../types/saavn/artists.type';
import type { SaavnPlaylistAPIResponse } from '../../types/saavn/playlist.types';
import type { SaavnSearchAPIResponse, SaavnSearchPlaylistAPIResponse } from '../../types/saavn/search.types';
import type { SaavnSongAPIResponse } from '../../types/saavn/song.types';
import crypto from 'node-forge';

/* -------------------------------------------------------------------------- */
/*                                   helpers                                  */
/* -------------------------------------------------------------------------- */

const AUDIO_QUALITIES = [
    { id: '_96', key: 'low' },
    { id: '_160', key: 'medium' },
    { id: '_320', key: 'high' },
] as const;

const IMG_SIZE_RX = /150x150|50x50/;
const HTTP_RX = /^http:\/\//;

const DES_KEY = '38346591';
const DES_IV = '00000000';

const decodeHtml = (v?: string | null) => v?.replace(/&amp;/g, '&').replace(/&quot;/g, '"') ?? null;

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
        acc[q.key] = base.replace('_96', q.id).replace(HTTP_RX, 'https://');
        return acc;
    }, {} as SongAudio);
};

const imgFromSaavn = (link?: string | null): ImageAsset => {
    if (!link || link.includes('default')) {
        return {
            low: IMAGE_FALLBACKS.AUDIO_COVER,
            medium: IMAGE_FALLBACKS.AUDIO_COVER,
            high: IMAGE_FALLBACKS.AUDIO_COVER,
        };
    }

    return {
        low: link.replace(IMG_SIZE_RX, '50x50').replace(HTTP_RX, 'https://'),
        medium: link.replace(IMG_SIZE_RX, '150x150').replace(HTTP_RX, 'https://'),
        high: link.replace(IMG_SIZE_RX, '500x500').replace(HTTP_RX, 'https://'),
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
    if (!audio) throw new Error(`Missing audio for song ${s.id}`);

    return {
        id: s.id,
        name: decodeHtml(s.title)!,
        type: 'song',
        year: s.year ? Number(s.year) : null,
        release_date: s.more_info?.release_date ?? null,
        duration: Number(s.more_info?.duration ?? 0),
        explicit: s.explicit_content === '1',
        language: s.language,
        disc_number: 0,
        track_number: 0,
        copyright: s.more_info?.copyright_text ?? null,
        album: {
            id: s.more_info?.album_id,
            name: decodeHtml(s.more_info?.album) || 'unknown album',
            type: 'album',
        },
        artists: s.more_info?.artistMap?.primary_artists?.map(mapArtistBase) ?? [],
        image: imgFromSaavn(s.image),
        audio,
    };
};

export const mapSongBase = (s: SaavnSongAPIResponse): SongBase => {
    return {
        id: s.id,
        name: decodeHtml(s.title)!,
        type: 'song',
        year: s.year ? Number(s.year) : null,
        duration: Number(s.more_info?.duration ?? 0),
        explicit: s.explicit_content === '1',
        language: s.language,
        album: decodeHtml(s.more_info?.album) || 'unknown album',
        artists: s.more_info?.artistMap?.primary_artists?.join(', ') ?? 'unknown artists',
        image: imgFromSaavn(s.image),
    };
};

export const mapArtist = (a: SaavnArtistAPIResponse): Artist => ({
    id: a.artistId ?? a.id,
    name: a.name,
    type: 'artist',
    followerCount: Number(a.follower_count ?? 0),
    bio: a.bio ? JSON.parse(a.bio) : null,
    image: imgFromSaavn(a.image),
});

export const mapAlbum = (a: SaavnAlbumAPIResponse): Album => ({
    id: a.id,
    name: a.title,
    type: 'album',
    release_date: a.year ? `${a.year}-01-01` : '0000-01-01',
    language: a.language,
    explicit: a.explicit_content === '1',
    total_songs: Number(a.more_info?.song_count ?? 0),
    popularity: Number(a.play_count ?? 0),
    artists: a.more_info?.artistMap?.artists?.map(mapArtistBase) ?? [],
    image: imgFromSaavn(a.image),
    songs: a.list?.map(mapSongBase) ?? null,
});

export const mapPlaylist = (p: SaavnPlaylistAPIResponse): Playlist => ({
    id: p.id,
    name: p.title,
    description: p.header_desc,
    type: 'playlist',
    explicit: p.explicit_content === '1',
    total_songs: Number(p.list_count ?? 0),
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
    total: Number(a.total),
    start: Number(a.start),
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
    total: Number(p.total),
    start: Number(p.start),
    results: p.results.map((i) => ({
        id: i.id,
        name: i.title,
        type: 'playlist',
        image: imgFromSaavn(i.image),
        url: i.perma_url,
        total_songs: Number(i.more_info?.song_count ?? 0),
        language: i.more_info?.language,
        explicit: i.explicit_content === '1',
    })),
});
