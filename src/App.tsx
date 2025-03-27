import { createSignal, For, onMount } from "solid-js";
import { SearchProvider, searchProviders } from "./searchProviders";

export default function App() {
  const [customProviders, setCustomProviders] = createSignal<SearchProvider[]>(
    []
  );
  const [combinedProviders, setCombinedProviders] = createSignal<
    SearchProvider[]
  >([...searchProviders]);
  let modal!: HTMLDialogElement;
  let modalProviderName!: HTMLInputElement;
  let modalProviderBang!: HTMLInputElement;
  let modalProviderUrl!: HTMLInputElement;

  onMount(() => {
    loadCustomProviders();
    doRedirect();
    registerServiceWorker();
  });

  const [defaultBang, setDefaultBang] = createSignal<SearchProvider>(
    getDefaultBang()
  );

  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((_registration) => {
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
      combinedProviders().find((provider) => provider.bang === bang) ??
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
    const defaultProvider: SearchProvider = {
      name: "Google",
      bang: "gg",
      url: "https://www.google.com/search?q={{ placeholder }}",
    };
    const fromLS = localStorage.getItem("defaultBang");
    if (fromLS) {
      return JSON.parse(fromLS);
    } else {
      localStorage.setItem("defaultBang", JSON.stringify(defaultProvider));
    }
    return defaultProvider;
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

  function showCustomProviderModal() {
    modal.showModal();
  }

  function addCustomProvider() {
    const name = modalProviderName.value.trim();
    const bang = modalProviderBang.value.trim().toLowerCase();
    const url = modalProviderUrl.value.trim();

    if (!validadeUrl(url)) {
      alert("URL inválida. Por favor, verifique o formato da URL.");
      return;
    }

    if (name && bang && url) {
      const newProvider: SearchProvider = { name, bang, url };
      const updatedCustomProviders = [...customProviders(), newProvider];
      setCustomProviders(updatedCustomProviders);
      setCombinedProviders([...searchProviders, ...updatedCustomProviders]);
      localStorage.setItem(
        "customProviders",
        JSON.stringify(updatedCustomProviders)
      );
      console.log(`Custom provider added: ${newProvider.name}`);
      modal.close();
    } else {
      alert("Por favor, preencha todos os campos: nome, bang e URL.");
    }
    return;
  }

  function testCustomProvider() {
    const url = modalProviderUrl.value.trim().replace("%s", "Banger LZArt");

    if (!validadeUrl(url)) {
      alert("URL inválida. Por favor, verifique o formato da URL.");
      return;
    }

    window.open(url, "_blank");
    return;
  }

  function loadCustomProviders() {
    const loaded = JSON.parse(localStorage.getItem("customProviders") || "[]");
    setCustomProviders(loaded);
    setCombinedProviders([...searchProviders, ...loaded]);
    loaded.forEach((provider: SearchProvider) => {
      console.log(`Custom provider loaded: ${provider.name}`);
    });
  }

  function validadeUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
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
          <For
            each={combinedProviders()}
            fallback={<li>Nenhum provedor de busca encontrado.</li>}
          >
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
      <div id="customProviders">
        <h2>Provedores personalizados</h2>
        <p>
          Caso deseje adicionar um provedor personalizado, basta adicionar a URL
          do provedor e a 'bang' desejada.
        </p>
        <p>
          Exemplo:
          <code>
            !<span class="bang-highlight">my</span> https://mysearch.com?q=%s
          </code>
        </p>
        <p>
          <button onClick={showCustomProviderModal}>Clique aqui</button> para
          adicionar um provedor personalizado.
        </p>
      </div>
      <dialog ref={modal} class="custom-modal">
        <h3>Adicionar provedor personalizado</h3>
        <div class="form-group">
          <label for="providerName">Nome</label>
          <input
            type="text"
            name="providerName"
            id="providerName"
            ref={modalProviderName}
            placeholder="Exemplo: Meu Provider"
          />
        </div>
        <div class="form-group">
          <label for="providerBang">Bang</label>
          <input
            type="text"
            name="providerBang"
            id="providerBang"
            ref={modalProviderBang}
            placeholder="Exemplo: my"
          />
        </div>
        <div class="form-group">
          <label for="providerUrl">URL</label>
          <input
            type="text"
            name="providerUrl"
            id="providerUrl"
            ref={modalProviderUrl}
            placeholder="https://mysearch.com?q=%s"
          />
        </div>
        <div class="modal-actions">
          <button class="btn-test" onClick={testCustomProvider}>
            Testar
          </button>
          <button class="btn-add" onClick={addCustomProvider}>
            Adicionar
          </button>
          <button class="btn-close" onClick={() => modal.close()}>
            Fechar
          </button>
        </div>
      </dialog>
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
