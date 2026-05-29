<script lang="ts">
  import { onMount } from 'svelte';

  let { onClose }: { onClose?: () => void } = $props();

  let show = $state(false);

  const close = () => {
    show = false;
    setTimeout(() => onClose?.(), 100);
  };

  onMount(() => {
    setTimeout(() => (show = true), 100);
  });
</script>

{#if show}
  <div class="fixed bg-black opacity-70 z-50 top-0 left-0 w-screen h-screen" onclick={close}></div>
{/if}
