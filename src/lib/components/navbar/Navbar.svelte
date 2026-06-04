<script lang="ts">
  import { dev } from '$app/environment';
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';
  import { useFeed } from '$lib/utils/useFeed';
  import { useWeb3 } from '$lib/utils/useWeb3';
  import { useUtils } from '$lib/utils/useUtils';
  import { useNostr } from '$lib/utils/useNostr';
  import { config } from '$lib/config';
  import NavbarThemeSwitch from './NavbarThemeSwitch.svelte';
  import ExtraBlockies from '$lib/components/extra/ExtraBlockies.svelte';

  let { class: className = '' }: { class?: string } = $props();

  const appConfig = useAppConfigStore()?.getAppConfig;
  const admins = appConfig?.admins;
  const enableAdmin = appConfig?.enableAdmin;
  const enableAppConfigChanges = appConfig?.enableAppConfigChanges;
  const enableAppConfigChangesByAdmin = appConfig?.enableAppConfigChangesByAdmin;
  const { showFeed, hideFeed, isFeedShown } = useFeed();
  const { showWeb3Modal, pendingAuthentication, connectedAddress } = useWeb3();
  const { sliceAddress } = useUtils();
  const { isInList } = useNostr();
  const enableNewWeb3ActionsAll = appConfig?.enableNewWeb3ActionsAll;
  const enableNewWeb3ActionsPost = appConfig?.enableNewWeb3ActionsPost;
  // TODO move env vars to admin panel
  const showNewPostButtonInMenu = config?.showNewPostButtonInMenu === 'false' ? false : true;
</script>

<div class="py-1 text-base lg:text-lg bg-bgSecondary-light dark:bg-bgSecondary-dark {className}">
  <div class="max-w-[1920px] m-auto">
    <NavbarThemeSwitch />
    <div
      class="inline-block pl-1 lg:pl-2 cursor-pointer lg:hidden"
      onclick={() => (isFeedShown.value ? hideFeed() : showFeed())}
    >
      Feed
    </div>
    <div class="inline-block pl-1 lg:pl-2" onclick={() => hideFeed()}>
      <a href="/" class="app-link">Home</a>
    </div>
    {#if showNewPostButtonInMenu && enableNewWeb3ActionsAll && enableNewWeb3ActionsPost}
      <div class="inline-block">
        <div class="inline-block pl-1 lg:pl-2" onclick={() => hideFeed()}>
          <a href="/newpost" class="app-link">Publish</a>
        </div>
      </div>
    {/if}
    <div class="inline-block pl-1 lg:pl-2" onclick={() => hideFeed()}>
      <a href="/contacts" class="app-link">Contacts</a>
    </div>
    {#if connectedAddress.value
      && typeof connectedAddress.value === 'string'
      && enableAppConfigChanges
      && enableAppConfigChangesByAdmin
      && enableAdmin
      && isInList(connectedAddress.value, admins)}
      <div class="inline-block pl-1 lg:pl-2" onclick={() => hideFeed()}>
        <a href="/admin" class="app-link">Admin</a>
      </div>
    {/if}
    {#if dev}
      <div class="inline-block pl-1 lg:pl-2" onclick={() => hideFeed()}>
        <a href="/search" class="app-link">Search</a>
      </div>
    {/if}
    <div class="ml-2 mr-1 inline-block text-center float-right" onclick={() => showWeb3Modal()}>
      {#if connectedAddress.value}
        <span class="text-sm lg:text-lg inline-block min-w-[100px] lg:min-w-[120px] border-2 rounded-lg border-bgSecondary-light dark:border-bgSecondary-dark cursor-pointer text-colorGreen-light dark:text-colorGreen-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark">
          <span class="inline-block">
            <ExtraBlockies seed={connectedAddress.value} scale={2} />
          </span>
          {sliceAddress(connectedAddress.value, 4, 3)}
        </span>
      {/if}
      {#if !connectedAddress.value}
        <span class="inline-block min-w-[100px] lg:min-w-[120px] border-2 rounded-lg border-colorRed-light dark:border-colorRed-dark cursor-pointer text-colorRed-light dark:text-colorRed-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark">
          {#if pendingAuthentication.value}<span class="animate-pulse">Pending...</span>{/if}
          {#if !pendingAuthentication.value}<span>Connect</span>{/if}
        </span>
      {/if}
    </div>
  </div>
</div>
