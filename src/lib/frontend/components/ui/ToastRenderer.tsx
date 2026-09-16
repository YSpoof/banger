import { For, Match, Switch } from "solid-js";
import AlertOctagon from "~icons/mdi/alert-octagon-outline";
import AlertTriangle from "~icons/mdi/alert-outline";
import CheckCircle from "~icons/mdi/check-circle-outline";
import Close from "~icons/mdi/close";
import Information from "~icons/mdi/information-outline";

import ToastProgressBar from "#lib/frontend/components/ui/ToastProgressBar.js";
import { toastStore } from "#lib/frontend/stores/toast.js";
import type { Toast } from "#lib/frontend/types.js";

const toastClass: Record<Toast["type"], string> = {
  info: "alert-info",
  success: "alert-success",
  warning: "alert-warning",
  error: "alert-error",
};

const toastProgressClass: Record<Toast["type"], string> = {
  info: "bg-info-content/90",
  success: "bg-success-content/90",
  warning: "bg-warning-content/90",
  error: "bg-error-content/90",
};

function ToastIcon(props: { type: Toast["type"]; class?: string }) {
  return (
    <Switch>
      <Match when={props.type === "info"}>
        <Information class={props.class} />
      </Match>
      <Match when={props.type === "success"}>
        <CheckCircle class={props.class} />
      </Match>
      <Match when={props.type === "warning"}>
        <AlertTriangle class={props.class} />
      </Match>
      <Match when={props.type === "error"}>
        <AlertOctagon class={props.class} />
      </Match>
    </Switch>
  );
}

function ToastItem(props: { toast: Toast }) {
  return (
    <div
      class={["alert relative overflow-hidden", toastClass[props.toast.type]]}
      role="status">
      <ToastIcon
        type={props.toast.type}
        class="shrink-0 text-2xl"
      />
      <span>{props.toast.message}</span>
      <button
        type="button"
        class="btn btn-xs btn-ghost btn-circle"
        onClick={() => {
          toastStore.removeToast(props.toast.id);
        }}
        aria-label="Fechar notificação">
        <Close class="text-xl" />
      </button>

      <ToastProgressBar
        duration={props.toast.duration}
        progressClass={toastProgressClass[props.toast.type]}
        onComplete={() => toastStore.removeToast(props.toast.id)}
      />
    </div>
  );
}

export default function ToastRenderer() {
  return (
    <output
      class="toast toast-top toast-center top-20! z-50"
      aria-live="polite">
      <For
        each={toastStore.visibleToasts()}
        keyed={(toast) => toast.id}>
        {(toast) => <ToastItem toast={toast()} />}
      </For>
    </output>
  );
}
