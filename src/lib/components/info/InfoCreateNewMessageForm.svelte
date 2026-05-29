<script lang="ts">
  // Placeholder. The full new-message / reply form (compose box,
  // web3 signing, multi-network submit) is ported in task 14.
  // The props mirror the final component so callers don't change.
  import type { SpasmEventV2 } from '$lib/types/interfaces';
  import type { SubmitEventV2Return } from '$lib/types/interfaces';

  let {
    formAction = 'reply',
    parentEvent,
    replySubmitted
  }: {
    formAction?: string;
    parentEvent?: SpasmEventV2;
    replySubmitted?: (
      targets?: (string | number)[] | null,
      response?: SubmitEventV2Return
    ) => void;
  } = $props();
</script>

<div class="my-2 p-2 text-base border-2 border-dashed border-bgSecondary-light dark:border-bgSecondary-dark text-colorNotImportant-light dark:text-colorNotImportant-dark">
  New message form ({formAction}) is coming soon.
</div>
