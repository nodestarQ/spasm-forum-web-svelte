<script lang="ts">
  import { useWeb3 } from '$lib/utils/useWeb3';
  import ExtraQrCode from './ExtraQrCode.svelte';
  import ExtraAddressIcons from './ExtraAddressIcons.svelte';

  const { qrCodeValue, hideQrCodeModal } = useWeb3();
</script>

<div
  class="fixed top-0 bottom-0 left-0 right-0 grid justify-center bg-black/60 scrollbar-none"
  onclick={() => hideQrCodeModal()}
>
  <div
    class="mt-6 lg:mt-5 max-h-112 overflow-scroll bg-bgSecondary-light dark:bg-bgSecondary-dark block w-80 text-center relative scrollbar-none"
    onclick={(e) => e.stopPropagation()}
  >
    <span
      class="pr-3 pt-2 pl-1 pb-1 absolute right-0 top-0 cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
      onclick={() => hideQrCodeModal()}
    >
      X
    </span>
    <div>
      {#if qrCodeValue.value}
        <ExtraQrCode value={qrCodeValue.value} />
      {/if}
    </div>
    <div class="mt-2 mb-6 mx-9 overflow-auto overflow-wrap wrap-break-word text-start">
      {qrCodeValue.value}
      {#if qrCodeValue.value}
        <ExtraAddressIcons
          value={qrCodeValue.value}
          showCopyToClipboard={true}
          showExternalWebsite={true}
        />
      {/if}
    </div>

    <button
      class="w-48 h-10 my-3 border rounded-lg border-colorBase-light dark:border-colorBase-dark hover:text-colorPrimary-light dark:hover:colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark hover:border-colorPrimary-light dark:hover:border-colorPrimary-dark"
      onclick={() => hideQrCodeModal()}
    >
      Close
    </button>
  </div>
</div>
