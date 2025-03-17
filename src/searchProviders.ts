const searchProviders = [
  {
    bang: 'gg',
    name: 'Google',
    url: 'https://google.com/search?q=%s',
  },
  {
    bang: 'dd',
    name: 'DuckDuckGo',
    url: 'https://duckduckgo.com/?q=%s',
  },
  {
    bang: 'yt',
    name: 'Youtube',
    url: 'https://youtube.com/results?search_query=%s',
  },
  {
    bang: 'ytm',
    name: 'YouTube Music',
    url: 'https://music.youtube.com/search?q=%s',
  },
  {
    bang: 'gh',
    name: 'Github',
    url: 'https://github.com/search?q=%s',
  },
  {
    bang: 'npm',
    name: 'NPMJS',
    url: 'https://npmjs.com/search?q=%s',
  },
  {
    bang: 'mdn',
    name: 'MDN Web Docs',
    url: 'https://developer.mozilla.org/en-US/search?q=%s',
  },
  {
    bang: 'so',
    name: 'Stack Overflow',
    url: 'https://stackoverflow.com/search?q=%s',
  },
  {
    bang: 'wk',
    name: 'Wikipedia',
    url: 'https://pt.wikipedia.org/w/index.php?search=%s',
  },
  {
    bang: 'rd',
    name: 'Reddit',
    url: 'https://reddit.com/search?q=%s',
  },
  {
    bang: 'fb',
    name: 'Facebook',
    url: 'https://www.facebook.com/s.php?q=%s',
  },
  {
    bang: 'tt',
    name: 'Twitter',
    url: 'https://twitter.com/search?q=%s',
  },
  {
    bang: 'ct',
    name: 'Comando Torrents',
    url: 'https://comandotorrents.to/?s=%s',
  },
  {
    bang: 'pt',
    name: 'Pirate Torrents',
    url: 'https://thepiratetorrents.org/?s=%s',
  },
  {
    bang: 'igg',
    name: 'IGG Games',
    url: 'https://igg-games.com/?s=%s',
  },
  {
    bang: 'pcg',
    name: 'PCGames Torrents',
    url: 'https://pcgamestorrents.com/?s=%s',
  },
];

interface SearchProvider {
  bang: string;
  name: string;
  url: string;
}

export type { SearchProvider };

export { searchProviders };
