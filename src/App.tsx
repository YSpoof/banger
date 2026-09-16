import { isServer } from "@solidjs/web";
import { createSignal, lazy, Loading, onSettled, Show } from "solid-js";
import { registerSW } from "virtual:typed-sw-register";
import BombIcon from "~icons/mdi/bomb";

import Home from "#lib/frontend/pages/Home.jsx";
import { appState } from "#lib/frontend/stores/appState.js";

import "#lib/frontend/layout.css";

const ToastRenderer = lazy(() => import("#lib/frontend/components/ui/ToastRenderer.js"));

export default function App() {
  const [isLoading, setIsLoading] = createSignal(true);

  onSettled(() => {
    if (isServer) return;

    registerSW();

    if (!appState.doRedirect()) {
      setIsLoading(false);
    }
  });

  return (
    <Show
      when={!isLoading()}
      fallback={
        <div class="flex min-h-screen flex-col items-center justify-center gap-4">
          <BombIcon class="size-12 animate-bounce text-black dark:text-white" />
          <p class="text-base-content skeleton skeleton-text text-lg">Carregando...</p>
        </div>
      }>
      <main class="container mx-auto max-w-3xl px-4 py-4">
        <Home />
      </main>

      <Loading>
        <ToastRenderer />
      </Loading>
    </Show>
  );
}
