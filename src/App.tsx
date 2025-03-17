import { createSignal, For, onMount } from "solid-js";
import { SearchProvider, searchProviders } from "./searchProviders";

export default function App() {
  onMount(() => {
    doRedirect();
    searchProviders.forEach((provider) => {
      const link = document.createElement("link");
      link.rel = "preconnect";
      link.href = provider.url.slice(0, provider.url.indexOf("/", 8));
      document.head.appendChild(link);

      const prefetchLink = document.createElement("link");
      prefetchLink.rel = "prefetch";
      prefetchLink.href = provider.url.slice(0, provider.url.indexOf("/", 8));
      document.head.appendChild(prefetchLink);
    });

    registerServiceWorker();
  });

  const [defaultBang, setDefaultBang] = createSignal<SearchProvider>(
    getDefaultBang()
  );

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registrado com sucesso!");
        })
        .catch((error) => {
          console.error("Erro ao registrar o Service Worker: ", error);
        });
    }
  }

  function copySetupUrl(event: Event) {
    event.preventDefault();
    let target = event.target as HTMLElement;
    navigator.clipboard.writeText(target?.innerText);
    alert("URL copiada para a área de transferência!");
  }

  function getBangUrlRedirect(): string | null {
    const url = new URL(window.location.href);
    const query = url.searchParams.get("q")?.trim() ?? "";
    if (!query) {
      return null;
    }

    const match = query.match(/!(\S+)/i);

    const bang = match?.[1]?.toLowerCase();

    if (bang === "cfg") {
      caches.delete("banger");
      return null;
    }

    const realBang =
      searchProviders.find((provider) => provider.bang === bang) ??
      defaultBang();

    const cleanQuery = query.replace(/!\S+\s*/i, "").trim();

    // If there's no search query after the bang, redirect to the provider's homepage
    if (!cleanQuery) {
      const baseUrl = realBang.url.slice(0, realBang.url.indexOf("/", 8));
      return baseUrl;
    }

    const redirectUrl = realBang.url.replace("{{ placeholder }}", cleanQuery);

    if (!redirectUrl) return null;

    return redirectUrl;
  }

  function getDefaultBang() {
    const fromLS = localStorage.getItem("defaultBang");
    if (fromLS) {
      return JSON.parse(fromLS);
    }
    return {
      bang: "g",
      url: "https://www.google.com/search?q={{ placeholder }}",
    };
  }

  function changeDefaultBang(bang: SearchProvider) {
    localStorage.setItem("defaultBang", JSON.stringify(bang));
    setDefaultBang(bang);
  }

  function isDefaultBang(provider: SearchProvider): boolean {
    return provider.bang === defaultBang().bang;
  }

  function doRedirect(): void {
    const redirectUrl = getBangUrlRedirect();
    if (redirectUrl) {
      window.location.href = redirectUrl;
    }
  }

  return (
    <main>
      <div>
        <h1>Banger</h1>
        <p>Essa ferramenta permite usar 'bangs' em qualquer navegador.</p>
        <p>
          Tutoriais para:
          <a
            target="_blank"
            href="https://support.google.com/chrome/answer/95426?hl=pt-BR&co=GENIE.Platform%3DDesktop&oco=1"
          >
            {" "}
            Chrome{" "}
          </a>
          ou
          <a
            target="_blank"
            href="https://support.mozilla.org/pt-PT/kb/adicionar-ou-remover-motores-de-pesquisa-firefox#w_adicionar-um-motor-de-pesquisa-a-partir-da-barra-da-pesquisa"
          >
            {" "}
            Firefox
          </a>
          .
        </p>
        <div id="setup">
          <p>
            Configure no seu navegador como motor de busca padrão a seguinte
            url:
          </p>
          <code onClick={copySetupUrl}>https://banger.lzart.com.br?q=%s</code>
        </div>

        <p>Para usar, basta digitar na barra de busca ! e o 'bang' desejado.</p>
        <p>
          Exemplo:
          <code>
            !<span class="bang-highlight">yt</span> Angular
          </code>{" "}
          irá pesquisar <code>Angular</code> no <code>YouTube</code>.
        </p>
        <p>Caso não seja passado nenhuma bang, será usado o motor padrão.</p>
        <ul>
          <For each={searchProviders}>
            {(provider) => (
              <li onClick={() => changeDefaultBang(provider)}>
                <code>
                  !<span class="bang-highlight">{provider.bang}</span>:
                  {provider.name}
                </code>
                {isDefaultBang(provider) ? (
                  <span class="default-span">(padrão)</span>
                ) : (
                  <span>(clique para definir como padrão)</span>
                )}
              </li>
            )}
          </For>
        </ul>
        <p id="configure">
          Configure o banger usando
          <code>
            !<span class="bang-highlight">cfg</span>{" "}
          </code>
        </p>
      </div>
      <footer>
        <p>
          Desenvolvido por
          <a href="https://lzart.com.br" target="_blank">
            {" "}
            LZArt{" "}
          </a>
        </p>
        <p>
          Veja o <a href="/disclaimer.html">disclaimer</a>.
        </p>
      </footer>
    </main>
  );
}
