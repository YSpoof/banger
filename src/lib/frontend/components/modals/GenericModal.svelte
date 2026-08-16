<script lang="ts">
  import type { Snippet } from "svelte";
  import CloseIcon from "~icons/mdi/close";

  type Props = {
    title?: string;
    titleClass?: string;
    modalClass?: string;
    open: boolean;
    cantClose?: boolean;
    onCancel?: () => void;
    children?: Snippet;
    modalActions?: Snippet;
  };

  let {
    title,
    titleClass = "",
    modalClass = "",
    open,
    cantClose = false,
    onCancel,
    children,
    modalActions,
  }: Props = $props();

  let modalRef: HTMLDialogElement | undefined;

  $effect(() => {
    if (!modalRef) return;

    if (open) {
      if (!modalRef.open) modalRef.showModal();
      return;
    }

    if (modalRef.open) modalRef.close();
  });

  const handleClose = (event?: Event, fromDialog = false) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (cantClose) {
      if (fromDialog) {
        setTimeout(() => {
          modalRef?.showModal();
        });
      }
      return;
    }

    if (!fromDialog) {
      modalRef?.close();
      return;
    }

    if (!open) return;
    onCancel?.();
  };
</script>

<dialog
  bind:this={modalRef}
  class="modal modal-bottom sm:modal-middle backdrop-blur-xs"
  onclose={(e) => handleClose(e, true)}>
  <div class={`modal-box w-fit md:max-w-6/12 ${modalClass}`}>
    <div class="mb-2 flex w-full {title ? 'justify-between' : 'justify-end'}">
      {#if title}
        <h1 class={`text-primary text-xl font-bold ${titleClass}`}>
          {title}
        </h1>
      {/if}
      {#if !cantClose}
        <button
          onclick={(e) => handleClose(e, false)}
          disabled={cantClose}
          class="btn btn-sm btn-circle gelatin">
          <CloseIcon class="text-lg" />
        </button>
      {/if}
    </div>
    {@render children?.()}
    <!-- Todo, remove the if when migration is complete -->
    {#if modalActions}
      <div class="modal-action">
        {@render modalActions?.()}
      </div>
    {/if}
  </div>
  <form
    onsubmit={(e) => handleClose(e, false)}
    method="dialog"
    class="modal-backdrop">
    <button
      type="submit"
      aria-label="Fechar modal"
      class="cursor-default"></button>
  </form>
</dialog>
