<script lang="ts">
  import { useWeb3 } from '$lib/utils/useWeb3';
  import ExtraAddressIcons from './ExtraAddressIcons.svelte';
  import IconsClose from '@lucide/svelte/icons/x';
  import { fade, scale } from 'svelte/transition';

  const { followValue, hideFollowModal } = useWeb3();

  const protocol = $derived.by(() => {
    const val = followValue.value;
    if (val && typeof val === 'string') {
      if (val.startsWith('0x') && val.length === 42) {
        return 'ethereum';
      } else if (
        (val.startsWith('npub') && val.length === 63) ||
        (val.startsWith('note') && val.length === 63)
      ) {
        return 'nostr';
      }
    }
    return '';
  });
</script>

<div
  class="fixed inset-0 flex items-center justify-center p-4 bg-black/60"
  onclick={() => hideFollowModal()}
  transition:fade={{ duration: 120 }}
>
  <div
    class="relative w-80 max-w-full max-h-[85vh] overflow-y-auto scrollbar-none p-6 text-center bg-bgSecondary-light dark:bg-bgSecondary-dark border border-borderColor-light dark:border-borderColor-dark rounded-xl shadow-xl"
    onclick={(e) => e.stopPropagation()}
    transition:scale={{ duration: 150, start: 0.96, opacity: 0 }}
  >
    <span
      class="absolute top-3 right-4 cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
      onclick={() => hideFollowModal()}
    >
      <IconsClose class="w-5 h-5" />
    </span>

    <div class="flex flex-col gap-3 mt-4">
      <div class="overflow-auto wrap-break-word text-start">
        {followValue.value}
        {#if followValue.value}
          <ExtraAddressIcons value={followValue.value} showCopyToClipboard={true} />
        {/if}
      </div>

      <div class="modal-divider"></div>

      <div class="text-sm text-colorNotImportant-light dark:text-colorNotImportant-dark">
        Follow options
      </div>

      <!-- Ethereum -->
      {#if protocol === 'ethereum'}
        <a class="modal-option" href={'https://app.push.org/channels/' + followValue.value} target="_blank">
          Push
        </a>
        <a class="modal-option" href={'https://etherscan.io/address/' + followValue.value} target="_blank">
          Etherscan
        </a>
        <a class="modal-option" href={'https://opensea.io/' + followValue.value} target="_blank">
          Opensea
        </a>
      {/if}

      <!-- Nostr -->
      {#if protocol === 'nostr'}
        <a class="modal-option" href={'https://njump.me/' + followValue.value} target="_blank">
          Njump
        </a>
        <a class="modal-option" href={'https://primal.net/p/' + followValue.value} target="_blank">
          Primal
        </a>
        <a class="modal-option" href={'nostr:' + followValue.value} target="_blank">
          Default Nostr app
        </a>
      {/if}
    </div>
  </div>
</div>
