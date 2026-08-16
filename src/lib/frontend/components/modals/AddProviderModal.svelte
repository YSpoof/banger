<script lang="ts">
  import { customProvidersStore } from "#lib/frontend/stores/customProviders.svelte.js";
  import { toastStore } from "#lib/frontend/stores/toast.svelte.js";
  import { PLACEHOLDER_TOKEN, providerValidationMessage } from "#lib/frontend/utils/providers.js";

  import GenericModal from "./GenericModal.svelte";

  type Props = {
    open: boolean;
    onCancel?: () => void;
  };

  let { open, onCancel }: Props = $props();

  let providerName = $state("");
  let providerBang = $state("");
  let providerUrl = $state("");

  const resetForm = () => {
    providerName = "";
    providerBang = "";
    providerUrl = "";
  };

  const formEmpty = $derived(!providerName || !providerBang || !providerUrl);

  const close = () => {
    resetForm();
    onCancel?.();
  };

  const currentProvider = () => ({
    name: providerName,
    bang: providerBang,
    url: providerUrl,
  });

  const handleAddProvider = () => {
    const error = customProvidersStore.add(currentProvider());
    if (error) {
      toastStore.showToast(providerValidationMessage(error), "error");
      return;
    }

    toastStore.showToast("Provedor adicionado", "success");
    close();
  };

  const handleTestProvider = () => {
    const error = customProvidersStore.test(currentProvider());
    if (error) toastStore.showToast(providerValidationMessage(error), "error");
  };
</script>

<GenericModal
  title="Adicionar provedor personalizado"
  modalClass="max-w-lg w-full"
  {open}
  onCancel={close}>
  <label class="form-control mt-2 w-full">
    <div class="label">
      <span class="label-text font-semibold">Nome</span>
    </div>
    <input
      type="text"
      name="providerName"
      class="input input-bordered w-full"
      placeholder="Exemplo: Meu Provider"
      bind:value={providerName} />
  </label>

  <label class="form-control mt-2 w-full">
    <div class="label">
      <span class="label-text font-semibold">Bang</span>
    </div>
    <input
      type="text"
      name="providerBang"
      class="input input-bordered w-full"
      placeholder="Exemplo: my"
      bind:value={providerBang} />
  </label>

  <label class="form-control mt-2 w-full">
    <div class="label">
      <span class="label-text font-semibold">
        URL ("{PLACEHOLDER_TOKEN}" é onde a pesquisa será inserida)
      </span>
    </div>
    <input
      type="text"
      name="providerUrl"
      class="input input-bordered w-full"
      placeholder={`https://mysearch.com?q=${PLACEHOLDER_TOKEN}`}
      bind:value={providerUrl} />
  </label>

  {#snippet modalActions()}
    <button
      type="button"
      class="btn"
      onclick={close}>Fechar</button>
    <button
      type="button"
      class="btn btn-ghost"
      onclick={handleTestProvider}
      disabled={!providerUrl}>
      Testar
    </button>
    <button
      type="button"
      class="btn btn-success"
      onclick={handleAddProvider}
      disabled={formEmpty}>
      Adicionar
    </button>
  {/snippet}
</GenericModal>
