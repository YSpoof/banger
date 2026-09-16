import { createMemo, createSignal } from "solid-js";

import type { Toast } from "#lib/frontend/types.js";

const TOAST_DURATION_BY_TYPE: Record<Toast["type"], number> = {
  success: 3000,
  info: 4000,
  warning: 7000,
  error: 15000,
};

const [toastsPool, setToastsPool] = createSignal<Toast[]>([]);
const visibleToasts = createMemo(() => toastsPool().slice(0, 3));

let toastId = 0;

const showToast = (
  message: string,
  type: Toast["type"] = "info",
  duration: number = TOAST_DURATION_BY_TYPE[type],
) => {
  toastId += 1;
  const id = toastId;

  setToastsPool((current) => [
    ...current,
    {
      id,
      message,
      type,
      duration,
    },
  ]);
};

const removeToast = (id: number) => {
  setToastsPool((current) => current.filter((item) => item.id !== id));
};

const clearToasts = () => {
  setToastsPool([]);
};

export const toastStore = {
  visibleToasts,
  showToast,
  removeToast,
  clearToasts,
};
