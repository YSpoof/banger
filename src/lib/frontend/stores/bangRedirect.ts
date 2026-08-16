import { redirect } from "#lib/frontend/utils/misc.js";
import { PLACEHOLDER_TOKEN } from "#lib/frontend/utils/providers.js";
import type { Provider } from "#lib/frontend/utils/providers.js";

export const getBangUrlRedirect = (
  combinedProviders: Provider[],
  defaultBang: Provider,
): string | null => {
  const url = new URL(globalThis.location.href);
  const query = url.searchParams.get("q")?.trim();

  if (!query) return null;

  const bangMatch = /!(\S+)/i.exec(query);
  const bang = bangMatch?.[1]?.toLowerCase();

  if (bang === "cfg") return null;

  const realBang = combinedProviders.find((provider) => provider.bang === bang) ?? defaultBang;
  const cleanQuery = query.replace(/!\S+\s*/i, "").trim();

  // If the query is empty, return the provider's base URL
  if (!cleanQuery) {
    const urlEndIndex = realBang.url.indexOf("/", 8);
    return urlEndIndex > -1 ? realBang.url.slice(0, urlEndIndex) : realBang.url;
  }

  return realBang.url.replace(PLACEHOLDER_TOKEN, encodeURIComponent(cleanQuery));
};

export const doBangRedirect = (combinedProviders: Provider[], defaultBang: Provider): boolean => {
  let redirected = false;
  const redirectUrl = getBangUrlRedirect(combinedProviders, defaultBang);
  if (redirectUrl) {
    redirect(redirectUrl);
    redirected = true;
  }
  return redirected;
};
