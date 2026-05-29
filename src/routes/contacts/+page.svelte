<script lang="ts">
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';
  import DefaultContacts from '$lib/components/default/DefaultContacts.svelte';
  import CustomContacts from '$lib/components/custom/CustomContacts.svelte';
  import IconsRocket from '$lib/components/icons/IconsRocket.svelte';

  const appConfig = useAppConfigStore()?.getAppConfig;
  const ifShowDevelopersInfo = appConfig?.ifShowDevelopersInfo;
  const enableDefaultContacts = appConfig?.enableDefaultContacts;
  const enableCustomContacts = appConfig?.enableCustomContacts;
</script>

<div class="p-3 mb-12">
  <p class="text-2xl mb-5">Contacts</p>
  {#if enableDefaultContacts}
    <DefaultContacts />
  {/if}
  {#if enableCustomContacts}
    <CustomContacts />
  {/if}

  {#if ifShowDevelopersInfo}
    <p class="mt-5 text-colorNotImportant-light dark:text-colorNotImportant-dark">For developers:</p>
    <div>
      This forum is powered by
      <a href="https://spasm.network" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Spasm</a>
      <a href="https://github.com/spasm-network" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">(git)</a>
      <IconsRocket class="custom-icons" />
    </div>
  {/if}
</div>
