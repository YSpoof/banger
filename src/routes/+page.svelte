<script lang="ts">
  import CloseIcon from "~icons/mdi/close";

  import AddProviderModal from "#lib/frontend/components/modals/AddProviderModal.svelte";
  import RemoveProviderModal from "#lib/frontend/components/modals/RemoveProviderModal.svelte";
  import { appState } from "#lib/frontend/stores/appState.svelte.js";
  import { toastStore } from "#lib/frontend/stores/toast.svelte.js";
  import { EMPTY_PROVIDER, type Provider } from "#lib/frontend/utils/providers.js";

  const setupUrl = `${globalThis.location.origin}/?q=%s`;

  let selectedProvider = $state<Provider>(EMPTY_PROVIDER);
  let addProviderOpen = $state(false);
  let removeProviderOpen = $state(false);

  const copySetupUrl = async () => {
    await navigator.clipboard.writeText(setupUrl);
    toastStore.showToast("URL copiada para a área de transferência", "success");
  };

  const playDemo = (event: Event) => {
    (event.currentTarget as HTMLVideoElement).play();
  };

  const handleRemoveProvider = (provider: Provider) => {
    selectedProvider = provider;
    removeProviderOpen = true;
  };
</script>

<div class="space-y-4 leading-relaxed">
  <div class="space-y-4">
    <h1 class="text-3xl font-bold">Banger</h1>
    <p class="text-base-content/80">Essa ferramenta permite usar 'bangs' em qualquer navegador.</p>
    <p>
      Tutoriais para:
      <a
        class="link link-primary"
        target="_blank"
        href="https://support.google.com/chrome/answer/95426?hl=pt-BR&co=GENIE.Platform%3DDesktop&oco=1">
        Chrome
      </a>
      ou
      <a
        class="link link-primary"
        target="_blank"
        href="https://support.mozilla.org/pt-PT/kb/adicionar-ou-remover-motores-de-pesquisa-firefox#w_adicionar-um-motor-de-pesquisa-a-partir-da-barra-da-pesquisa">
        Firefox
      </a>
      .
    </p>

    <div class="card bg-base-100 dark:bg-base-300 shadow-sm">
      <div class="card-body gap-2">
        <p>Configure no seu navegador como motor de busca padrão a seguinte url:</p>
        <button
          type="button"
          class="w-full"
          onclick={copySetupUrl}>
          <code class="bg-base-200 block w-full rounded px-3 py-2 text-left font-mono">
            {setupUrl}
          </code>
        </button>
      </div>
    </div>

    <p>Para usar, basta digitar na barra de busca ! e o 'bang' desejado.</p>
    <p>
      Exemplo:
      <code class="font-mono">!<span class="text-error font-bold">yt</span> Angular</code>
      irá pesquisar <code class="font-mono">Angular</code> no
      <code class="font-mono">YouTube</code>.
    </p>
    <p>Caso não seja passado nenhuma bang, será usado o motor padrão.</p>
    <p>Vídeo demonstrativo (clique para rodar)</p>
    <!-- svelte-ignore a11y_media_has_caption -->
    <video
      class="rounded-box w-full cursor-pointer"
      src="/demo.mp4"
      onclick={playDemo}></video>
    <p>Essa é a velocidade real do Banger, o vídeo não está acelerado</p>

    <ul class="flex flex-col gap-1">
      {#each appState.combinedProviders as provider (provider.bang)}
        {const isDefault = $derived(provider.bang === appState.defaultBang.bang)}
        {const isCustom = appState.customProviders.some((p) => p.bang === provider.bang)}
        <li class="card bg-base-100 dark:bg-base-300 shadow-sm">
          <div class="card-body flex-row items-center gap-2 py-3">
            <button
              type="button"
              class="flex min-w-0 flex-1 items-center gap-2 text-left"
              onclick={() => appState.changeDefaultBang(provider)}>
              <code class="truncate font-mono">
                !<span class="text-error font-bold">{provider.bang}</span>: {provider.name}
              </code>
              <span class="text-sm {isDefault ? 'text-success' : 'text-base-content/60'}">
                {isDefault ? "(padrão)" : "(clique para definir como padrão)"}
              </span>
            </button>
            {#if isCustom}
              <button
                type="button"
                class="btn btn-circle btn-error btn-xs"
                aria-label="Remover provedor"
                onclick={() => handleRemoveProvider(provider)}>
                <CloseIcon class="size-4" />
              </button>
            {/if}
          </div>
        </li>
      {/each}
    </ul>

    <p class="rounded-box bg-base-100 dark:bg-base-300 px-3 py-2">
      Configure o banger usando
      <code class="font-mono">!<span class="text-error font-bold">cfg</span></code>
    </p>
  </div>

  <div>
    <button
      type="button"
      class="btn btn-primary w-full"
      onclick={() => (addProviderOpen = true)}>
      Clique aqui para adicionar um provedor personalizado.
    </button>
  </div>

  <footer class="border-base-300 text-base-content/60 mt-8 border-t pt-4 text-sm">
    <p>
      Desenvolvido por
      <a
        class="link link-primary"
        href="https://lzart.com.br"
        target="_blank">
        LZArt
      </a>
    </p>
    <p>
      Veja o
      <a
        class="link link-primary"
        data-sveltekit-reload
        href="/disclaimer.html">disclaimer</a
      >.
    </p>
  </footer>
</div>

<AddProviderModal
  open={addProviderOpen}
  onCancel={() => (addProviderOpen = false)} />
<RemoveProviderModal
  provider={selectedProvider}
  open={removeProviderOpen}
  onCancel={() => (removeProviderOpen = false)} />
