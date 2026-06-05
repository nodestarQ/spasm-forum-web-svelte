<script lang="ts">
  import { onMount } from 'svelte';
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';
  import { useWeb3 } from '$lib/utils/useWeb3';
  import { useUtils } from '$lib/utils/useUtils';
  import InfoCreateNewMessageForm from '$lib/components/info/InfoCreateNewMessageForm.svelte';
  import ExtraAddressIcons from '$lib/components/extra/ExtraAddressIcons.svelte';

  const appConfigStore = useAppConfigStore();
  const { connectedAddress } = useWeb3();
  const { sliceAddress } = useUtils();

  // Read config reactively so a user who gets whitelisted while
  // on this page can post without reloading (the page refreshes
  // the config on mount).
  const enableNewWeb3ActionsAll = $derived(
    appConfigStore.getAppConfig?.enableNewWeb3ActionsAll
  );
  const enableNewWeb3ActionsPost = $derived(
    appConfigStore.getAppConfig?.enableNewWeb3ActionsPost
  );
  const enableWhitelistForActionPost = $derived(
    appConfigStore.getAppConfig?.enableWhitelistForActionPost
  );
  const whitelistedForActionPost = $derived(
    appConfigStore.getAppConfig?.whitelistedForActionPost
  );

  onMount(() => {
    appConfigStore.fetchAndUpdateAppConfig();
  });
</script>

<div class="my-4 mx-2 overflow-auto overflow-wrap wrap-break-word">
  {#if enableNewWeb3ActionsAll && enableNewWeb3ActionsPost}
    {#if connectedAddress.value && typeof connectedAddress.value === 'string'}
      <div class="mt-2 mb-4">
        <div>
          Connected main address: {sliceAddress(connectedAddress.value, 8, 6)}
          <ExtraAddressIcons
            value={connectedAddress.value}
            showCopyToClipboard={true}
            showQrCode={true}
            showExternalWebsite={true}
          />
        </div>
      </div>
    {/if}

    <!-- White list is disabled, everybody can create posts -->
    {#if !enableWhitelistForActionPost}
      <InfoCreateNewMessageForm formAction={'post'} />
    {/if}

    <!-- White list is enabled -->
    {#if enableWhitelistForActionPost}
      <p>
        This instance requires addresses to be whitelisted in order to create new
        posts.
      </p>

      <!-- No address is connected -->
      {#if !connectedAddress.value}
        <div>
          Connect your address using the 'connect' button to see whether you've
          been whitelisted to create new posts on this instance.
        </div>
      {/if}

      <!-- Connected address is whitelisted -->
      {#if connectedAddress.value && typeof connectedAddress.value === 'string' && whitelistedForActionPost?.includes(connectedAddress.value.toLowerCase())}
        <div class="mb-4">Your address is whitelisted to create new posts.</div>
        <InfoCreateNewMessageForm formAction={'post'} />
      {/if}

      <!-- Connected address is not whitelisted -->
      {#if connectedAddress.value && typeof connectedAddress.value === 'string' && !whitelistedForActionPost?.includes(connectedAddress.value.toLowerCase())}
        <div>
          Your address is not whitelisted to create new posts on this instance.
        </div>
      {/if}
    {/if}
  {:else}
    <!-- New post actions are disabled -->
    Submitting all new web3 posts is currently disabled
  {/if}
</div>
