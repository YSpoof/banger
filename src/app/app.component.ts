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
        <p>Como instalar:</p>
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
        <ol>
          <li>
            <p>
              Configure no seu navegador como motor de busca a seguinte url:
            </p>
            <code>https://banger.lzart.com.br?q=%s</code>
          </li>
        </ol>

        <p>Para usar, basta digitar na barra de busca ! e o 'bang' desejado.</p>
        <p>
          Exemplo: <code>!g Angular</code> irá pesquisar 'Angular' no 'Google' ;
        </p>
        <p>Lista completa de 'bangs' suportados:</p>
        <ul>
          @for (provider of searchProviders; track $index) {
          <li>
            <strong>!{{ provider.bang }}</strong
            >: {{ provider.name }}
          </li>
          }
        </ul>
      </div>
    </main>
    <p>
      Desenvolvido por <a href="https://lzart.com.br" target="_blank">LZArt</a>
    </p>
    }
  `,
})
export class AppComponent {
  searchProviders = searchProviders as SearchProvider[];
  showDefaultUi = false;
  defaultBang = {
    bang: 'g',
    url: 'https://www.google.com/search?q={{ placeholder }}',
  };
  getBangUrlRedirect(): string | null {
    const url = new URL(window.location.href);
    const query = url.searchParams.get('q')?.trim() ?? '';
    if (!query) {
      this.showDefaultUi = true;
      return null;
    }

    const match = query.match(/!(\S+)/i);

    const bang = match?.[1]?.toLowerCase();

    const realBang =
      searchProviders.find((provider) => provider.bang === bang) ??
      this.defaultBang;

    const cleanQuery = query.replace(/!\S+\s*/i, '').trim();

    const redirectUrl = realBang.url.replace('{{ placeholder }}', cleanQuery);

    if (!redirectUrl) return null;

    return redirectUrl;
  }
  doRedirect(): void {
    const redirectUrl = this.getBangUrlRedirect();
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }
  ngOnInit() {
    this.doRedirect();
  }
}
