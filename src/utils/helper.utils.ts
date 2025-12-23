import { IMAGE_FALLBACKS } from '../constants/common.constants';
import type { ImageAsset } from '../types/core/image.model';
import type { Paginated } from '../types/core/pagination.model';
import type { ZodFastifySchemaValidationError } from 'fastify-type-provider-zod';

const HTTP_RX = /^http:\/\//;

/**
 * Normalizes a Zod path by removing leading slashes and returning 'root' if the path is empty.
 * @example
 * normalizeZodPath("/body/email") => "body/email"
 * normalizeZodPath("/email") => "email"
 * normalizeZodPath("") => "root"
 * @param p - The Zod path to normalize
 * @returns The normalized Zod path
 */
const normalizeZodPath = (p: string) => {
    // zod paths look like "/body/email" or "/email", so remove leading slash(es)
    const trimmed = p?.replace(/^\/+/, '') ?? '';
    return trimmed || 'root';
};

/**
 * Takes an array of Zod validation errors and formats them into
 * a more readable format. Zod paths are normalized to remove leading
 * slashes, and the resulting array is sorted by path and then message.
 *
 * @param issues - An array of ZodFastifySchemaValidationError objects.
 * @returns An array of objects with `path` and `message` properties,
 * sorted by `path` and then `message`.
 */
export const formatAndSortZodIssues = (issues: ZodFastifySchemaValidationError[]) => {
    return issues
        .map((i) => ({ path: normalizeZodPath(i.instancePath), message: i.message }))
        .sort((a, b) => {
            // primary: path, secondary: message
            if (a.path < b.path) return -1;
            if (a.path > b.path) return 1;
            const msgA = a.message ?? '';
            const msgB = b.message ?? '';
            return msgA < msgB ? -1 : msgA > msgB ? 1 : 0;
        });
};

/**
 * Replaces the HTTP protocol in a given URL with HTTPS.
 * @param v - The URL to replace the protocol in.
 * @returns The URL with the protocol replaced.
 */
export const toHttps = (v: string) => v.replace(HTTP_RX, 'https://');

/**
 * Decodes a given string from HTML entities.
 * @param v - The string to decode from HTML entities.
 * @returns The decoded string.
 */
export const decodeHtml = (v?: string | null): string | null =>
    v ? v.replace(/&amp;/g, '&').replace(/&quot;/g, '"') : null;

/**
 * Safely converts a given value to a number.
 * @param v - The value to convert to a number.
 * @returns The converted number, or 0 if the conversion fails.
 */
export const safeNumber = (v?: string | number | null): number => Number(v ?? 0);

/**
 * Returns an ImageAsset with all fields set to the audio cover fallback image.
 * This is used when no image is provided for an audio cover.
 * @returns An ImageAsset with low, medium, and high fields set to the audio cover fallback image.
 */
export const fallbackImage = (): ImageAsset => ({
    low: IMAGE_FALLBACKS.AUDIO_COVER,
    medium: IMAGE_FALLBACKS.AUDIO_COVER,
    high: IMAGE_FALLBACKS.AUDIO_COVER,
});

/**
 * Creates a Paginated object from the given parameters.
 * @template T - The type of the items in the Paginated object.
 * @param {Object} params - An object containing the items, total, offset, and limit.
 * @param {T[]} params.items - The items to be paginated.
 * @param {number} params.total - The total number of items.
 * @param {number} params.offset - The offset of the current page.
 * @param {number} [params.limit] - The limit of items per page. Defaults to the length of the items array.
 * @returns {Paginated<T>} - A Paginated object containing the items, total, offset, limit, and a hasNext flag indicating whether there are more items to fetch.
 */
export const createPagination = <T>({
    items,
    total,
    offset,
    limit,
    hasNext,
}: {
    items: T[];
    total: number;
    offset: number;
    limit?: number;
    hasNext?: boolean;
}): Paginated<T> => {
    const size = items.length;
    const safeLimit = limit && limit > 0 ? limit : size;

    return {
        total,
        offset,
        limit: safeLimit,
        hasNext: hasNext ?? offset + size < total,
        items,
    };
};
