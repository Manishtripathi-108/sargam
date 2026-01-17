import { GaanaProvider } from '../providers/gaana/gaana.provider';
import { QobuzProvider } from '../providers/qobuz/qobuz.provider';
import { SaavnProvider } from '../providers/saavn/saavn.provider';
import type { Provider } from '../validators/common.validators';
import { AppError } from './error.utils';

export type ServiceOptions = {
    provider: Provider;
};

const providerRegistry = {
    qobuz: QobuzProvider,
    saavn: SaavnProvider,
    gaana: GaanaProvider,
};

/**
 * Resolves a provider instance based on the given options.
 * Defaults to 'saavn' if no provider is specified.
 * @param opts - Optional service options containing the provider name.
 * @returns The provider instance.
 * @throws {AppError} If the provider is not found in the registry.
 * @example
 * resolveProvider() => SaavnProvider
 * resolveProvider({ provider: 'gaana' }) => GaanaProvider
 */
export function resolveProvider(opts: ServiceOptions) {
    const provider = providerRegistry[opts.provider];
    if (!provider) {
        throw new AppError('Provider not found', 500);
    }
    return provider;
}
