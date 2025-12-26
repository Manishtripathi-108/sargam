/**
 * Saavn API Common Types
 * Shared shapes and reusable fragments across all Saavn responses
 */

/**
 * Base entity structure used in multiple Saavn responses
 */
export type SaavnEntityBase = {
    id: string;
    title: string;
    type: string;
    image: string;
    description: string;
    mini_obj: boolean;
    perma_url: string;
    subtitle: string;
    explicit_content?: string;
};

/**
 * Base artist reference
 */
export type SaavnArtistBase = {
    id: string;
    name: string;
    role?: string;
    type: string;
};

/**
 * Artist reference with image and perma link
 */
export type SaavnArtistBaseResponse = SaavnArtistBase & {
    image: string;
    perma_url: string;
};

/**
 * Artist URLs mapping
 */
export type SaavnArtistUrls = {
    albums: string;
    bio: string;
    comments: string;
    songs: string;
    overview: string;
};

/**
 * Social links for artists
 */
export type SaavnSocialLinks = {
    dob: string | null;
    fb: string | null;
    twitter: string | null;
    wiki: string | null;
};

/**
 * Rights information in responses
 */
export type SaavnRights = {
    code: string;
    cacheable: string;
    delete_cached_object: string;
    reason: string;
};

/**
 * Language information
 */
export type SaavnLanguage = {
    language?: string;
};

/**
 * API response metadata
 */
export type SaavnApiMeta = {
    total?: number;
    start?: number;
    last_page?: boolean;
};

/**
 * Pagination metadata
 */
export type SaavnPaging = {
    total?: number;
    start?: number;
    position?: number;
};

/**
 * Lyrics information
 */
export type SaavnLyrics = {
    lyrics: string;
    script_tracking_url: string;
    lyrics_copyright: string;
    snippet: string;
};

/**
 * Search section with generic items
 */
export type SaavnSearchSection<T> = {
    results: T[];
    position: number;
};

/**
 * Normalized search response section
 */
export type SaavnSearchResponseSection<T> = {
    data: T[];
    position: number;
};
