export interface Provider {
  bang: string;
  name: string;
  url: string;
  isCustom?: boolean;
}

export const PLACEHOLDER_TOKEN = "_PLACEHOLDER_";

export const EMPTY_PROVIDER: Provider = {
  bang: "",
  name: "",
  url: "",
};

export enum ProviderValidationError {
  EmptyFields = "empty_fields",
  DuplicateBang = "duplicate_bang",
  InvalidUrl = "invalid_url",
}

export const providerValidationMessage = (error: ProviderValidationError): string => {
  switch (error) {
    case ProviderValidationError.EmptyFields:
      return "Preencha todos os campos";
    case ProviderValidationError.DuplicateBang:
      return "Bang já existe";
    case ProviderValidationError.InvalidUrl:
      return `URL inválida. Use "${PLACEHOLDER_TOKEN}" no lugar da busca`;
  }
};

export const normalizeProviderInput = (provider: Provider): Provider | null => {
  const name = provider.name.trim();
  const bang = provider.bang.toLowerCase().replace("!", "").trim();
  const url = provider.url.trim();

  if (!name || !bang || !url) return null;

  return { name, bang, url };
};

export const defaultProviders: Provider[] = [
  {
    bang: "gg",
    name: "Google",
    url: `https://google.com/search?q=${PLACEHOLDER_TOKEN}`,
  },
  {
    bang: "dd",
    name: "DuckDuckGo",
    url: `https://duckduckgo.com/?q=${PLACEHOLDER_TOKEN}`,
  },
  {
    bang: "yt",
    name: "Youtube",
    url: `https://youtube.com/results?search_query=${PLACEHOLDER_TOKEN}`,
  },
  {
    bang: "ytm",
    name: "YouTube Music",
    url: `https://music.youtube.com/search?q=${PLACEHOLDER_TOKEN}`,
  },
  {
    bang: "gh",
    name: "Github",
    url: `https://github.com/search?q=${PLACEHOLDER_TOKEN}`,
  },
  {
    bang: "npm",
    name: "NPMJS",
    url: `https://npmx.dev/search?q=${PLACEHOLDER_TOKEN}`,
  },
  {
    bang: "mdn",
    name: "MDN Web Docs",
    url: `https://developer.mozilla.org/en-US/search?q=${PLACEHOLDER_TOKEN}`,
  },
  {
    bang: "so",
    name: "Stack Overflow",
    url: `https://stackoverflow.com/search?q=${PLACEHOLDER_TOKEN}`,
  },
  {
    bang: "wk",
    name: "Wikipedia",
    url: `https://pt.wikipedia.org/w/index.php?search=${PLACEHOLDER_TOKEN}`,
  },
  {
    bang: "rd",
    name: "Reddit",
    url: `https://reddit.com/search?q=${PLACEHOLDER_TOKEN}`,
  },
  {
    bang: "fb",
    name: "Facebook",
    url: `https://www.facebook.com/s.php?q=${PLACEHOLDER_TOKEN}`,
  },
  {
    bang: "tt",
    name: "Twitter",
    url: `https://twitter.com/search?q=${PLACEHOLDER_TOKEN}`,
  },
  {
    bang: "ct",
    name: "Comando Torrents",
    url: `https://comandotorrents.to/?s=${PLACEHOLDER_TOKEN}`,
  },
  {
    bang: "pt",
    name: "Pirate Torrents",
    url: `https://thepiratetorrents.org/?s=${PLACEHOLDER_TOKEN}`,
  },
  {
    bang: "igg",
    name: "IGG Games",
    url: `https://igg-games.com/?s=${PLACEHOLDER_TOKEN}`,
  },
  {
    bang: "pcg",
    name: "PCGames Torrents",
    url: `https://pcgamestorrents.com/?s=${PLACEHOLDER_TOKEN}`,
  },
];
