<script lang="ts">
  import LoadingIcon from "~icons/mdi/loading";

  interface Props {
    padding?: boolean;
    class?: string;
  }

  const { padding = false, class: className = "" }: Props = $props();
</script>

<div class={`flex items-center justify-center ${padding ? "py-10" : ""}`}>
  <LoadingIcon class={`animate-spin ${className}`} />
</div>
