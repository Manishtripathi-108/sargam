/**
 * Artist detail response from Gaana API
 * Structure to be defined based on actual API usage
 */
export type GaanaArtistResponse = {
    artist_id: string;
    name: string;
    seokey: string;
    artwork: string;
    artwork_175x175: string;
    atw: string;
    cached: number;
    isWebp: number;
    popularity: number;
    favorite_count?: string;
    // Additional fields to be added as discovered
};

/**
 * Artist top tracks response
 * Structure to be defined based on actual API usage
 */
export type GaanaArtistTracksResponse = {
    // To be implemented when artist tracks endpoint is used
    tracks?: unknown[];
};
