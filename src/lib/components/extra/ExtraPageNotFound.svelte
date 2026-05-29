<script lang="ts">
  import { goto } from '$app/navigation';
  import IconsArrowLeft from '$lib/components/icons/IconsArrowLeft.svelte';
  import IconsRocket from '$lib/components/icons/IconsRocket.svelte';

  let { error }: { error?: any } = $props();

  const handleClearError = () => goto('/');
</script>

<div
  class="text-lg w-screen h-screen mx-auto text-center bg-bgBase-light dark:bg-bgBase-dark text-colorBase-light dark:text-colorBase-dark"
>
  {#if error && error.statusCode}
    <p class="pt-7 text-7xl font-bold">{error.statusCode}</p>
  {/if}
  <p class="pt-7 text-md">starting the engine...</p>
  <p class="text-md">no fuel</p>
  <p class="text-md">error</p>
  <p class="text-md">error</p>
  <p class="text-md">error</p>
  {#if error && error.message}
    <p class="pt-7">{error.message}</p>
  {/if}
  <div
    class="px-2 py-4 mx-auto mt-6 mb-12 max-w-sm cursor-pointer border-2 rounded-lg border-colorPrimary-light dark:border-colorPrimary-dark text-colorPrimary-light dark:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
    onclick={handleClearError}
  >
    <IconsArrowLeft class="custom-icons" />
    Try another rocket
    <IconsRocket class="custom-icons" />
  </div>
</div>
