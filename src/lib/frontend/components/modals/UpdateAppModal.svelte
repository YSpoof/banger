<script lang="ts">
  import GenericModal from "./GenericModal.svelte";

  let { open }: { open: boolean } = $props();

  const reload = () => {
    globalThis.location.reload();
  };
</script>

<GenericModal
  title="Atualização disponível"
  modalClass="max-w-lg w-full"
  cantClose
  {open}>
  <p>O site foi atualizado, por favor, recarregue a página!</p>

  {#snippet modalActions()}
    <button
      type="button"
      class="btn btn-primary"
      onclick={reload}>Recarregar</button>
  {/snippet}
</GenericModal>
