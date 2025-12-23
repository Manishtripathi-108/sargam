export const isDev = process.env.NODE_ENV !== 'production';

export const normalizePagination = (limit: number, offset: number) => {
    const safeLimit = Math.max(1, Math.min(limit || 10, 100));
    const safeOffset = Math.max(0, offset || 0);
    const page = Math.floor(safeOffset / safeLimit);
    return { page, limit: safeLimit, offset: safeOffset };
};
