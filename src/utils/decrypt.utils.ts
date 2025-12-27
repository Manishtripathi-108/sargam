import type { SongAudio } from '../types/core/song.model';
import type { Provider } from '../validators/common.validators';
import { upgradeToHttps } from './url.utils';
import forge from 'node-forge';

const GAANA_IV = 'asd!@#!@#@!12312';
const GAANA_KEY = 'g@1n!(f1#r.0$)&%';

const SAAVN_KEY = '38346591';

export const decryptAudio = (provider: Provider, encrypted?: string): SongAudio | null => {
    switch (provider) {
        case 'gaana':
            return decryptGaanaAudio(encrypted);
        case 'saavn':
            return decryptSaavnAudio(encrypted);
        default:
            return null;
    }
};

const generateAudioQualities = (
    baseUrl: string,
    pattern: string,
    qualities: readonly [string, string, string, string]
): SongAudio => ({
    very_low: baseUrl.replace(pattern, qualities[0]),
    low: baseUrl.replace(pattern, qualities[1]),
    medium: baseUrl.replace(pattern, qualities[2]),
    high: baseUrl.replace(pattern, qualities[3]),
});

export function decryptGaanaAudio(encrypted?: string): SongAudio | null {
    if (!encrypted?.trim()) return null;

    const encryptedBytes = forge.util.decode64(encrypted);

    const decipher = forge.cipher.createDecipher('AES-CBC', GAANA_KEY);
    decipher.start({ iv: GAANA_IV });
    decipher.update(forge.util.createBuffer(encryptedBytes));
    if (!decipher.finish()) return null;

    const baseUrl = decipher.output.getBytes();

    return generateAudioQualities(baseUrl, '64.mp4', ['16.mp4', '64.mp4', '128.mp4', '320.mp4']);
}

export function decryptSaavnAudio(encrypted?: string): SongAudio | null {
    if (!encrypted?.trim()) return null;

    const decipher = forge.cipher.createDecipher('DES-ECB', SAAVN_KEY);

    decipher.start();
    decipher.update(forge.util.createBuffer(forge.util.decode64(encrypted)));
    if (!decipher.finish()) return null;

    const baseUrl = upgradeToHttps(decipher.output.getBytes());

    return generateAudioQualities(baseUrl, '_96', ['_12', '_96', '_160', '_320']);
}
