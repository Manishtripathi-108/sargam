/**
 * Decodes a given string from HTML entities.
 * @param value - The string to decode from HTML entities.
 * @returns The decoded string, or null if the input is null or undefined.
 * @example
 * decodeHtmlEntities("&amp;") => "&"
 * decodeHtmlEntities("&quot;test&quot;") => '"test"'
 * decodeHtmlEntities(null) => null
 */
export const decodeHtmlEntities = (value?: string | null): string | null =>
    value ? value.replace(/&amp;/g, '&').replace(/&quot;/g, '"') : null;
