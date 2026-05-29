<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { useEventsStore } from '$lib/stores/useEventsStore.svelte';
  import { useFeedEventsFilters } from '$lib/utils/useFeedEventsFilters.svelte';
  import { useUtils } from '$lib/utils/useUtils';
  import FeedEventsCard from './FeedEventsCard.svelte';
  import ExtraLoadMoreButton from '$lib/components/extra/ExtraLoadMoreButton.svelte';
  import ExtraSpinner from '$lib/components/extra/ExtraSpinner.svelte';

  let { class: className = '' }: { class?: string } = $props();

  const { areValidSpasmEventsV2, getUniqueByFirstId } = useUtils();
  const eventsStore = useEventsStore();
  const { feedFilters } = useFeedEventsFilters();

  let showSpinner = $state(false);

  const scrollToTop = () => {
    const element = document.querySelector('#feed-top-anchor');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  let prevCategory = feedFilters.category;
  let prevActivity = feedFilters.activity;

  // Fetch on first run and whenever the feed filters change (replaces
  // the Vue onMounted + watch). $effect runs client-side only.
  $effect(() => {
    const limit = feedFilters.limit;
    const category = feedFilters.category;
    const activity = feedFilters.activity;
    void limit;
    showSpinner = true;
    eventsStore.fetchPostsByFilters().finally(() => {
      showSpinner = false;
    });
    // Scroll to top only when category/activity changed (not on the
    // initial run or a 'load more' limit bump).
    if (category !== prevCategory || activity !== prevActivity) {
      scrollToTop();
    }
    prevCategory = category;
    prevActivity = activity;
  });

  onMount(() => {
    // Refresh the feed periodically.
    const interval = setInterval(() => eventsStore.fetchPostsByFilters(), 120000);
    return () => clearInterval(interval);
  });
</script>

<div class={className}>
  {#if browser}
    {#if showSpinner}<ExtraSpinner />{/if}
    <span id="feed-top-anchor"></span>

    {#if eventsStore.getPinnedPosts && eventsStore.getPinnedPosts[0] && areValidSpasmEventsV2(eventsStore.getPinnedPosts)}
      {#each getUniqueByFirstId(eventsStore.getPinnedPosts) as post (post?.ids?.[0]?.value)}
        <FeedEventsCard {post} showPinnedIcon={true} showTimeAgo={false} />
      {/each}
    {/if}

    {#if eventsStore.getPosts && eventsStore.getPosts[0] && areValidSpasmEventsV2(eventsStore.getPosts)}
      {#each getUniqueByFirstId(eventsStore.getPosts) as post (post?.ids?.[0]?.value)}
        <FeedEventsCard {post} />
      {/each}
    {/if}

    {#if !eventsStore.getPosts || !eventsStore.getPosts[0]}
      <span class="animate-pulse text-colorNotImportant-light dark:text-colorNotImportant-dark">
        Loading...
      </span>
      <ExtraSpinner />
    {/if}

    <ExtraLoadMoreButton whatToLoad="feed-posts" class="mb-16 ml-1" />
  {/if}
</div>
