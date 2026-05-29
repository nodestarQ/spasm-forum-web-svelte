<script lang="ts">
  import type { SpasmEventV2 } from '$lib/types/interfaces';
  import { spasm } from '$lib/spasm';
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';
  import { useNotificationStore } from '$lib/stores/useNotificationStore';
  import { useNostr } from '$lib/utils/useNostr';
  import { useWeb3 } from '$lib/utils/useWeb3';

  const { isInList } = useNostr();
  const notificationStore = useNotificationStore();
  const appConfig = useAppConfigStore()?.getAppConfig;
  const enableModeration = appConfig?.enableModeration;
  const moderators = appConfig?.moderators;
  const { connectedAddress, submitSingleSignedEventV2 } = useWeb3();

  let moderationResponse = $state('');

  let { event }: { event?: SpasmEventV2 } = $props();

  const buttonClicked = async (text: string) => {
    const targets = spasm.getAllEventIds(event);
    if (!targets || !Array.isArray(targets)) return;
    const result = await submitSingleSignedEventV2('moderate', text, targets, '', null, event);
    if (result) {
      const { res } = result;
      if (res === 'Success. Action saved and target deleted') {
        moderationResponse =
          'The event has been deleted from the local database. Refresh the page to see the change.';
      } else if (!res) {
        moderationResponse = 'ERROR: Something went wrong.';
        notificationStore.showNotification('ERROR: Something went wrong.', 'error', 6000);
      } else if (res === true) {
        moderationResponse = 'Success.';
        notificationStore.showNotification('Success', 'success');
      } else if (res) {
        moderationResponse = res;
        notificationStore.showNotification(res, 'note', 6000);
      }
    }
  };
</script>

{#if enableModeration
  && connectedAddress.value
  && typeof connectedAddress.value === 'string'
  && isInList(connectedAddress.value, moderators)
  && String(event?.ids?.[0]?.value)}
  <div class="my-2">
    <div>Moderation:</div>
    <button
      onclick={() => buttonClicked('delete')}
      class="px-3 py-1 min-w-[58px] mr-1 bg-bgSecondary-light dark:bg-bgSecondary-dark hover:text-colorPrimary-light hover:dark:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
    >
      DELETE event from local db and prevent it from being added again
    </button>
    {#if moderationResponse}
      <div>Moderation response: {moderationResponse}</div>
    {/if}
  </div>
{/if}
