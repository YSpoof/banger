<script lang="ts">
  import "./layout.css";
  import { updated } from "$app/state";
  import { onMount } from "svelte";
  import BombIcon from "~icons/mdi/bomb";

  import { appState } from "#lib/frontend/stores/appState.svelte.js";
  let { children } = $props();

  let isLoading = $state(true);

  onMount(() => {
    if (!appState.doRedirect()) {
      isLoading = false;
    }
  });
</script>

<svelte:head>
    <meta
      name="theme-color"
      content="#000000" />

    <!-- Primary Meta Tags -->
    <title>Banger</title>
    <meta
      name="title"
      content="Banger" />
    <meta
      name="description"
      content="Banger: Procure coisas usando bangs!" />

    <link
      title="Banger"
      rel="search"
      type="application/opensearchdescription+xml"
      href="/opensearch.xml" />

    <link
      rel="icon"
      type="image/svg"
      href="favicon.svg" />
    <meta
      name="keywords"
      content="bangs, search, web, shortcuts, pesquisa, internet" />
    <meta
      name="author"
      content="LZArt" />

    <!-- Open Graph / Facebook -->
    <meta
      property="og:type"
      content="website" />
    <meta
      property="og:url"
      content="https://banger.lzart.com.br/" />
    <meta
      property="og:title"
      content="Banger" />
    <meta
      property="og:description"
      content="Banger: Procure coisas usando bangs!" />
    <meta
      property="og:image"
      content="https://banger.lzart.com.br/banger.webp" />

    <!-- Twitter -->
    <meta
      property="twitter:card"
      content="summary_large_image" />
    <meta
      property="twitter:url"
      content="https://banger.lzart.com.br/" />
    <meta
      property="twitter:title"
      content="Banger" />
    <meta
      property="twitter:description"
      content="Banger: Procure coisas usando bangs!" />
    <meta
      property="twitter:image"
      content="https://banger.lzart.com.br/banger.webp" />
    </svelte:head>

{#if isLoading}
  <div class="flex min-h-screen flex-col items-center justify-center gap-4">
    <BombIcon class="size-12 animate-bounce text-black dark:text-white" />
    <p class="text-base-content text-lg skeleton skeleton-text">Carregando...</p>
  </div>
{:else}
  <main class="container mx-auto max-w-3xl px-4 py-4">
    {@render children()}
  </main>

  {#if updated.current}
    {const UpdateAppModal = (await import("#lib/frontend/components/modals/UpdateAppModal.svelte"))
      .default}
    <UpdateAppModal open={updated.current} />
  {/if}

  {const ToastRenderer = (await import("#lib/frontend/components/ui/ToastRenderer.svelte")).default}
  <ToastRenderer />
{/if}
