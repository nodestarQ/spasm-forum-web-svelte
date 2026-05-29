<script lang="ts">
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';

  const appConfig = useAppConfigStore()?.getAppConfig;

  const enableDefaultButtonPrimary = appConfig?.enableDefaultButtonPrimary;
  const defaultButtonPrimaryText = appConfig?.defaultButtonPrimaryText;
  const defaultButtonPrimaryLink = appConfig?.defaultButtonPrimaryLink;

  const enableDefaultButtonSecondary = appConfig?.enableDefaultButtonSecondary;
  const defaultButtonSecondaryText = appConfig?.defaultButtonSecondaryText;
  const defaultButtonSecondaryLink = appConfig?.defaultButtonSecondaryLink;
</script>

<div class="mt-1">
  <a href={defaultButtonPrimaryLink} target="_blank">
    {#if enableDefaultButtonPrimary}
      <button
        class="max-w-xs px-4 py-2 mr-2 mt-6 mb-8 border-2 rounded-lg border-colorPrimary-light dark:border-colorPrimary-dark text-colorPrimary-light dark:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
      >
        <span>{defaultButtonPrimaryText}</span>
      </button>
    {/if}
  </a>
  <a href={defaultButtonSecondaryLink} target="_blank">
    {#if enableDefaultButtonSecondary}
      <button
        class="max-w-xs px-4 py-2 mr-2 mt-6 mb-8 border-2 rounded-lg border-colorBase-light dark:border-colorBase-dark text-colorBase-light dark:text-colorBase-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
      >
        <span>{defaultButtonSecondaryText}</span>
      </button>
    {/if}
  </a>
</div>
