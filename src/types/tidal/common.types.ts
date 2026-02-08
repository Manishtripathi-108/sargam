/* -------------------------------------------------------------------------- */
/*                                BASE TYPES                                  */
/* -------------------------------------------------------------------------- */

export type TidalImageSizes = 'SMALL' | 'MEDIUM' | 'LARGE' | 'XL';

export type TidalAudioQuality = 'LOW' | 'HIGH' | 'LOSSLESS' | 'HI_RES' | 'HI_RES_LOSSLESS';

export type TidalAudioMode = 'STEREO' | 'DOLBY_ATMOS' | 'SONY_360RA';

/* -------------------------------------------------------------------------- */
/*                              ARTIST TYPES                                  */
/* -------------------------------------------------------------------------- */

export type TidalArtist = {
    id: number;
    name: string;
    artistTypes?: string[];
    picture?: string;
    popularity?: number;
    url?: string;
};

/* -------------------------------------------------------------------------- */
/*                               ALBUM TYPES                                  */
/* -------------------------------------------------------------------------- */

export type TidalAlbumBase = {
    id: number;
    title: string;
    cover: string;
    releaseDate: string;
};

export type TidalAlbum = TidalAlbumBase & {
    duration: number;
    numberOfTracks: number;
    numberOfVolumes: number;
    copyright?: string;
    type: string;
    explicit: boolean;
    upc?: string;
    audioQuality: TidalAudioQuality;
    audioModes: TidalAudioMode[];
    artist: TidalArtist;
    artists: TidalArtist[];
    mediaMetadata?: TidalMediaMetadata;
};

export type TidalSearchAlbum = TidalAlbumBase & {
    numberOfTracks: number;
    explicit: boolean;
    audioQuality: TidalAudioQuality;
    artist: TidalArtist;
};

/* -------------------------------------------------------------------------- */
/*                               TRACK TYPES                                  */
/* -------------------------------------------------------------------------- */

export type TidalMediaMetadata = {
    tags: string[];
};

export type TidalTrack = {
    id: number;
    title: string;
    duration: number;
    trackNumber: number;
    volumeNumber: number;
    isrc: string;
    explicit: boolean;
    audioQuality: TidalAudioQuality;
    copyright?: string;
    album: TidalAlbumBase;
    artist: TidalArtist;
    artists: TidalArtist[];
    mediaMetadata?: TidalMediaMetadata;
};

/* -------------------------------------------------------------------------- */
/*                              USER TYPES                                    */
/* -------------------------------------------------------------------------- */

export type TidalUser = {
    id: number;
    nickname?: string;
    picture?: string;
};

/* -------------------------------------------------------------------------- */
/*                            PLAYLIST TYPES                                  */
/* -------------------------------------------------------------------------- */

export type TidalPlaylist = {
    uuid: string;
    title: string;
    description?: string;
    duration: number;
    numberOfTracks: number;
    lastUpdated: string;
    created: string;
    type: string;
    publicPlaylist: boolean;
    url?: string;
    image?: string;
    squareImage?: string;
    creator?: TidalUser;
    popularity?: number;
};

export type TidalPlaylistItem = {
    item: TidalTrack;
    type: string;
    cut?: {
        name: string;
        startTime?: number;
        endTime?: number;
    };
};

/* -------------------------------------------------------------------------- */
/*                            PAGINATION TYPES                                */
/* -------------------------------------------------------------------------- */

export type TidalPaginatedResponse<T> = {
    items: T[];
    limit: number;
    offset: number;
    totalNumberOfItems: number;
};
