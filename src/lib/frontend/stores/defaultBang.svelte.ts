import { storageService } from "#lib/frontend/services/storage.js";
import { defaultProviders, type Provider } from "#lib/frontend/utils/providers.js";

class DefaultBangStore {
  defaultBang = $state<Provider>(defaultProviders[0]);

  constructor() {
    this.load();
  }

  load = () => {
    try {
      const loaded = storageService.getItem<Provider>("defaultBang");
      this.defaultBang = loaded ?? defaultProviders[0];
    } catch (error) {
      console.error("Failed to load default bang:", error);
      this.defaultBang = defaultProviders[0];
    }
  };

  save = () => {
    try {
      storageService.addItem("defaultBang", this.defaultBang);
    } catch (error) {
      console.error("Failed to save default bang:", error);
    }
  };

  change = (bang: Provider) => {
    this.defaultBang = bang;
    this.save();
  };
}

export const defaultBangStore = new DefaultBangStore();
