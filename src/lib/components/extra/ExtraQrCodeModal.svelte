<script lang="ts">
  import { useWeb3 } from '$lib/utils/useWeb3';
  import ExtraQrCode from './ExtraQrCode.svelte';
  import ExtraAddressIcons from './ExtraAddressIcons.svelte';
  import IconsClose from '@lucide/svelte/icons/x';
  import { fade, scale } from 'svelte/transition';

  const { qrCodeValue, hideQrCodeModal } = useWeb3();
</script>

<div
  class="fixed inset-0 flex items-center justify-center p-4 bg-black/60"
  onclick={() => hideQrCodeModal()}
  transition:fade={{ duration: 120 }}
>
  <div
    class="relative w-80 max-w-full max-h-[85vh] overflow-y-auto scrollbar-none p-6 text-center bg-bgSecondary-light dark:bg-bgSecondary-dark border border-borderColor-light dark:border-borderColor-dark rounded-xl shadow-xl"
    onclick={(e) => e.stopPropagation()}
    transition:scale={{ duration: 150, start: 0.96, opacity: 0 }}
  >
    <span
      class="absolute top-3 right-4 cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
      onclick={() => hideQrCodeModal()}
    >
      <IconsClose class="w-5 h-5" />
    </span>

    <div class="flex flex-col gap-3 mt-4">
      <div class="flex justify-center">
        {#if qrCodeValue.value}
          <ExtraQrCode value={qrCodeValue.value} />
        {/if}
      </div>

      <div class="modal-divider"></div>

      <div class="overflow-auto wrap-break-word text-start">
        {qrCodeValue.value}
        {#if qrCodeValue.value}
          <ExtraAddressIcons
            value={qrCodeValue.value}
            showCopyToClipboard={true}
            showExternalWebsite={true}
          />
        {/if}
      </div>
    </div>
  </div>
</div>
