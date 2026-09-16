import { createMemo, createSignal, For, lazy, Loading, onSettled, Show } from "solid-js";
import CloseIcon from "~icons/mdi/close";

import { appState } from "#lib/frontend/stores/appState.js";
import { toastStore } from "#lib/frontend/stores/toast.js";
import { EMPTY_PROVIDER, type Provider } from "#lib/frontend/utils/providers.js";

const AddProviderModal = lazy(() => import("#lib/frontend/components/modals/AddProviderModal.js"));
const RemoveProviderModal = lazy(
  () => import("#lib/frontend/components/modals/RemoveProviderModal.js"),
);

function ProviderRow(props: {
  provider: Provider;
  onRemove: (provider: Provider) => void;
  onMouseEnter: () => void;
}) {
  const isDefault = createMemo(() => props.provider.bang === appState.defaultBang().bang);
  const isCustom = createMemo(() =>
    appState.customProviders().some((item) => item.bang === props.provider.bang),
  );

  const statusClass = createMemo(() => {
    if (isDefault()) return "text-sm text-success";
    return "text-sm text-base-content/60";
  });

  const statusLabel = createMemo(() => {
    if (isDefault()) return "(padrão)";
    return "(clique para definir como padrão)";
  });

  return (
    <li class="card bg-base-100 dark:bg-base-300 shadow-sm">
      <div class="card-body flex-row items-center gap-2 py-3">
        <button
          type="button"
          class="flex min-w-0 flex-1 items-center gap-2 text-left"
          onClick={() => appState.changeDefaultBang(props.provider)}>
          <code class="truncate font-mono">
            !<span class="text-error font-bold">{props.provider.bang}</span>: {props.provider.name}
          </code>
          <span class={statusClass()}>{statusLabel()}</span>
        </button>
        <Show when={isCustom()}>
          <button
            type="button"
            class="btn btn-circle btn-error btn-xs"
            aria-label="Remover provedor"
            onMouseEnter={props.onMouseEnter}
            onClick={() => props.onRemove(props.provider)}>
            <CloseIcon class="size-4" />
          </button>
        </Show>
      </div>
    </li>
  );
}

export default function Home() {
  const [setupUrl, setSetupUrl] = createSignal("");
  const [selectedProvider, setSelectedProvider] = createSignal<Provider>(EMPTY_PROVIDER);
  const [addProviderOpen, setAddProviderOpen] = createSignal(false);
  const [removeProviderOpen, setRemoveProviderOpen] = createSignal(false);

  onSettled(() => {
    setSetupUrl(`${globalThis.location.origin}/?q=%s`);
  });

  const copySetupUrl = async () => {
    await navigator.clipboard.writeText(setupUrl());
    toastStore.showToast("URL copiada para a área de transferência", "success");
  };

  const playDemo = (event: Event) => {
    (event.currentTarget as HTMLVideoElement).play();
  };

  const handleRemoveProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    setRemoveProviderOpen(true);
  };

  return (
    <>
      <div class="space-y-4 leading-relaxed">
        <div class="space-y-4">
          <h1 class="text-3xl font-bold">Banger</h1>
          <p class="text-base-content/80">
            Essa ferramenta permite usar 'bangs' em qualquer navegador.
          </p>
          <p>
            Tutoriais para:
            <a
              class="link link-primary"
              target="_blank"
              rel="noopener noreferrer"
              href="https://support.google.com/chrome/answer/95426?hl=pt-BR&co=GENIE.Platform%3DDesktop&oco=1">
              Chrome
            </a>{" "}
            ou
            <a
              class="link link-primary"
              target="_blank"
              rel="noopener noreferrer"
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
                onClick={copySetupUrl}>
                <code class="bg-base-200 block w-full rounded px-3 py-2 text-left font-mono">
                  {setupUrl()}
                </code>
              </button>
            </div>
          </div>

          <p>Para usar, basta digitar na barra de busca ! e o 'bang' desejado.</p>
          <p>
            Exemplo:
            <code class="font-mono">
              !<span class="text-error font-bold">yt</span> Angular
            </code>{" "}
            irá pesquisar <code class="font-mono">Angular</code> no
            <code class="font-mono">YouTube</code>.
          </p>
          <p>Caso não seja passado nenhuma bang, será usado o motor padrão.</p>
          <p>Vídeo demonstrativo (clique para rodar)</p>
          <video
            class="rounded-box w-full cursor-pointer"
            src="/demo.mp4"
            onClick={playDemo}
          />
          <p>Essa é a velocidade real do Banger, o vídeo não está acelerado</p>

          <ul class="flex flex-col gap-1">
            <For
              each={appState.combinedProviders()}
              keyed={(provider) => provider.bang}>
              {(provider) => (
                <ProviderRow
                  onMouseEnter={() => RemoveProviderModal.preload()}
                  provider={provider()}
                  onRemove={handleRemoveProvider}
                />
              )}
            </For>
          </ul>

          <p class="rounded-box bg-base-100 dark:bg-base-300 px-3 py-2">
            Configure o banger usando
            <code class="font-mono">
              !<span class="text-error font-bold">cfg</span>
            </code>
          </p>
        </div>

        <div>
          <button
            type="button"
            class="btn btn-primary w-full"
            onMouseEnter={() => AddProviderModal.preload()}
            onClick={() => setAddProviderOpen(true)}>
            Clique aqui para adicionar um provedor personalizado.
          </button>
        </div>

        <footer class="border-base-300 text-base-content/60 mt-8 border-t pt-4 text-sm">
          <p>
            Desenvolvido por
            <a
              class="link link-primary"
              href="https://lzart.com.br"
              target="_blank"
              rel="noopener noreferrer">
              LZArt
            </a>
          </p>
          <p>
            Veja o{" "}
            <a
              class="link link-primary"
              href="/disclaimer.html"
              target="_blank"
              rel="noopener noreferrer">
              disclaimer
            </a>
            .
          </p>
        </footer>
      </div>

      <Loading>
        <AddProviderModal
          open={addProviderOpen()}
          onCancel={() => setAddProviderOpen(false)}
        />
        <RemoveProviderModal
          provider={selectedProvider()}
          open={removeProviderOpen()}
          onCancel={() => setRemoveProviderOpen(false)}
        />
      </Loading>
    </>
  );
}
