import type { SearchType } from '../validators/common.validators';

export type SearchParams = {
    query: string;
    limit: number;
    offset: number;
};

export type GlobalSearchParams = SearchParams & {
    type: SearchType;
};
