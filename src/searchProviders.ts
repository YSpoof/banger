const searchProviders = [
  {
    bang: 'gg',
    name: 'Google',
    url: 'https://google.com/search?q={{ placeholder }}',
  },
  {
    bang: 'dd',
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?q={{ placeholder }}',
  },
  {
    bang: 'yt',
    name: 'Youtube',
    url: 'https://youtube.com/results?search_query={{ placeholder }}',
  },
  {
    bang: 'ytm',
    name: 'YouTube Music',
    url: 'https://music.youtube.com/search?q={{ placeholder }}',
  },
  {
    bang: 'gh',
    name: 'Github',
    url: 'https://github.com/search?q={{ placeholder }}',
  },
  {
    bang: 'npm',
    name: 'NPMJS',
    url: 'https://npmjs.com/search?q={{ placeholder }}',
  },
  {
    bang: 'mdn',
    name: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/en-US/search?q={{ placeholder }}',
  },
  {
    bang: 'so',
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com/search?q={{ placeholder }}',
  },
  {
    bang: 'wk',
    name: 'Wikipedia',
    url: 'https://pt.wikipedia.org/w/index.php?search={{ placeholder }}',
  },
  {
    bang: 'rd',
    name: 'Reddit',
    url: 'https://reddit.com/search?q={{ placeholder }}',
  },
  {
    bang: 'fb',
    name: 'Facebook',
    url: 'https://www.facebook.com/s.php?q={{ placeholder }}',
  },
  {
    bang: 'tt',
    name: 'Twitter',
    url: 'https://twitter.com/search?q={{ placeholder }}',
  },
  {
    bang: 'ct',
    name: 'Comando Torrents',
    url: 'https://comandotorrents.to/?s={{ placeholder }}',
  },
  {
    bang: 'pt',
    name: 'Pirate Torrents',
    url: 'https://thepiratetorrents.org/?s={{ placeholder }}',
  },
  {
    bang: 'igg',
    name: 'IGG Games',
    url: 'https://igg-games.com/?s={{ placeholder }}',
  },
  {
    bang: 'pcg',
    name: 'PCGames Torrents',
    url: 'https://pcgamestorrents.com/?s={{ placeholder }}',
  },
];

interface SearchProvider {
  bang: string;
  name: string;
  url: string;
  isCustom?: boolean;
}

export type { SearchProvider };

export { searchProviders };
