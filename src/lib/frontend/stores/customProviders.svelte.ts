import { storageService } from "#lib/frontend/services/storage.js";
import { openNewTab } from "#lib/frontend/utils/misc.js";
import {
  normalizeProviderInput,
  PLACEHOLDER_TOKEN,
  ProviderValidationError,
} from "#lib/frontend/utils/providers.js";
import type { Provider } from "#lib/frontend/utils/searchProviders.js";
import { validateUrl } from "#lib/frontend/utils/validators.js";

class CustomProvidersStore {
  customProviders = $state<Provider[]>([]);

  constructor() {
    this.load();
  }

  load = () => {
    try {
      const loaded = storageService.getItem<Provider[]>("customProviders");
      this.customProviders = loaded || [];
    } catch (error) {
      console.error("Failed to load custom providers:", error);
      this.customProviders = [];
    }
  };

  save = () => {
    try {
      storageService.addItem("customProviders", this.customProviders);
    } catch (error) {
      console.error("Failed to save custom providers:", error);
    }
  };

  add = (provider: Provider): ProviderValidationError | null => {
    const normalizedProvider = normalizeProviderInput(provider);
    if (!normalizedProvider) return ProviderValidationError.EmptyFields;

    if (this.exists(normalizedProvider)) return ProviderValidationError.DuplicateBang;

    if (!validateUrl(normalizedProvider.url)) return ProviderValidationError.InvalidUrl;

    this.customProviders.push(normalizedProvider);
    this.save();
    return null;
  };

  exists = (provider: Provider) => {
    return this.customProviders.some((p) => p.bang === provider.bang);
  };

  remove = (provider: Provider) => {
    this.customProviders = this.customProviders.filter((p) => p.bang !== provider.bang);
    this.save();
  };

  test = (provider: Provider): ProviderValidationError | null => {
    const normalized = normalizeProviderInput(provider);
    if (!normalized) return ProviderValidationError.EmptyFields;

    if (!validateUrl(normalized.url)) return ProviderValidationError.InvalidUrl;

    openNewTab(normalized.url.replace(PLACEHOLDER_TOKEN, "Banger LZArt"));
    return null;
  };
}

export const customProvidersStore = new CustomProvidersStore();
