import {
  defaultProviders,
  type Provider,
  type ProviderValidationError,
} from "#lib/frontend/utils/providers.js";
import { doBangRedirect } from "./bangRedirect.js";
import { customProvidersStore } from "./customProviders.svelte.js";
import { defaultBangStore } from "./defaultBang.svelte.js";

class AppState {
  combinedProviders = $derived([...defaultProviders, ...customProvidersStore.customProviders]);

  get defaultBang() {
    return defaultBangStore.defaultBang;
  }

  get customProviders() {
    return customProvidersStore.customProviders;
  }

  changeDefaultBang = (bang: Provider) => {
    defaultBangStore.change(bang);
  };

  removeCustomProvider = (provider: Provider) => {
    customProvidersStore.remove(provider);
  };

  addCustomProvider = (provider: Provider): ProviderValidationError | null => {
    return customProvidersStore.add(provider);
  };

  testCustomProvider = (provider: Provider): ProviderValidationError | null => {
    return customProvidersStore.test(provider);
  };

  doRedirect = (): boolean => {
    return doBangRedirect(this.combinedProviders, defaultBangStore.defaultBang);
  };
}

export const appState = new AppState();
