/**
 * Root search response
 */
export type GaanaSearchResponse = {
    topFacet: 'Mix' | 'Track';
    /* Search result groups */
    gr: GaanaSearchGroup[];
    srId: string;
    algo: 'NEWSEARCH';
    action: number;
    q: string;
    originalQuery: string;
    abFlag: number;
};

/**
 * Search result groups
 */
export type GaanaSearchGroup =
    | GaanaSearchTrackGroup
    | GaanaSearchArtistGroup
    | GaanaSearchAlbumGroup
    | GaanaSearchPlaylistGroup;

type GaanaSearchGroupBase<TType, TText> = {
    ty: TType;
    topSc: number;
    va: string;
    /* Search items */
    gd: GaanaSearchItem[];
    stxt: TText;
};

export type GaanaSearchTrackGroup = GaanaSearchGroupBase<'Track', 'Songs'>;
export type GaanaSearchArtistGroup = GaanaSearchGroupBase<'Artist', 'Artists'>;
export type GaanaSearchAlbumGroup = GaanaSearchGroupBase<'Album', 'Albums'>;
export type GaanaSearchPlaylistGroup = GaanaSearchGroupBase<'Playlist', 'Playlists'>;

/**
 * Search items
 */
export type GaanaSearchItem =
    | GaanaSearchTrackItem
    | GaanaSearchArtistItem
    | GaanaSearchAlbumItem
    | GaanaSearchPlaylistItem;

/* ---------------------------- Base search item ---------------------------- */
type GaanaSearchItemBase<TType> = {
    iid: string;
    id: number;
    ti: string;
    aw: string;
    sti: string;
    lang: string[];
    seo: string;
    ty: TType;
    language: string;
    scoreF: number;
    boostValue: number;
    isPc: string;
    pw: number;
    hf?: number;
    langBoostValue?: number;
    tags?: string[];
};

/* ------------------------------ Item variants ----------------------------- */
export type GaanaSearchTrackItem = GaanaSearchItemBase<'Track'> & {
    alist: string;
    isrc: string;
};

export type GaanaSearchArtistItem = GaanaSearchItemBase<'Artist'>;

export type GaanaSearchAlbumItem = GaanaSearchItemBase<'Album'> & {
    cat: string;
    alist: string;
};

export type GaanaSearchPlaylistItem = GaanaSearchItemBase<'Playlist'> & {
    alist: string;
};
