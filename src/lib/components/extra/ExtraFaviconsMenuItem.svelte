<script lang="ts">
  let { favicon, onclick }: { favicon?: string; onclick?: () => void } = $props();

  const iconMap: Record<string, string> = {
    spasm: '/favicons/spasm.ico',
    monero: '/favicons/monero.ico',
    zcash: '/favicons/zcash.ico',
    ethereum: '/favicons/ethereum.ico',
    bitcoin: '/favicons/bitcoin.ico',
    solana: '/favicons/solana.ico',
    campfire: '/favicons/campfire.ico',
    chat: '/favicons/chat.ico',
    cube: '/favicons/cube.ico',
    research: '/favicons/research.ico',
    rocket: '/favicons/rocket.ico',
    roger: '/favicons/roger.ico'
    // no images for "custom-link" and "default" - fallback used
  };

  const imgSrc = $derived.by(() => {
    if (favicon === 'default') return '/favicon.ico';
    return favicon ? (iconMap[favicon] ?? null) : null;
  });
</script>

<div
  {onclick}
  class="py-1 font-bold text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer"
>
  {#if imgSrc}
    <img src={imgSrc} alt={favicon} class="inline pr-1 w-5 h-5 object-contain" />
  {:else}
    <span class="w-5 h-5 bg-gray-300 dark:bg-gray-700 rounded-sm"></span>
  {/if}
  <span>{favicon}</span>
</div>
