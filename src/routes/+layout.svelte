<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { ModeWatcher } from 'mode-watcher';
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';
  import { useWeb3 } from '$lib/utils/useWeb3';
  import Navbar from '$lib/components/navbar/Navbar.svelte';
  import ExtraNotification from '$lib/components/extra/ExtraNotification.svelte';

  let { children } = $props();

  const { setConnectedAddress } = useWeb3();
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
      <!-- TODO (task 12): <Feed /> in the left column (col-span-4) -->
      <!-- TODO (task 13): wrap the page content in <Info> -->
      <div class="w-screen h-screen overflow-scroll col-span-11 lg:col-span-7 lg:w-full">
        {@render children()}
      </div>
    </div>

    <!-- TODO (task 14): web3 / qr / follow modals -->
    <!-- TODO (task 10 follow-up): dynamic :root color vars from appConfig (env/admin overrides) -->
  </div>
</div>
