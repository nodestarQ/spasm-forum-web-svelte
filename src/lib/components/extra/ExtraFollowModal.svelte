<script lang="ts">
  import { useWeb3 } from '$lib/utils/useWeb3';
  import ExtraAddressIcons from './ExtraAddressIcons.svelte';

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
  class="fixed top-0 bottom-0 left-0 right-0 grid justify-center bg-black/60 scrollbar-none"
  onclick={() => hideFollowModal()}
>
  <div
    class="mt-6 lg:mt-5 max-h-112 overflow-scroll bg-bgSecondary-light dark:bg-bgSecondary-dark block w-80 text-center relative scrollbar-none"
    onclick={(e) => e.stopPropagation()}
  >
    <span
      class="pr-3 pt-2 pl-1 pb-1 absolute right-0 top-0 cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
      onclick={() => hideFollowModal()}
    >
      X
    </span>
    <div class="mt-12 mb-6 mx-9 overflow-auto overflow-wrap wrap-break-word text-start">
      {followValue.value}
      {#if followValue.value}
        <ExtraAddressIcons value={followValue.value} showCopyToClipboard={true} />
      {/if}
    </div>

    <div class="mt-2">Follow options:</div>

    <!-- Ethereum -->
    {#if protocol === 'ethereum'}
      <div>
        <a href={'https://app.push.org/channels/' + followValue.value} target="_blank">
          <button class="w-48 h-10 my-3 border rounded-lg text-colorBase-light dark:text-colorBase-dark border-colorBase-light dark:border-colorBase-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark hover:border-colorPrimary-light dark:hover:border-colorPrimary-dark">
            Push
          </button>
        </a>
      </div>
      <div>
        <a href={'https://etherscan.io/address/' + followValue.value} target="_blank">
          <button class="w-48 h-10 my-3 border rounded-lg text-colorBase-light dark:text-colorBase-dark border-colorBase-light dark:border-colorBase-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark hover:border-colorPrimary-light dark:hover:border-colorPrimary-dark">
            Etherscan
          </button>
        </a>
      </div>
      <div>
        <a href={'https://opensea.io/' + followValue.value} target="_blank">
          <button class="w-48 h-10 my-3 border rounded-lg text-colorBase-light dark:text-colorBase-dark border-colorBase-light dark:border-colorBase-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark hover:border-colorPrimary-light dark:hover:border-colorPrimary-dark">
            Opensea
          </button>
        </a>
      </div>
    {/if}

    <!-- Nostr -->
    {#if protocol === 'nostr'}
      <div>
        <a href={'https://njump.me/' + followValue.value} target="_blank">
          <button class="w-48 h-10 my-3 border rounded-lg text-colorBase-light dark:text-colorBase-dark border-colorBase-light dark:border-colorBase-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark hover:border-colorPrimary-light dark:hover:border-colorPrimary-dark">
            Njump
          </button>
        </a>
      </div>
      <div>
        <a href={'https://primal.net/p/' + followValue.value} target="_blank">
          <button class="w-48 h-10 my-3 border rounded-lg text-colorBase-light dark:text-colorBase-dark border-colorBase-light dark:border-colorBase-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark hover:border-colorPrimary-light dark:hover:border-colorPrimary-dark">
            Primal
          </button>
        </a>
      </div>
      <div>
        <a href={'nostr:' + followValue.value} target="_blank">
          <button class="w-48 h-10 my-3 border rounded-lg text-colorBase-light dark:text-colorBase-dark border-colorBase-light dark:border-colorBase-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark hover:border-colorPrimary-light dark:hover:border-colorPrimary-dark">
            Default Nostr app
          </button>
        </a>
      </div>
    {/if}

    <button
      class="w-48 h-10 my-3 border rounded-lg border-colorBase-light dark:border-colorBase-dark hover:text-colorPrimary-light dark:hover:colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark hover:border-colorPrimary-light dark:hover:border-colorPrimary-dark"
      onclick={() => hideFollowModal()}
    >
      Close
    </button>
  </div>
</div>
