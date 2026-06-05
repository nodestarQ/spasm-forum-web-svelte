<script lang="ts">
  import type { SpasmEventV2 } from '$lib/types/interfaces';
  import { useEventsStore } from '$lib/stores/useEventsStore.svelte';
  import { useNotificationStore } from '$lib/stores/useNotificationStore';
  import { useWeb3 } from '$lib/utils/useWeb3';
  import IconsUpvote from '@lucide/svelte/icons/thumbs-up';
  import IconsDownvote from '@lucide/svelte/icons/thumbs-down';
  import IconsBullish from '@lucide/svelte/icons/trending-up';
  import IconsBearish from '@lucide/svelte/icons/trending-down';
  import IconsImportant from '@lucide/svelte/icons/circle-alert';
  import IconsScam from '@lucide/svelte/icons/triangle-alert';
  import IconsComments from '@lucide/svelte/icons/message-square';

  const eventsStore = useEventsStore();
  const notificationStore = useNotificationStore();
  const { submitSingleSignedEventV2 } = useWeb3();

  let {
    target,
    reaction,
    count,
    text,
    iconUpvote,
    iconDownvote,
    iconBullish,
    iconBearish,
    iconImportant,
    iconScam,
    iconComments,
    parentEvent
  }: {
    target?: string | null;
    reaction?: string | null;
    count?: number | null;
    text?: boolean | null;
    iconUpvote?: boolean | null;
    iconDownvote?: boolean | null;
    iconBullish?: boolean | null;
    iconBearish?: boolean | null;
    iconImportant?: boolean | null;
    iconScam?: boolean | null;
    iconComments?: boolean | null;
    parentEvent?: SpasmEventV2;
  } = $props();

  let alreadySubmitted = $state(false);

  const buttonClicked = async () => {
    if (!reaction || !target) return;
    const result = await submitSingleSignedEventV2('react', reaction, target, '', null, parentEvent);
    if (result) {
      const { res } = result;
      if (res === 'Success. Action has been saved and incremented') {
        // Re-fetch the displayed post to show the updated reaction count.
        await eventsStore.updateCurrentPost();
        alreadySubmitted = true;
      } else if (res === "Sorry, but you've already submitted the same action") {
        alreadySubmitted = true;
        notificationStore.showNotification(
          "You've already submitted this reaction to this post",
          'error',
          6000
        );
      } else if (res && typeof res === 'string' && res.toLowerCase().startsWith('error')) {
        notificationStore.showNotification(res, 'error', 6000);
      }
    }
  };
</script>

<span>
  <button
    onclick={() => buttonClicked()}
    class="px-2 lg:px-3 py-1 min-w-[52px] lg:min-w-[58px] mr-1 bg-bgSecondary-light dark:bg-bgSecondary-dark hover:text-colorPrimary-light hover:dark:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
  >
    <span>
      {#if iconUpvote}<IconsUpvote class="custom-icons {alreadySubmitted ? 'text-colorNotImportant-light dark:text-colorNotImportant-dark' : ''}" />{/if}
      {#if iconDownvote}<IconsDownvote class="custom-icons {alreadySubmitted ? 'text-colorNotImportant-light dark:text-colorNotImportant-dark' : ''}" />{/if}
      {#if iconBullish}<IconsBullish class="custom-icons {alreadySubmitted ? 'text-colorGreen-light dark:text-colorGreen-dark' : ''}" />{/if}
      {#if iconBearish}<IconsBearish class="custom-icons {alreadySubmitted ? 'text-colorRed-light dark:text-colorRed-dark' : ''}" />{/if}
      {#if iconImportant}<IconsImportant class="custom-icons {alreadySubmitted ? 'text-colorOrange-light dark:text-colorOrange-dark' : ''}" />{/if}
      {#if iconScam}<IconsScam class="custom-icons {alreadySubmitted ? 'text-colorRed-light dark:text-colorRed-dark' : ''}" />{/if}
      {#if iconComments}<IconsComments class="custom-icons" />{/if}
    </span>
    {#if text}
      <span>{reaction}{#if count}:{/if}</span>
    {/if}
    {#if count}<span class="ml-1">{count}</span>{/if}
  </button>
</span>
