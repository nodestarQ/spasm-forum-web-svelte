<script lang="ts">
  import type { SpasmEventV2 } from '$lib/types/interfaces';
  import { useUtils } from '$lib/utils/useUtils';
  import IconsCryptoMonero from '$lib/components/icons/IconsCryptoMonero.svelte';
  import IconsCryptoZcash from '$lib/components/icons/IconsCryptoZcash.svelte';
  import IconsCryptoEthereum from '$lib/components/icons/IconsCryptoEthereum.svelte';
  import IconsCryptoBitcoin from '$lib/components/icons/IconsCryptoBitcoin.svelte';
  import IconsCryptoSolana from '$lib/components/icons/IconsCryptoSolana.svelte';
  import IconsCopyToClipboard from '$lib/components/icons/IconsCopyToClipboard.svelte';
  import IconsCheck from '$lib/components/icons/IconsCheck.svelte';

  const { copyToClipboard, isArrayWithValues } = useUtils();

  let {
    event,
    showTipsText = false,
    showCopyToClipboard = true,
    allowOtherTickers = true,
    tickersWithIcons = ['xmr', 'zec', 'eth', 'btc', 'sol'],
    class: className = ''
  }: {
    event?: SpasmEventV2;
    showTipsText?: boolean;
    showCopyToClipboard?: boolean;
    allowOtherTickers?: boolean;
    tickersWithIcons?: string[];
    class?: string;
  } = $props();

  let currentTicker = $state('0001000');

  const clickedTicker = (newVal: string) => {
    if (!newVal) return;
    if (typeof newVal !== 'string') return;
    const val = newVal.toLowerCase();
    if (currentTicker && currentTicker === val) {
      currentTicker = '0001000';
    } else {
      currentTicker = val;
    }
  };

  let copyToClipboardTitle = $state('Click to copy');
  let showCopyToClipboardSuccess = $state(false);

  const copyToClipboardClicked = (value: string | number | undefined): void => {
    copyToClipboard(value);
    copyToClipboardTitle = 'Copied';
    showCopyToClipboardSuccess = true;
    setTimeout(() => {
      copyToClipboardTitle = 'Click to copy';
      showCopyToClipboardSuccess = false;
    }, 2000);
  };
</script>

{#if isArrayWithValues(event?.tips)}
  <div class="overflow-auto overflow-wrap break-words {className}">
    <div class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">
      {#if showTipsText}
        <span class="font-bold">Tips:</span>
      {/if}

      <!-- Show tickers with icons first, then tickers without icons -->
      {#each event?.tips ?? [] as tip}
        {#if tip?.currency?.ticker && typeof tip?.currency?.ticker === 'string'}
          <span class="hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark">
            <!-- With icons -->
            {#if tickersWithIcons.includes(tip.currency.ticker.toLowerCase())}
              <span
                onclick={() => clickedTicker(tip.currency!.ticker!)}
                class={currentTicker === tip.currency.ticker.toLowerCase()
                  ? 'text-colorPrimary-light dark:text-colorPrimary-dark'
                  : ''}
              >
                {#if tip?.address && typeof tip?.address === 'string'}
                  <span class="cursor-pointer">
                    {#if tickersWithIcons.includes('xmr') && tip.currency.ticker.toLowerCase() === 'xmr'}
                      <span title="Monero"><IconsCryptoMonero class="mx-1 custom-icons-large" /></span>
                    {:else if tickersWithIcons.includes('zec') && tip.currency.ticker.toLowerCase() === 'zec'}
                      <span title="Zcash"><IconsCryptoZcash class="mx-1 custom-icons-large" /></span>
                    {:else if tickersWithIcons.includes('eth') && tip.currency.ticker.toLowerCase() === 'eth'}
                      <span title="Ether"><IconsCryptoEthereum class="mx-1 custom-icons-large" /></span>
                    {:else if tickersWithIcons.includes('btc') && tip.currency.ticker.toLowerCase() === 'btc'}
                      <span title="Bitcoin"><IconsCryptoBitcoin class="mx-0 custom-icons-xxl" /></span>
                    {:else if tickersWithIcons.includes('sol') && tip.currency.ticker.toLowerCase() === 'sol'}
                      <span title="Solana"><IconsCryptoSolana class="mx-1 custom-icons-large" /></span>
                    {:else}
                      <span class="mx-1">{tip.currency.ticker.toUpperCase()}</span>
                    {/if}
                  </span>
                {/if}
              </span>
            {/if}
          </span>
        {/if}
      {/each}

      <!-- Now, tickers without icons -->
      {#if allowOtherTickers}
        {#each event?.tips ?? [] as tip}
          {#if tip?.currency?.ticker && typeof tip?.currency?.ticker === 'string'}
            <span class="hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark">
              <!-- Without icons -->
              {#if !tickersWithIcons.includes(tip.currency.ticker.toLowerCase())}
                <span
                  onclick={() => clickedTicker(tip.currency!.ticker!)}
                  class={currentTicker === tip.currency.ticker.toLowerCase()
                    ? 'text-colorPrimary-light dark:text-colorPrimary-dark'
                    : ''}
                >
                  {#if tip?.address && typeof tip?.address === 'string'}
                    <span class="cursor-pointer">
                      <span class="mx-1">{tip.currency.ticker.toUpperCase()}</span>
                    </span>
                  {/if}
                </span>
              {/if}
            </span>
          {/if}
        {/each}
      {/if}
    </div>

    {#each event?.tips ?? [] as tip}
      {#if tip?.address && tip?.currency?.ticker && typeof tip?.currency?.ticker === 'string'}
        <div class="my-1" title={copyToClipboardTitle}>
          {#if tip.currency.ticker.toLowerCase() === currentTicker}
            <div>
              <div>
                {#if typeof tip?.currency?.ticker === 'string'}
                  <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark font-bold">
                    {tip.currency.ticker.toUpperCase()}:
                  </span>
                {/if}
                <span
                  class="hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer"
                  onclick={() => copyToClipboardClicked(tip.address)}
                >
                  {tip.address}
                </span>
                <button class="ml-1" onclick={() => copyToClipboardClicked(tip.address)}>
                  {#if showCopyToClipboard && !showCopyToClipboardSuccess}
                    <IconsCopyToClipboard class="custom-icons-large lg:custom-icons pb-1 text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer" />
                  {/if}
                  {#if showCopyToClipboard && showCopyToClipboardSuccess}
                    <IconsCheck class="custom-icons-large lg:custom-icons pb-1 text-colorGreen-light dark:text-colorGreen-dark" />
                  {/if}
                </button>
              </div>
              <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
                You can tip the author to this address.
              </div>
            </div>
          {/if}
        </div>
      {/if}
    {/each}
  </div>
{/if}
