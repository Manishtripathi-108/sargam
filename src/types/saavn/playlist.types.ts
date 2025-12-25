import type { SaavnSongResponse } from '../../types/saavn/song.types';

export type SaavnPlaylistResponse = {
    id: string;
    title: string;
    subtitle: string;
    type: string;
    image: string;
    perma_url: string;
    explicit_content: string;
    language: string;
    year: string;
    play_count: string;
    list_count: string;
    list_type: string;
    list: SaavnSongResponse[];
    description: string;
    header_desc: string;
    more_info: {
        uid: string;
        firstname: string;
        lastname: string;
        is_dolby_content: boolean;
        subtype?: string[];
        last_updated: string;
        username: string;
        is_followed: string;
        isFY: boolean;
        follower_count: string;
        fan_count: string;
        playlist_type: string;
        share: string;
        sub_types: string[];
        images: string[];
        H2: string | null;
        subheading: string;
        video_count: string;
        artists: {
            id: string;
            name: string;
            role: string;
            image: string;
            type: string;
            perma_url: string;
        }[];
    };
};
