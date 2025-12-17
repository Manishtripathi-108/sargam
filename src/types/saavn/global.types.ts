export type SaavnSearchSection<T> = {
    results: T[];
    position: number;
};

export type SaavnSearchAPIResponseSection<T> = {
    data: T[];
    position: number;
};

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

export type SaavnLyrics = {
    lyrics: string;
    script_tracking_url: string;
    lyrics_copyright: string;
    snippet: string;
};
