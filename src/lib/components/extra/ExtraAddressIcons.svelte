<script lang="ts">
  import { config } from '$lib/config';
  import { useUtils } from '$lib/utils/useUtils';
  import { useWeb3 } from '$lib/utils/useWeb3';
  import IconsCopyToClipboard from '$lib/components/icons/IconsCopyToClipboard.svelte';
  import IconsCheck from '$lib/components/icons/IconsCheck.svelte';
  import IconsQrCode from '$lib/components/icons/IconsQrCode.svelte';
  import IconsExternalWebsite from '$lib/components/icons/IconsExternalWebsite.svelte';

  const { copyToClipboard } = useUtils();
  const { showQrCodeModal, setQrCodeValue, showFollowModal, setFollowValue } = useWeb3();

  const explorerEthereumAddress = config?.defaultExplorerEthereumAddress || 'https://etherscan.io/address/';
  const explorerNostrAddress = config?.defaultExplorerNostrAddress || 'https://primal.net/p/';

  let { value, showFollow, showCopyToClipboard, showQrCode, showExternalWebsite }: {
    value?: string | number | undefined;
    showFollow?: boolean;
    showCopyToClipboard?: boolean;
    showQrCode?: boolean;
    showExternalWebsite?: boolean;
  } = $props();

  let copyToClipboardTitle = $state('Click to copy');
  let showCopyToClipboardSuccess = $state(false);
  let protocol = $state('');
  let externalWebsiteTitle = $state('Open on another website');
  let externalWebsiteUrl = $state('');

  if (value && typeof value === 'string') {
    if (value.startsWith('0x') && value.length === 42) {
      protocol = 'ethereum';
    } else if (
      (value.startsWith('npub') && value.length === 63) ||
      (value.startsWith('note') && value.length === 63)
    ) {
      protocol = 'nostr';
    }
  }

  if (protocol === 'ethereum') {
    externalWebsiteTitle = 'Open on external website';
    externalWebsiteUrl = explorerEthereumAddress + value;
  } else if (protocol === 'nostr') {
    externalWebsiteTitle = 'Open on external website';
    externalWebsiteUrl = explorerNostrAddress + value;
  }

  const copyToClipboardClicked = (val: string | number | undefined): void => {
    copyToClipboard(val);
    copyToClipboardTitle = 'Copied';
    showCopyToClipboardSuccess = true;
    setTimeout(() => {
      copyToClipboardTitle = 'Click to copy';
      showCopyToClipboardSuccess = false;
    }, 2000);
  };
  const qrCodeClicked = (): void => {
    showQrCodeModal();
    setQrCodeValue(value?.toString());
  };
  const followClicked = (): void => {
    showFollowModal();
    setFollowValue(value?.toString());
  };
</script>

<span>
  <button onclick={() => followClicked()} title="Show follow options" class="ml-1 text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark">
    {#if showFollow}Follow{/if}
  </button>

  <button onclick={() => copyToClipboardClicked(value)} title={copyToClipboardTitle} class="ml-1 text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark">
    {#if showCopyToClipboard && !showCopyToClipboardSuccess}
      <IconsCopyToClipboard class="custom-icons-large lg:custom-icons pb-1" />
    {/if}
    {#if showCopyToClipboard && showCopyToClipboardSuccess}
      <IconsCheck class="custom-icons-large lg:custom-icons pb-1 text-colorGreen-light dark:text-colorGreen-dark" />
    {/if}
  </button>

  <button onclick={() => qrCodeClicked()} title="Show QR code" class="ml-1 text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark">
    {#if showQrCode}
      <IconsQrCode class="custom-icons-large lg:custom-icons pb-1" />
    {/if}
  </button>

  <a href={externalWebsiteUrl} title={externalWebsiteTitle} target="_blank" class="ml-1 text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark">
    {#if showExternalWebsite && protocol}
      <IconsExternalWebsite class="custom-icons-large lg:custom-icons pb-1" />
    {/if}
  </a>
</span>
