const searchProviders = [
  {
    bang: 'g',
    name: 'Google',
    url: 'https://www.google.com/search?q={{ placeholder }}',
  },
  {
    bang: 'yt',
    name: 'Youtube',
    url: 'https://www.youtube.com/results?search_query={{ placeholder }}',
  },
  {
    bang: 'gh',
    name: 'Github',
    url: 'https://github.com/search?q={{ placeholder }}',
  },
  {
    bang: 'npm',
    name: 'NPM',
    url: 'https://www.npmjs.com/search?q={{ placeholder }}',
  },
  {
    bang: 'mdn',
    name: 'MDN',
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
    url: 'https://en.wikipedia.org/w/index.php?search={{ placeholder }}',
  },
  {
    bang: 'r',
    name: 'Reddit',
    url: 'https://www.reddit.com/search?q={{ placeholder }}',
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
