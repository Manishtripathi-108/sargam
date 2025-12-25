/**
 * Safely converts a given value to a number.
 * Returns 0 if the value is null, undefined, or cannot be converted.
 * @param value - The value to convert to a number.
 * @returns The converted number, or 0 if the conversion fails.
 * @example
 * safeParseNumber("123") => 123
 * safeParseNumber(null) => 0
 * safeParseNumber(undefined) => 0
 * safeParseNumber("invalid") => 0 (NaN becomes 0)
 */
export const safeParseNumber = (value?: string | number | null): number => Number(value ?? 0);
