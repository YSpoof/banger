import { Component } from '@angular/core';
import { SearchProvider, searchProviders } from './searchProviders';

@Component({
  selector: 'app-root',
  template: `
    @defer (when showDefaultUi) {
    <main>
      <div>
        <h1>Banger</h1>
        <p>Essa ferramenta permite usar 'bangs' em qualquer navegador.</p>
        <p>
          Tutoriais para:
          <a
            target="_blank"
            href="https://support.google.com/chrome/answer/95426?hl=pt-BR&co=GENIE.Platform%3DDesktop&oco=1"
            >Chrome</a
          >
          ou
          <a
            target="_blank"
            href="https://support.mozilla.org/pt-PT/kb/adicionar-ou-remover-motores-de-pesquisa-firefox#w_adicionar-um-motor-de-pesquisa-a-partir-da-barra-da-pesquisa"
            >Firefox</a
          >
        </p>
        <div id="setup">
          <p>
            Configure no seu navegador como motor de busca padrão a seguinte
            url:
          </p>
          <code>https://banger.lzart.com.br?q=%s</code>
        </div>

        <p>Para usar, basta digitar na barra de busca ! e o 'bang' desejado.</p>
        <p>
          Exemplo:
          <code>!<span class="bang-highlight">yt</span> Angular</code> irá
          pesquisar 'Angular' no 'YouTube'.
        </p>
        <p>Caso não seja passado nenhuma bang, será usado o motor padrão.</p>
        <p>Lista completa de 'bangs' suportados:</p>
        <ul>
          @for (provider of searchProviders; track $index) {
          <li (click)="setDefaultBang(provider)">
            <code>
              !<span class="bang-highlight">{{ provider.bang }}</span
              >:
              {{ provider.name }}
            </code>
            @if (isDefaultBang(provider)) {
            <span class="default-span">(padrão)</span>
            } @else {
            <span>(clique para definir como padrão)</span>
            }
          </li>
          }
        </ul>
        <p id="configure">
          Configure o banger usando
          <code>!<span class="bang-highlight">cfg</span> </code>
        </p>
      </div>
    </main>
    <footer>
      <p>
        Desenvolvido por
        <a href="https://lzart.com.br" target="_blank">LZArt</a>
      </p>
    </footer>
    }
  `,
})
export class AppComponent {
  searchProviders = searchProviders as SearchProvider[];
  showDefaultUi = false;
  defaultBang = this.getDefaultBang();

  getBangUrlRedirect(): string | null {
    const url = new URL(window.location.href);
    const query = url.searchParams.get('q')?.trim() ?? '';
    if (!query) {
      this.showDefaultUi = true;
      return null;
    }

    const match = query.match(/!(\S+)/i);

    const bang = match?.[1]?.toLowerCase();

    if (bang === 'cfg') {
      this.showDefaultUi = true;
      return null;
    }

    const realBang =
      searchProviders.find((provider) => provider.bang === bang) ??
      this.defaultBang;

    const cleanQuery = query.replace(/!\S+\s*/i, '').trim();

    const redirectUrl = realBang.url.replace('{{ placeholder }}', cleanQuery);

    if (!redirectUrl) return null;

    return redirectUrl;
  }

  getDefaultBang() {
    const fromLS = localStorage.getItem('defaultBang');
    if (fromLS) {
      return JSON.parse(fromLS);
    }
    return {
      bang: 'g',
      url: 'https://www.google.com/search?q={{ placeholder }}',
    };
  }

  setDefaultBang(bang: SearchProvider) {
    localStorage.setItem('defaultBang', JSON.stringify(bang));
    this.defaultBang = bang;
  }

  isDefaultBang(provider: SearchProvider): boolean {
    return provider.bang === this.defaultBang.bang;
  }

  doRedirect(): void {
    const redirectUrl = this.getBangUrlRedirect();
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }
  ngOnInit() {
    this.doRedirect();
    searchProviders.forEach((provider) => {
      // add preconnect and prefetch link in header
      // We skip on the 3rd slash to get the origin
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = provider.url.slice(0, provider.url.indexOf('/', 8));
      document.head.appendChild(link);

      const prefetchLink = document.createElement('link');
      prefetchLink.rel = 'prefetch';
      prefetchLink.href = provider.url.slice(0, provider.url.indexOf('/', 8));
      document.head.appendChild(prefetchLink);
    });
  }
}
