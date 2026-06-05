<script lang="ts">
  import { useNotificationStore } from '$lib/stores/useNotificationStore';
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';
  import { useWeb3 } from '$lib/utils/useWeb3';
  import { useWalletDiscovery } from '$lib/utils/useWalletDiscovery';
  import IconsUser from '@lucide/svelte/icons/user';
  import IconsClose from '@lucide/svelte/icons/x';
  import { onMount } from 'svelte';
  import { fade, scale } from 'svelte/transition';

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
  class="fixed inset-0 flex items-center justify-center p-4 bg-black/60"
  onclick={() => hideWeb3Modal()}
  transition:fade={{ duration: 120 }}
>
  <div
    class="relative w-80 max-w-full max-h-[85vh] overflow-y-auto scrollbar-none p-6 text-center bg-bgSecondary-light dark:bg-bgSecondary-dark border border-borderColor-light dark:border-borderColor-dark rounded-xl shadow-xl"
    onclick={(e) => e.stopPropagation()}
    transition:scale={{ duration: 150, start: 0.96, opacity: 0 }}
  >
    <span
      class="absolute top-3 right-4 cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
      onclick={() => hideWeb3Modal()}
    >
      <IconsClose class="w-5 h-5" />
    </span>

    <div class="flex flex-col gap-3 mt-4">
      <!-- Guest (temporary identity) -->
      {#if ifAllowGuestLogin && enableNewEthereumActionsAll}
        <div class="text-sm text-colorNotImportant-light dark:text-colorNotImportant-dark">
          Temporary
        </div>
        <button type="button" class="modal-option" onclick={() => guestClicked()}>
          <IconsUser class="w-6 h-6 inline-block" />
          Log in as guest
        </button>
        <div class="modal-divider"></div>
      {/if}

      <!-- Ethereum -->
      {#if enableNewEthereumActionsAll}
        <div class="text-sm text-colorNotImportant-light dark:text-colorNotImportant-dark">
          Ethereum browser extensions
        </div>

        {#each wallets.value as wallet (wallet.info.rdns)}
          <button type="button" class="modal-option" onclick={() => walletClicked(wallet.provider)}>
            <img class="w-6 h-6 object-contain" src={wallet.info.icon} alt={wallet.info.name} />
            {wallet.info.name}
          </button>
        {/each}

        {#if wallets.value.length === 0}
          <!-- Fallback for wallets that don't support EIP-6963 yet. -->
          <button type="button" class="modal-option" onclick={() => browserExtensionClicked()}>
            Other Ethereum extension
          </button>
        {/if}
        <div class="modal-divider"></div>
      {/if}

      <!-- Nostr -->
      {#if enableNewNostrActionsAll}
        <div class="text-sm text-colorNotImportant-light dark:text-colorNotImportant-dark">
          Nostr browser extensions
        </div>

        <button type="button" class="modal-option" onclick={() => nostrExtensionClicked()}>
          <img class="w-6 h-6 object-contain" src="/images/logos/nos2x-logo.png" alt="nos2x logo" />
          nos2x
        </button>

        <button type="button" class="modal-option" onclick={() => nostrExtensionClicked()}>
          <img class="w-6 h-6 object-contain" src="/images/logos/flamingo-logo.png" alt="Flamingo logo" />
          Flamingo
        </button>

        <button type="button" class="modal-option" onclick={() => nostrExtensionClicked()}>
          Another Nostr extension
        </button>
        <div class="modal-divider"></div>
      {/if}

      <!-- Log out: account action, kept last -->
      <button type="button" class="modal-option-muted" onclick={() => logOut()}>
        Log out
      </button>
    </div>
  </div>
</div>
