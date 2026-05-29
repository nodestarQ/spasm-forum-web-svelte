<script lang="ts">
  import type { SpasmEventV2, SubmitEventV2Return } from '$lib/types/interfaces';
  import { useUtils } from '$lib/utils/useUtils';
  import InfoEventCommentsCard from './InfoEventCommentsCard.svelte';

  const { isValidSpasmEventV2, getUniqueByFirstId } = useUtils();

  let {
    event,
    replySubmitted
  }: {
    event?: SpasmEventV2;
    replySubmitted?: (
      targets?: (string | number)[] | null,
      response?: SubmitEventV2Return
    ) => void;
  } = $props();

  const handleReplySubmitted = (
    targets?: (string | number)[] | null
  ) => {
    replySubmitted?.(targets);
  };

  let showActionDetails = $state(false);
  let showActionDetailsText = $state('show');
  let isError = $state(false);

  const toggleShowActionDetails = () => {
    showActionDetails = !showActionDetails;
    showActionDetailsText = showActionDetailsText === 'show' ? 'hide' : 'show';
  };
</script>

{#if isValidSpasmEventV2(event)}
  {#if isError}
    <div>Failed to download the comments. Try again later.</div>
  {/if}
  {#if event?.children && Array.isArray(event.children)}
    {#if event?.children[0]}
      <div class="mb-32">
        <div
          class="cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
          onclick={() => toggleShowActionDetails()}
        >
          {showActionDetailsText} details
        </div>
        {#each getUniqueByFirstId(event.children) as child (child?.ids?.[0]?.value)}
          <InfoEventCommentsCard
            comment={child.event}
            showActionDetails={showActionDetails}
            showCommentsCount={false}
            replySubmitted={handleReplySubmitted}
          />
        {/each}
      </div>
    {/if}
  {/if}
{/if}
