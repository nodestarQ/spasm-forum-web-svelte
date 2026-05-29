<script lang="ts">
  import type { SpasmEventV2 } from '$lib/types/interfaces';
  import { spasm } from '$lib/spasm';
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';
  import InfoEventReactionsBarButton from './InfoEventReactionsBarButton.svelte';

  const appConfig = useAppConfigStore()?.getAppConfig;
  const enableNewWeb3ActionsAll = appConfig?.enableNewWeb3ActionsAll;
  const enableNewWeb3ActionsReact = appConfig?.enableNewWeb3ActionsReact;

  let { event }: { event?: SpasmEventV2 } = $props();

  const reactions = ['Bullish', 'Bearish', 'Important', 'Scam', 'Upvote', 'Downvote'];
</script>

{#if enableNewWeb3ActionsAll && enableNewWeb3ActionsReact && event}
  <div>
    <InfoEventReactionsBarButton target={event?.ids?.[0]?.value?.toString()} count={spasm.getTotalOfReaction(event, 'bullish')} reaction={reactions[0]} text={false} iconBullish={true} parentEvent={event} />
    <InfoEventReactionsBarButton target={event?.ids?.[0]?.value?.toString()} count={spasm.getTotalOfReaction(event, 'bearish')} reaction={reactions[1]} text={false} iconBearish={true} parentEvent={event} />
    <InfoEventReactionsBarButton target={event?.ids?.[0]?.value?.toString()} count={spasm.getTotalOfReaction(event, 'important')} reaction={reactions[2]} text={false} iconImportant={true} parentEvent={event} />
    <InfoEventReactionsBarButton target={event?.ids?.[0]?.value?.toString()} count={spasm.getTotalOfReaction(event, 'scam')} reaction={reactions[3]} text={false} iconScam={true} parentEvent={event} />
    <InfoEventReactionsBarButton target={event?.ids?.[0]?.value?.toString()} count={spasm.getTotalOfReaction(event, 'upvote')} reaction={reactions[4]} text={false} iconUpvote={true} parentEvent={event} />
    <InfoEventReactionsBarButton target={event?.ids?.[0]?.value?.toString()} count={spasm.getTotalOfReaction(event, 'downvote')} reaction={reactions[5]} text={false} iconDownvote={true} parentEvent={event} />
  </div>
{/if}
