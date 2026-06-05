<script lang="ts">
  import { useNotificationStore } from '$lib/stores/useNotificationStore';
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';
  import { useWeb3 } from '$lib/utils/useWeb3';
  import { useWalletDiscovery } from '$lib/utils/useWalletDiscovery';
  import IconsUser from '$lib/components/icons/IconsUser.svelte';
  import { onMount } from 'svelte';

  const appConfig = useAppConfigStore()?.getAppConfig;
  const notificationStore = useNotificationStore();
  const {
    connectWeb3Authenticator,
    connectNostrExtension,
    setRandomSigner,
    disconnectAccount,
    hideWeb3Modal
  } = useWeb3();
  const ifAllowGuestLogin = appConfig?.ifAllowGuestLogin;
  const enableNewNostrActionsAll = appConfig?.enableNewNostrActionsAll;
  const enableNewEthereumActionsAll = appConfig?.enableNewEthereumActionsAll;

  // EIP-6963: discover every injected wallet instead of guessing
  // from the single window.ethereum slot.
  const { wallets, discover } = useWalletDiscovery();
  onMount(discover);

  const walletClicked = async (provider: any) => {
    try {
      const res = await connectWeb3Authenticator(provider);
      if (res) {
        hideWeb3Modal();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const browserExtensionClicked = async () => {
    const web3 = window.ethereum;
    if (web3) {
      try {
        const res = await connectWeb3Authenticator();
        if (res) {
          hideWeb3Modal();
        }
        return;
      } catch (err) {
        console.error(err);
      }
    } else {
      notificationStore.showNotification(
        'Please install MetaMask, Rabby or other web3 browser extensions and reload the page',
        'error',
        8000
      );
    }
  };

  const nostrExtensionClicked = async () => {
    const nostr = window.nostr;
    if (nostr) {
      try {
        const res = await connectNostrExtension();
        if (res) {
          hideWeb3Modal();
        }
        return;
      } catch (err) {
        console.error(err);
      }
    } else {
      notificationStore.showNotification(
        'Please install nos2x, flamingo, or other Nostr browser extensions and reload the page',
        'error',
        6000
      );
    }
  };

  const guestClicked = () => {
    setRandomSigner();
    hideWeb3Modal();
  };

  const logOut = () => {
    disconnectAccount();
    hideWeb3Modal();
  };
</script>

<div
  class="fixed top-0 bottom-0 left-0 right-0 grid justify-center bg-black bg-opacity-60 scrollbar-hide"
  onclick={() => hideWeb3Modal()}
>
  <div
    class="mt-2 lg:mt-5 max-h-[33rem] overflow-scroll bg-bgSecondary-light dark:bg-bgSecondary-dark block w-80 text-center relative scrollbar-hide"
    onclick={(e) => e.stopPropagation()}
  >
    <span
      class="pr-3 pt-2 pl-1 pb-1 absolute right-0 top-0 cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
      onclick={() => hideWeb3Modal()}
    >
      X
    </span>

    {#if ifAllowGuestLogin && enableNewEthereumActionsAll}
      <div class="mt-5 mx-10 text-sm text-colorNotImportant-light dark:text-colorNotImportant-dark">
        Temporary:
      </div>
      <div class="font-bold">
        <div
          class="block mb-3 hover:bg-bgHover-light dark:hover:bg-bgHover-dark cursor-pointer"
          onclick={() => guestClicked()}
        >
          <IconsUser class="m-1 w-6 inline-block" />
          Log in as guest
        </div>
      </div>
    {:else}
      <div class="h-16"><br /></div>
    {/if}

    <!-- Ethereum -->
    {#if enableNewEthereumActionsAll}
      <div class="mx-10 text-sm font-normal border-t border-colorNotImportant-light dark:border-colorNotImportant-dark text-colorNotImportant-light dark:text-colorNotImportant-dark">
        Ethereum browser extensions:
      </div>

      {#each wallets.value as wallet (wallet.info.rdns)}
        <div
          class="block mt-2 mb-1 hover:bg-bgHover-light dark:hover:bg-bgHover-dark cursor-pointer"
          onclick={() => walletClicked(wallet.provider)}
        >
          <img class="inline-block w-8" src={wallet.info.icon} alt={wallet.info.name} />
          {wallet.info.name}
        </div>
      {/each}

      {#if wallets.value.length === 0}
        <!-- Fallback for wallets that don't support EIP-6963 yet:
             connect through the single window.ethereum slot. -->
        <div
          class="block mt-2 mb-4 h-8 hover:bg-bgHover-light dark:hover:bg-bgHover-dark cursor-pointer"
          onclick={() => browserExtensionClicked()}
        >
          Other Ethereum extension
        </div>
      {/if}
    {/if}

    <!-- Nostr -->
    {#if enableNewNostrActionsAll}
      <div class="mx-10 text-sm font-normal border-t border-colorNotImportant-light dark:border-colorNotImportant-dark text-colorNotImportant-light dark:text-colorNotImportant-dark">
        Nostr browser extensions:
      </div>

      <div
        class="block mt-3 mb-3 hover:bg-bgHover-light dark:hover:bg-bgHover-dark cursor-pointer"
        onclick={() => nostrExtensionClicked()}
      >
        <img class="inline-block w-7" src="/images/logos/nos2x-logo.png" alt="nos2x logo" />
        nos2x
      </div>

      <div
        class="block mt-2 mb-2 hover:bg-bgHover-light dark:hover:bg-bgHover-dark cursor-pointer"
        onclick={() => nostrExtensionClicked()}
      >
        <img class="inline-block w-7" src="/images/logos/flamingo-logo.png" alt="Flamingo logo" />
        Flamingo
      </div>

      <div
        class="block mb-4 h-8 hover:bg-bgHover-light dark:hover:bg-bgHover-dark cursor-pointer"
        onclick={() => nostrExtensionClicked()}
      >
        Another Nostr extension
      </div>
    {/if}

    <div class="mx-10 text-sm border-t border-colorNotImportant-light dark:border-colorNotImportant-dark text-colorNotImportant-light dark:text-colorNotImportant-dark"></div>
    <button
      class="w-48 h-8 my-1 text-colorNotImportant-light dark:text-colorNotImportant-dark"
      onclick={() => logOut()}
    >
      Log out
    </button>
    <button
      class="w-48 h-10 my-3 border rounded-lg border-colorBase-light dark:border-colorBase-dark hover:text-colorPrimary-light dark:hover:colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark hover:border-colorPrimary-light dark:hover:border-colorPrimary-dark"
      onclick={() => hideWeb3Modal()}
    >
      Close
    </button>
  </div>
</div>
