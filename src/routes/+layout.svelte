<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { ModeWatcher } from 'mode-watcher';
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';
  import { useWeb3 } from '$lib/utils/useWeb3';
  import Navbar from '$lib/components/navbar/Navbar.svelte';
  import ExtraNotification from '$lib/components/extra/ExtraNotification.svelte';
  import Feed from '$lib/components/feed/Feed.svelte';
  import Info from '$lib/components/info/Info.svelte';
  import ExtraWeb3Modal from '$lib/components/extra/ExtraWeb3Modal.svelte';
  import ExtraQrCodeModal from '$lib/components/extra/ExtraQrCodeModal.svelte';
  import ExtraFollowModal from '$lib/components/extra/ExtraFollowModal.svelte';
  import { useFeed } from '$lib/utils/useFeed';

  let { children } = $props();

  const {
    setConnectedAddress,
    isWeb3ModalShown,
    isQrCodeModalShown,
    isFollowModalShown
  } = useWeb3();
  const { isFeedShown } = useFeed();
  const appConfig = useAppConfigStore()?.getAppConfig;

  const onAccountsChanged = (accounts?: string[]) => {
    if (Array.isArray(accounts) && typeof accounts?.[0] === 'string') {
      setConnectedAddress(accounts[0]);
    } else {
      setConnectedAddress('');
    }
  };

  const setListeners = (on: boolean) => {
    if (window?.ethereum) {
      if (on) {
        // TODO: use provider instead of window.ethereum
        window.ethereum.on('accountsChanged', onAccountsChanged);
      } else {
        window.ethereum.removeListener('accountsChanged', onAccountsChanged);
      }
    }
  };

  onMount(() => {
    // Always use the latest app config from the database.
    useAppConfigStore()?.fetchAndUpdateAppConfig();
    setListeners(true);
    return () => setListeners(false);
  });
</script>

<svelte:head>
  <title>{appConfig?.introTitle || 'Spasm'}</title>
  <meta name="description" content={appConfig?.introTitle || ''} />
  <meta property="og:title" content={appConfig?.introTitle || ''} />
  <meta property="og:site_name" content={appConfig?.introTitle || ''} />
  <meta property="og:description" content={appConfig?.introAbout || ''} />
</svelte:head>

<ModeWatcher />

<div class="text-base bg-bgBase-light dark:bg-bgBase-dark text-colorBase-light dark:text-colorBase-dark">
  <div class="max-w-[1920px] m-auto">
    <!-- TODO (task 18): PWA manifest -->

    <div class="Navbar">
      <Navbar class="fixed bottom-0 w-screen" />
    </div>

    <ExtraNotification />

    <div class="grid grid-cols-11">
      <Feed
        class="lg:border-r border-borderColor-light dark:border-borderColor-dark h-screen overflow-scroll col-span-11 lg:col-span-4 {isFeedShown.value ? 'block' : 'hidden lg:block'}"
      />
      <div
        class="w-screen h-screen overflow-scroll col-span-7 lg:w-full {!isFeedShown.value ? 'block' : 'hidden lg:block'}"
      >
        <Info>
          {@render children()}
        </Info>
      </div>
    </div>

    {#if isWeb3ModalShown.value}
      <ExtraWeb3Modal />
    {/if}
    {#if isQrCodeModalShown.value}
      <ExtraQrCodeModal />
    {/if}
    {#if isFollowModalShown.value}
      <ExtraFollowModal />
    {/if}

    <!-- TODO (task 10 follow-up): dynamic :root color vars from appConfig (env/admin overrides) -->
  </div>
</div>
