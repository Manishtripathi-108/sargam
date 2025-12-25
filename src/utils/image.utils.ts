import { IMAGE_FALLBACKS } from '../constants/common.constants';
import type { ImageAsset } from '../types/core/image.model';

/**
 * Returns an ImageAsset with all quality levels set to the fallback audio cover image.
 * Used when no image is provided for an audio entity.
 * @returns An ImageAsset with low, medium, and high fields set to the fallback image.
 * @example
 * createFallbackImageAsset() => { low: "...", medium: "...", high: "..." }
 */
export const createFallbackImageAsset = (): ImageAsset => ({
    low: IMAGE_FALLBACKS.AUDIO_COVER,
    medium: IMAGE_FALLBACKS.AUDIO_COVER,
    high: IMAGE_FALLBACKS.AUDIO_COVER,
});
