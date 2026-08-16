<script lang="ts">
  import { appState } from "#lib/frontend/stores/appState.svelte.js";
  import { type Provider } from "#lib/frontend/utils/providers.js";

  import GenericModal from "./GenericModal.svelte";
  interface Props {
    provider: Provider;
    open: boolean;
    onCancel: () => void;
  }

  let { provider, open, onCancel }: Props = $props();

  const handleRemoveProvider = () => {
    appState.removeCustomProvider(provider);
    onCancel();
  };
</script>

<GenericModal
  title={`Remover ${provider.name} ?`}
  {open}
  {onCancel}>
  <p>Tem certeza que deseja remover este provedor?</p>
  {#snippet modalActions()}
    <button
      type="button"
      class="btn btn-error"
      onclick={handleRemoveProvider}>Remover</button>
    <button
      type="button"
      class="btn"
      onclick={onCancel}>Fechar</button>
  {/snippet}
</GenericModal>
