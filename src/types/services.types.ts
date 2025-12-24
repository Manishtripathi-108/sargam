export type SearchParams = {
    query: string;
    limit: number;
    offset: number;
};

export type GlobalSearchParams = SearchParams & {
    type: 'song' | 'album' | 'artist' | 'playlist' | 'all';
};
