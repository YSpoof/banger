import { createSignal } from "solid-js";

import { storageService } from "#lib/frontend/services/storage.js";
import { defaultProviders, type Provider } from "#lib/frontend/utils/providers.js";

const readStored = (): Provider => {
  if (typeof localStorage === "undefined") return defaultProviders[0];
  try {
    return storageService.getItem<Provider>("defaultBang") ?? defaultProviders[0];
  } catch (error) {
    console.error("Failed to load default bang:", error);
    return defaultProviders[0];
  }
};

const [defaultBang, setDefaultBang] = createSignal<Provider>(readStored());

const persist = (bang: Provider) => {
  if (typeof localStorage === "undefined") return;
  try {
    storageService.addItem("defaultBang", bang);
  } catch (error) {
    console.error("Failed to save default bang:", error);
  }
};

const change = (bang: Provider) => {
  setDefaultBang(bang);
  persist(bang);
};

export const defaultBangStore = {
  defaultBang,
  change,
};
