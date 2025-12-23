import { SaavnProvider } from '../providers/saavn/saavn.provider';
import { AppError } from '../utils/error.utils';

export type ProviderName = 'saavn';

export interface ServiceOptions {
    provider?: ProviderName;
}

const providers = {
    saavn: SaavnProvider,
};

export function getProvider(opts?: ServiceOptions) {
    const provider = providers[opts?.provider ?? 'saavn'];
    if (!provider) {
        throw new AppError('Provider not found', 500);
    }
    return provider;
}
