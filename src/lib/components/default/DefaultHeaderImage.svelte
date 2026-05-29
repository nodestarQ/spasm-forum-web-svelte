<script lang="ts">
  import { onMount } from 'svelte';
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';

  const appConfig = useAppConfigStore()?.getAppConfig;
  const defaultHeaderImageLink = appConfig?.defaultHeaderImageLink;

  // Define the possible image paths
  const possiblePaths = ['/header.jpeg'];

  let imageUrl: string | null = $state(null);

  // Check if a resource exists using a HEAD request.
  const checkResourceExists = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      // Check if the response is successful (status 200-299)
      return response.ok;
    } catch {
      // Catches network errors (CORS, DNS), not same-origin 404s.
      return false;
    }
  };

  const findExistingImage = async () => {
    try {
      if (defaultHeaderImageLink && typeof defaultHeaderImageLink === 'string') {
        imageUrl = defaultHeaderImageLink;
      } else {
        for (const path of possiblePaths) {
          const exists = await checkResourceExists(path);
          if (exists) {
            imageUrl = path;
            return;
          }
        }
      }
      // If no image is found, imageUrl remains null.
    } catch {
      return;
    }
  };

  onMount(() => {
    findExistingImage();
  });
</script>

{#if imageUrl}
  <div class="mb-4">
    <img src={imageUrl} alt="" />
  </div>
{/if}
