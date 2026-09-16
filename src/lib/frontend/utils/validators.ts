import { PLACEHOLDER_TOKEN } from "#lib/frontend/utils/providers.js";

export const validateUrl = (url: string): boolean => {
  if (!url.includes(PLACEHOLDER_TOKEN)) return false;

  try {
    new URL(url.replace(PLACEHOLDER_TOKEN, "test"));
    return true;
  } catch {
    return false;
  }
};
