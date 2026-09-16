import { createMemo } from "solid-js";

import { doBangRedirect } from "#lib/frontend/stores/bangRedirect.js";
import { customProvidersStore } from "#lib/frontend/stores/customProviders.js";
import { defaultBangStore } from "#lib/frontend/stores/defaultBang.js";
import {
  defaultProviders,
  type Provider,
  type ProviderValidationError,
} from "#lib/frontend/utils/providers.js";

const combinedProviders = createMemo(() => [
  ...defaultProviders,
  ...customProvidersStore.customProviders(),
]);

const changeDefaultBang = (bang: Provider) => {
  defaultBangStore.change(bang);
};

const removeCustomProvider = (provider: Provider) => {
  customProvidersStore.remove(provider);
};

const addCustomProvider = (provider: Provider): ProviderValidationError | null => {
  return customProvidersStore.add(provider);
};

const testCustomProvider = (provider: Provider): ProviderValidationError | null => {
  return customProvidersStore.test(provider);
};

const doRedirect = (): boolean => {
  return doBangRedirect(combinedProviders(), defaultBangStore.defaultBang());
};

export const appState = {
  combinedProviders,
  defaultBang: defaultBangStore.defaultBang,
  customProviders: customProvidersStore.customProviders,
  changeDefaultBang,
  removeCustomProvider,
  addCustomProvider,
  testCustomProvider,
  doRedirect,
};
