# Banger

Banger is a lightweight search engine wrapper that lets you use "bangs" to quickly search across different websites directly from your browser's search bar.

## What are "bangs"?

Bangs are special commands prefixed with an exclamation mark (`!`) that redirect your search to specific websites. For example:

- `!gg angular` searches for "angular" on Google
- `!yt javascript tutorial` searches for "javascript tutorial" on YouTube
- `!gh react` searches for "react" on GitHub

## Features

- Use bangs in any browser by setting Banger as your default search engine
- Configure your preferred default search engine
- Works entirely locally after first load (self-caching)
- Fast redirects to your favorite search providers
- Simple, clean interface

## Available Bangs

Banger supports many search providers, including:

- `!gg` - Google
- `!dd` - DuckDuckGo
- `!yt` - YouTube
- `!ytm` - YouTube Music
- `!gh` - GitHub
- `!npm` - npm package registry
- `!mdn` - MDN Web Docs
- And many more!
- You can also add custom ones in the `!cfg` menu.

## How to Set Up

1. Visit [https://banger.lzart.com.br](https://banger.lzart.com.br)
2. Copy the search engine URL: `https://banger.lzart.com.br?q=%s`
3. Add it to your browser's search engines:
   - [Instructions for Chrome](https://support.google.com/chrome/answer/95426?hl=pt-BR&co=GENIE.Platform%3DDesktop&oco=1)
   - [Instructions for Firefox](https://support.mozilla.org/pt-PT/kb/adicionar-ou-remover-motores-de-pesquisa-firefox#w_adicionar-um-motor-de-pesquisa-a-partir-da-barra-da-pesquisa)

## Usage

1. Type `!` followed by the bang code and your search term in your browser's address bar
2. If no bang is provided, your default search engine will be used
3. Use `!cfg` to access the configuration page where you can set your default search engine

## Configuration

You can configure your default search engine by:

1. Typing `!cfg` in the search bar to access the configuration page
2. Clicking on any search engine in the list to set it as your default

## Technical Details

- Built with VueJS
- Works offline after initial load using service workers
- Lightweight and fast - redirects happen almost instantly

## Development

This project is developed and maintained by [LZArt](https://lzart.com.br).

## License

This project is open source.

## Links

- [Banger Website](https://banger.lzart.com.br)
- [LZArt](https://lzart.com.br)
