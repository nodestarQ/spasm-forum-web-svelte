<script lang="ts">
  import type { SpasmEventAddressV2 } from '$lib/types/interfaces';
  import { useProfilesStore } from '$lib/stores/useProfilesStore.svelte';
  import { useWeb3 } from '$lib/utils/useWeb3';
  import ExtraBlockies from '$lib/components/extra/ExtraBlockies.svelte';
  import ExtraAddressIcons from '$lib/components/extra/ExtraAddressIcons.svelte';

  const profilesStore = useProfilesStore();
  const { extractValueFromAddressForDisplay } = useWeb3();

  let { address }: { address?: SpasmEventAddressV2; key?: string | number } = $props();
</script>

{#if address && address.verified && address.value}
  <div class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">
    <span>Author: </span>
    <ExtraBlockies
      seed={extractValueFromAddressForDisplay(address, true)}
      scale={2}
      class="inline-block mr-1"
    />
    <a
      href={`/authors/${address.value?.toString()}`}
      class="text-colorPrimary-light dark:text-colorPrimary-dark hover:underline"
    >
      {#if profilesStore.getMetadataByAddressNostr(extractValueFromAddressForDisplay(address, true), 'username') && profilesStore.getMetadataByAddressNostr(extractValueFromAddressForDisplay(address, true), 'username') !== 'none'}
        <span class="ml-1">
          <span class="">{profilesStore.getMetadataByAddressNostr(extractValueFromAddressForDisplay(address, true), 'username')?.slice(0, 40)}</span>
          <span class="text-sm">(Nostr)</span>
        </span>
      {:else}
        <span class="">{extractValueFromAddressForDisplay(address)}</span>
      {/if}
    </a>

    {#if extractValueFromAddressForDisplay(address, true)}
      <ExtraAddressIcons
        value={extractValueFromAddressForDisplay(address, true)}
        showFollow={true}
        showCopyToClipboard={true}
        showQrCode={true}
        showExternalWebsite={true}
      />
    {/if}
  </div>
{/if}
