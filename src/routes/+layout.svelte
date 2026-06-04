<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { dev } from '$app/environment';
  import { pwaInfo } from 'virtual:pwa-info';
  import { registerSW } from 'virtual:pwa-register';
  import { ModeWatcher } from 'mode-watcher';
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';
  import { useWeb3 } from '$lib/utils/useWeb3';
  import { applyThemeColors, applyFavicon } from '$lib/utils/useTheme';
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

  // PWA web manifest link (undefined during SSR / dev when the
  // PWA dev option is off).
  const webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';

  // Apply the admin-configured theme colors and favicon once the
  // app config is loaded (reapplies when the config changes).
  $effect(() => {
    const config = useAppConfigStore()?.getAppConfig;
    applyThemeColors(config);
    applyFavicon(config);
  });

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

  // In production we run the generated service worker (autoUpdate). In
  // dev we run none, so any worker still registered on this origin is
  // stale (typically the old Nuxt PWA worker from when it served the
  // same localhost:3000). Left alone it keeps serving a cached _nuxt/*
  // app shell and spams the console with 404s, so tear it down and drop
  // its caches.
  const removeStaleServiceWorkers = async () => {
    if (!('serviceWorker' in navigator)) return;
    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map((r) => r.unregister()));
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }
      // A worker was controlling this page: reload once (guarded so we
      // never loop) so the dev server serves a clean app.
      if (
        registrations.length > 0 &&
        navigator.serviceWorker.controller &&
        !sessionStorage.getItem('sw-cleanup-reloaded')
      ) {
        sessionStorage.setItem('sw-cleanup-reloaded', '1');
        location.reload();
      }
    } catch {
      // Best-effort cleanup; ignore failures.
    }
  };

  onMount(() => {
    // Always use the latest app config from the database.
    useAppConfigStore()?.fetchAndUpdateAppConfig();
    setListeners(true);
    if (dev) {
      void removeStaleServiceWorkers();
    } else {
      // Register the service worker in production (autoUpdate).
      registerSW({ immediate: true });
    }
    return () => setListeners(false);
  });
</script>

<svelte:head>
  <title>{appConfig?.introTitle || 'Spasm'}</title>
  <meta name="description" content={appConfig?.introTitle || ''} />
  <meta property="og:title" content={appConfig?.introTitle || ''} />
  <meta property="og:site_name" content={appConfig?.introTitle || ''} />
  <meta property="og:description" content={appConfig?.introAbout || ''} />
  {@html webManifestLink}
</svelte:head>

<ModeWatcher />

<div class="text-base bg-bgBase-light dark:bg-bgBase-dark text-colorBase-light dark:text-colorBase-dark">
  <div class="max-w-[1920px] m-auto">
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
  </div>
</div>
