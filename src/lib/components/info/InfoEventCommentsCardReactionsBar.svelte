<script lang="ts">
  import type { SpasmEventV2 } from '$lib/types/interfaces';
  import { spasm } from '$lib/spasm';
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';
  import InfoEventReactionsBarButton from './InfoEventReactionsBarButton.svelte';

  const appConfig = useAppConfigStore()?.getAppConfig;
  const enableNewWeb3ActionsAll = appConfig?.enableNewWeb3ActionsAll;
  const enableNewWeb3ActionsReact = appConfig?.enableNewWeb3ActionsReact;

  let { comment }: { comment?: SpasmEventV2 } = $props();

  const reactions = ['Upvote', 'Downvote'];
</script>

{#if enableNewWeb3ActionsAll && enableNewWeb3ActionsReact}
  <span class="inline-block">
    <InfoEventReactionsBarButton target={comment?.ids?.[0]?.value?.toString()} count={spasm.getTotalOfReaction(comment, 'upvote')} reaction={reactions[0]} text={false} iconUpvote={true} parentEvent={comment} />
    <InfoEventReactionsBarButton target={comment?.ids?.[0]?.value?.toString()} count={spasm.getTotalOfReaction(comment, 'downvote')} reaction={reactions[1]} text={false} iconDownvote={true} parentEvent={comment} />
  </span>
{/if}
