import { createSignal } from "solid-js";

import { storageService } from "#lib/frontend/services/storage.js";
import { openNewTab } from "#lib/frontend/utils/misc.js";
import {
  normalizeProviderInput,
  PLACEHOLDER_TOKEN,
  ProviderValidationError,
  type Provider,
} from "#lib/frontend/utils/providers.js";
import { validateUrl } from "#lib/frontend/utils/validators.js";

const readStored = (): Provider[] => {
  if (typeof localStorage === "undefined") return [];
  try {
    return storageService.getItem<Provider[]>("customProviders") || [];
  } catch (error) {
    console.error("Failed to load custom providers:", error);
    return [];
  }
};

const [customProviders, setCustomProviders] = createSignal<Provider[]>(readStored());

const persist = (providers: Provider[]) => {
  if (typeof localStorage === "undefined") return;
  try {
    storageService.addItem("customProviders", providers);
  } catch (error) {
    console.error("Failed to save custom providers:", error);
  }
};

const exists = (provider: Provider) => {
  return customProviders().some((p) => p.bang === provider.bang);
};

const add = (provider: Provider): ProviderValidationError | null => {
  const normalizedProvider = normalizeProviderInput(provider);
  if (!normalizedProvider) return ProviderValidationError.EmptyFields;

  if (exists(normalizedProvider)) return ProviderValidationError.DuplicateBang;

  if (!validateUrl(normalizedProvider.url)) return ProviderValidationError.InvalidUrl;

  const next = [...customProviders(), normalizedProvider];
  setCustomProviders(next);
  persist(next);
  return null;
};

const remove = (provider: Provider) => {
  const next = customProviders().filter((p) => p.bang !== provider.bang);
  setCustomProviders(next);
  persist(next);
};

const test = (provider: Provider): ProviderValidationError | null => {
  const normalized = normalizeProviderInput(provider);
  if (!normalized) return ProviderValidationError.EmptyFields;

  if (!validateUrl(normalized.url)) return ProviderValidationError.InvalidUrl;

  openNewTab(normalized.url.replace(PLACEHOLDER_TOKEN, "Banger LZArt"));
  return null;
};

export const customProvidersStore = {
  customProviders,
  add,
  remove,
  test,
};
