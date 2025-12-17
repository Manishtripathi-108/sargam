export type SaavnDownloadLink = {
    quality: '12kbps' | '48kbps' | '96kbps' | '160kbps' | '320kbps';
    url: string;
};

export type SaavnImageLink = { quality: '50x50' | '150x150' | '500x500'; url: string };

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

export type SaavnNormalizedEntityBase = {
    id: string;
    title: string;
    image: SaavnImageLink[];
    type: string;
    description: string;
};

export type SaavnLyrics = {
    lyrics: string;
    script_tracking_url: string;
    lyrics_copyright: string;
    snippet: string;
};
