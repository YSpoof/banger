<template>
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
          Chrome
        </a>
        ou
        <a
          target="_blank"
          href="https://support.mozilla.org/pt-PT/kb/adicionar-ou-remover-motores-de-pesquisa-firefox#w_adicionar-um-motor-de-pesquisa-a-partir-da-barra-da-pesquisa"
        >
          Firefox
        </a>
        .
      </p>
      <div id="setup">
        <p>
          Configure no seu navegador como motor de busca padrão a seguinte url:
        </p>
        <code @click="copySetupUrl">https://banger.lzart.com.br?q=%s</code>
      </div>

      <p>Para usar, basta digitar na barra de busca ! e o 'bang' desejado.</p>
      <p>
        Exemplo:
        <code>!<span class="bang-highlight">yt</span> Angular</code> irá
        pesquisar <code>Angular</code> no <code>YouTube</code>.
      </p>
      <p>Caso não seja passado nenhuma bang, será usado o motor padrão.</p>
      <ul v-auto-animate>
        <li
          v-for="provider in combinedProviders"
          :key="provider.bang"
          @click="changeDefaultBang(provider)"
        >
          <button
            v-if="isCustomProvider(provider)"
            id="removeProvider"
            :title="`Remover ${provider.bang}`"
            @click.stop="removeCustomProvider(provider)"
          >
            X
          </button>
          <code>
            !<span class="bang-highlight">{{ provider.bang }}</span
            >:{{ provider.name }}
          </code>
          <span v-if="isDefaultBang(provider)" class="default-span"
            >(padrão)</span
          >
          <span v-else>(clique para definir como padrão)</span>
        </li>
        <li v-if="combinedProviders.length === 0">
          Nenhum provedor de busca encontrado.
        </li>
      </ul>
      <p id="configure">
        Configure o banger usando
        <code>!<span class="bang-highlight">cfg</span></code>
      </p>
    </div>
    <div id="customProviders">
      <p>
        <button class="btn-addCustomProvider" @click="showModal">
          Clique aqui para adicionar um provedor personalizado.
        </button>
      </p>
    </div>
    <dialog ref="modalRef" class="custom-modal">
      <h3>Adicionar provedor personalizado</h3>
      <div class="form-group">
        <label for="providerName">Nome</label>
        <input
          type="text"
          name="providerName"
          id="providerName"
          v-model="modalProviderName"
          placeholder="Exemplo: Meu Provider"
        />
      </div>
      <div class="form-group">
        <label for="providerBang">Bang</label>
        <input
          type="text"
          name="providerBang"
          id="providerBang"
          v-model="modalProviderBang"
          placeholder="Exemplo: my"
        />
      </div>
      <div class="form-group">
        <label for="providerUrl" v-pre>
          URL ("{{ placeholder }} é onde a pesquisa será inserida")
        </label>
        <input
          type="text"
          name="providerUrl"
          id="providerUrl"
          v-model="modalProviderUrl"
          placeholder="https://mysearch.com?q={{ placeholder }}"
        />
      </div>
      <div class="modal-actions">
        <button class="btn-test" @click="testCustomProvider">Testar</button>
        <button class="btn-add" @click="addCustomProvider">Adicionar</button>
        <button class="btn-close" @click="closeModal">Fechar</button>
      </div>
    </dialog>
    <footer>
      <p>
        Desenvolvido por
        <a href="https://lzart.com.br" target="_blank"> LZArt </a>
      </p>
      <p>Veja o <a href="/disclaimer.html">disclaimer</a>.</p>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { type SearchProvider, searchProviders } from "./searchProviders";

// Refs
const customProviders = ref<SearchProvider[]>([]);
const defaultBang = ref<SearchProvider>(getDefaultBang());
const modalRef = ref<HTMLDialogElement | null>(null);
const modalProviderName = ref<string>("");
const modalProviderBang = ref<string>("");
const modalProviderUrl = ref<string>("");

// Computed properties
const combinedProviders = computed<SearchProvider[]>(() => [
  ...searchProviders,
  ...customProviders.value,
]);

// Lifecycle hooks
onMounted(() => {
  loadCustomProviders();
  doRedirect();
});

// Storage utility
const storage = {
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  get<T>(key: string) {
    const value = localStorage.getItem(key);
    if (!value) return null;
    return JSON.parse(value) as T;
  },
};

// Methods
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
    combinedProviders.value.find((provider) => provider.bang === bang) ??
    defaultBang.value;

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
  return provider.bang === defaultBang.value.bang;
}

function doRedirect(): void {
  const redirectUrl = getBangUrlRedirect();
  if (redirectUrl) {
    window.location.href = redirectUrl;
  }
}

function removeCustomProvider(provider: SearchProvider) {
  if (!confirm(`Deseja realmente remover o provedor ${provider.name}?`)) return;
  const updatedCustomProviders = customProviders.value.filter(
    (p) => p.bang !== provider.bang
  );
  customProviders.value = updatedCustomProviders;
  storage.set("customProviders", updatedCustomProviders);
  console.log(`Custom provider removed: ${provider.name}`);
}

function addCustomProvider() {
  const name = modalProviderName.value.trim();
  const bang = modalProviderBang.value.trim().toLowerCase().replace("!", "");
  const url = modalProviderUrl.value.trim();

  if (!validadeUrl(url)) {
    alert("URL inválida. Por favor, verifique o formato da URL.");
    return;
  }

  if (checkIfBangExists(bang)) {
    alert("Essa Bang já está em uso. Por favor, escolha outra.");
    return;
  }

  if (name && bang && url) {
    const newProvider: SearchProvider = { name, bang, url };
    const updatedCustomProviders = [...customProviders.value, newProvider];
    customProviders.value = updatedCustomProviders;
    storage.set("customProviders", updatedCustomProviders);
    console.log(`Custom provider added: ${newProvider.name}`);
    closeModal();
  } else {
    alert("Por favor, preencha todos os campos: nome, bang e URL.");
  }
}

function checkIfBangExists(bang: string): boolean {
  return combinedProviders.value.some((provider) => provider.bang === bang);
}

function testCustomProvider() {
  const url = modalProviderUrl.value.trim();

  if (!validadeUrl(url)) {
    alert("URL inválida. Por favor, verifique o formato da URL.");
    return;
  }

  window.open(url.replace("{{ placeholder }}", "Banger LZArt"), "_blank");
}

function showModal() {
  if (modalRef.value) {
    modalRef.value.showModal();
  }
}

function closeModal() {
  if (modalRef.value) {
    modalRef.value.close();
    // Reset form values
    modalProviderName.value = "";
    modalProviderBang.value = "";
    modalProviderUrl.value = "";
  }
}

function setDefaultBang(bang: SearchProvider) {
  defaultBang.value = bang;
}

function setCustomProviders(providers: SearchProvider[]) {
  customProviders.value = providers;
}

function isCustomProvider(provider: SearchProvider): boolean {
  return !searchProviders.some((p) => p.bang === provider.bang);
}

function loadCustomProviders() {
  const loaded = storage.get<SearchProvider[]>("customProviders") || [];
  customProviders.value = loaded;
  loaded.forEach((provider: SearchProvider) => {
    console.log(`Custom provider loaded: ${provider.name}`);
  });
}

function validadeUrl(url: string): boolean {
  try {
    if (!url.includes("{{ placeholder }}")) return false;
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}
</script>
