/**
 * Gaana Search Response Types
 */

/* ========================= Main Search Response ========================= */

/**
 * Root search response from Gaana Search API
 */
export type GaanaSearchResponse = {
    topFacet: 'Mix' | 'Track';
    gr: GaanaSearchGroup[];
    srId: string;
    algo: 'NEWSEARCH';
    action: number;
    q: string;
    originalQuery: string;
    abFlag: number;
};

/**
 * Search result group - discriminated union by type
 */
export type GaanaSearchGroup =
    | GaanaSearchTrackGroup
    | GaanaSearchArtistGroup
    | GaanaSearchAlbumGroup
    | GaanaSearchPlaylistGroup;

type GaanaSearchGroupBase<TType extends string, TText extends string> = {
    ty: TType;
    topSc: number;
    va: string;
    gd: GaanaSearchItem[];
    stxt: TText;
};

/**
 * Track search group
 */
export type GaanaSearchTrackGroup = GaanaSearchGroupBase<'Track', 'Songs'>;

/**
 * Artist search group
 */
export type GaanaSearchArtistGroup = GaanaSearchGroupBase<'Artist', 'Artists'>;

/**
 * Album search group
 */
export type GaanaSearchAlbumGroup = GaanaSearchGroupBase<'Album', 'Albums'>;

/**
 * Playlist search group
 */
export type GaanaSearchPlaylistGroup = GaanaSearchGroupBase<'Playlist', 'Playlists'>;

/* ========================= Search Items ========================= */

/**
 * Search item - discriminated union by type
 */
export type GaanaSearchItem =
    | GaanaSearchTrackItem
    | GaanaSearchArtistItem
    | GaanaSearchAlbumItem
    | GaanaSearchPlaylistItem;

type GaanaSearchItemBase<TType extends string> = {
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
    isPc?: string;
    pw?: number;
    hf?: number;
    langBoostValue?: number;
    tags?: string[];
};

/**
 * Track search item
 */
export type GaanaSearchTrackItem = GaanaSearchItemBase<'Track'> & {
    alist: string;
    isrc: string;
};

/**
 * Artist search item
 */
export type GaanaSearchArtistItem = GaanaSearchItemBase<'Artist'>;

/**
 * Album search item
 */
export type GaanaSearchAlbumItem = GaanaSearchItemBase<'Album'> & {
    cat: string;
    alist: string;
};

/**
 * Playlist search item
 */
export type GaanaSearchPlaylistItem = GaanaSearchItemBase<'Playlist'> & {
    alist: string;
};

/* ========================= Global Search Response ========================= */

/**
 * Global search response from different endpoint
 */
export type GlobalSearchResponse = {
    topFacet: string;
    gr: GlobalSearchGroup[];
    srId: string;
    algo: string;
    action: number;
    q: string;
    originalQuery: string;
    abFlag: number;
    tabs: GlobalSearchTab[];
};

/**
 * Global search group
 */
export type GlobalSearchGroup = {
    ty: GlobalSearchGroupType;
    topSc: number;
    va: string;
    gd: GlobalSearchItem[];
    stxt: string;
};

export type GlobalSearchGroupType = 'Mix' | 'Artist' | 'Track' | 'Album' | 'Playlist' | 'Show';

/**
 * Global search item
 */
export type GlobalSearchItem = {
    iid: string;
    id: number;
    ti: string;
    aw: string;
    sti: string;
    lang: string[];
    seo: string;
    ty: GlobalSearchItemType;
    language: string;
    scoreF: number;
    boostValue: number;
    langBoostValue?: number;
    isPc?: string;
    pw?: number;
    alist?: string;
    isrc?: string;
    cat?: string;
    isDolby?: boolean;
    hf?: number;
    isExactMatch?: boolean;
    tags?: string[];
};

export type GlobalSearchItemType = 'Track' | 'Album' | 'Artist' | 'Playlist' | 'Show';

/**
 * Global search tab
 */
export type GlobalSearchTab = {
    dispV: string;
    id: number;
    paramV: string;
    shNew: number;
};
