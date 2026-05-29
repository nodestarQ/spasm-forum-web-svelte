<script lang="ts">
  // Replaces the Vue-only `qrcode.vue` component with the
  // framework-agnostic `qrcode` library rendering to a canvas.
  import QRCode from 'qrcode';

  let {
    value,
    level = 'L',
    size = 200
  }: {
    value?: string | number;
    // Level is used for error correction, low to high: L/M/Q/H
    level?: 'L' | 'M' | 'Q' | 'H';
    size?: number;
    ifShowDownloadButton?: boolean;
  } = $props();

  let canvasEl: HTMLCanvasElement | null = $state(null);

  $effect(() => {
    if (canvasEl && value) {
      QRCode.toCanvas(canvasEl, String(value), {
        errorCorrectionLevel: level,
        width: size
      }).catch((err) => console.error(err));
    }
  });

  const downloadQrCode = () => {
    if (!canvasEl) return;
    const dataUrl = canvasEl.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'qrcode.png';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
</script>

<div>
  <div class="mt-8 grid justify-center">
    {#if value}
      <canvas bind:this={canvasEl}></canvas>
    {/if}
  </div>
  <button
    onclick={() => downloadQrCode()}
    class="mt-2 cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
  >
    Download QR code
  </button>
</div>
