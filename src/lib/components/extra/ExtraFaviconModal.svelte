<script lang="ts">
  import IconsClose from '@lucide/svelte/icons/x';
  import IconsLink from '@lucide/svelte/icons/link';
  import { fade, scale } from 'svelte/transition';

  let {
    open = $bindable(false),
    selected = '',
    customLink = '',
    onselect
  }: {
    open?: boolean;
    selected?: string;
    customLink?: string;
    onselect?: (name: string) => void;
  } = $props();

  // value -> icon path. 'custom-link' renders the user's link (or a
  // link glyph as fallback); 'default' uses the app favicon.
  const ICONS: Record<string, string> = {
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
    roger: '/favicons/roger.ico',
    default: '/favicon.ico'
  };

  const favicons = [
    'spasm', 'monero', 'zcash', 'ethereum', 'bitcoin', 'solana',
    'campfire', 'chat', 'cube', 'research', 'rocket', 'roger',
    'custom-link', 'default'
  ];

  const srcFor = (name: string): string | null => {
    if (name === 'custom-link') {
      return customLink && typeof customLink === 'string' ? customLink : null;
    }
    return ICONS[name] ?? null;
  };

  const choose = (name: string) => {
    onselect?.(name);
    open = false;
  };

  const onkeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') open = false;
  };
</script>

<svelte:window {onkeydown} />

{#if open}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
    onclick={() => (open = false)}
    transition:fade={{ duration: 120 }}
  >
    <div
      class="relative w-[24rem] max-w-full max-h-[85vh] overflow-y-auto scrollbar-none p-6 bg-bgSecondary-light dark:bg-bgSecondary-dark border border-borderColor-light dark:border-borderColor-dark rounded-xl shadow-xl"
      onclick={(e) => e.stopPropagation()}
      transition:scale={{ duration: 150, start: 0.96, opacity: 0 }}
    >
      <span
        class="absolute top-3 right-4 cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
        onclick={() => (open = false)}
      >
        <IconsClose class="w-5 h-5" />
      </span>

      <div class="mb-4 text-lg text-colorNotImportant-light dark:text-colorNotImportant-dark">
        Choose favicon
      </div>

      <div class="grid grid-cols-4 gap-2">
        {#each favicons as name}
          {@const src = srcFor(name)}
          <button
            type="button"
            onclick={() => choose(name)}
            class="flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-colors cursor-pointer
                   {selected === name
                     ? 'border-colorPrimary-light dark:border-colorPrimary-dark text-colorPrimary-light dark:text-colorPrimary-dark bg-bgHover-light dark:bg-bgHover-dark'
                     : 'border-borderColor-light dark:border-borderColor-dark text-colorNotImportant-light dark:text-colorNotImportant-dark hover:border-colorPrimary-light dark:hover:border-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark'}"
          >
            <span class="flex h-7 w-7 items-center justify-center">
              {#if src}
                <img {src} alt={name} class="h-7 w-7 object-contain" />
              {:else if name === 'custom-link'}
                <IconsLink class="h-5 w-5" />
              {:else}
                <span class="h-6 w-6 rounded bg-gray-300 dark:bg-gray-700"></span>
              {/if}
            </span>
            <span class="w-full truncate text-center text-[11px]">
              {name === 'custom-link' ? 'custom' : name}
            </span>
          </button>
        {/each}
      </div>
    </div>
  </div>
{/if}
