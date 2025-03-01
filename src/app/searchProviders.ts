const searchProviders = [
  {
    bang: 'g',
    name: 'Google',
    url: 'https://google.com/search?q={{ placeholder }}',
  },
  {
    bang: 'yt',
    name: 'Youtube',
    url: 'https://youtube.com/results?search_query={{ placeholder }}',
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
    bang: 'w',
    name: 'Wikipedia',
    url: 'https://pt.wikipedia.org/w/index.php?search={{ placeholder }}',
  },
  {
    bang: 'r',
    name: 'Reddit',
    url: 'https://reddit.com/search?q={{ placeholder }}',
  },
  {
    bang: 'fb',
    name: 'Facebook',
    url: 'https://facebook.com/s.php?q={{ placeholder }}',
  },
  {
    bang: 't',
    name: 'Twitter',
    url: 'https://twitter.com/search?q={{ placeholder }}',
  },
];

interface SearchProvider {
  bang: string;
  name: string;
  url: string;
}

export type { SearchProvider };

export { searchProviders };
