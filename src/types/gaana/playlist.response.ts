import type { GaanaTrackResponse } from './track.response';

/**
 * Playlist detail response from Gaana API
 * Structure to be defined based on actual API usage
 */
export type GaanaPlaylistResponse = {
    playlist_id?: string;
    title?: string;
    artwork?: string;
    tracks?: GaanaTrackResponse[];
    // Additional fields to be added as discovered
};
