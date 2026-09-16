import type { JSX } from "@solidjs/web";
import { createEffect, Show } from "solid-js";
import CloseIcon from "~icons/mdi/close";

type Props = {
  title?: string;
  titleClass?: string;
  modalClass?: string;
  open: boolean;
  cantClose?: boolean;
  onCancel?: () => void;
  children?: JSX.Element;
  actions?: JSX.Element;
};

export default function GenericModal(props: Props) {
  let modalRef: HTMLDialogElement | undefined;

  createEffect(
    () => props.open,
    (open) => {
      const el = modalRef;
      if (!el) return;

      if (open) {
        if (!el.open) el.showModal();
        return;
      }

      if (el.open) el.close();
    },
  );

  const handleClose = (event?: Event, fromDialog = false) => {
    event?.preventDefault();
    event?.stopPropagation();

    if (props.cantClose) {
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

    if (!props.open) return;
    props.onCancel?.();
  };

  return (
    <dialog
      ref={(el) => {
        modalRef = el;
      }}
      class="modal modal-bottom sm:modal-middle backdrop-blur-xs"
      onClose={(e) => handleClose(e, true)}>
      <div class={["modal-box w-fit md:max-w-6/12", props.modalClass]}>
        <div class={["mb-2 flex w-full", props.title ? "justify-between" : "justify-end"]}>
          <Show when={props.title}>
            <h1 class={["text-primary text-xl font-bold", props.titleClass]}>{props.title}</h1>
          </Show>
          <Show when={!props.cantClose}>
            <button
              type="button"
              onClick={(e) => handleClose(e, false)}
              disabled={props.cantClose}
              class="btn btn-sm btn-circle">
              <CloseIcon class="text-lg" />
            </button>
          </Show>
        </div>
        {props.children}
        <Show when={props.actions}>
          <div class="modal-action">{props.actions}</div>
        </Show>
      </div>
      <form
        onSubmit={(e) => handleClose(e, false)}
        method="dialog"
        class="modal-backdrop">
        <button
          type="submit"
          aria-label="Fechar modal"
          class="cursor-default"
        />
      </form>
    </dialog>
  );
}
