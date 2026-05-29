<script lang="ts">
  import { useEventsStore } from '$lib/stores/useEventsStore.svelte';
  import { useFeedEventsFilters } from '$lib/utils/useFeedEventsFilters.svelte';

  type WhatToLoad = 'feed-posts' | 'post-comments' | 'home-comments';

  let { whatToLoad = 'feed-posts', class: className = '' }:
    { whatToLoad?: WhatToLoad; class?: string } = $props();

  const eventsStore = useEventsStore();
  const { increaseFeedFiltersLimits } = useFeedEventsFilters();

  const loading = $derived(
    whatToLoad === 'feed-posts' ? eventsStore.state.fetchingPostsByFilters : false
  );

  const loadMore = () => {
    setTimeout(() => {
      if (whatToLoad === 'feed-posts') {
        increaseFeedFiltersLimits();
      }
      // TODO: post-comments / home-comments load-more limits
    }, 200);
  };

  // Hidden initially so it does not blink before posts load.
  let showLoadMoreButton = $state(false);
  setTimeout(() => {
    showLoadMoreButton = true;
  }, 3000);
</script>

<div class={className}>
  {#if showLoadMoreButton}
    <button
      class="w-32 px-2 py-1 mx-1 mt-6 mb-12 border-2 rounded-lg border-colorPrimary-light dark:border-colorPrimary-dark text-colorPrimary-light dark:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
      onclick={() => loadMore()}
    >
      {#if loading}
        <span class="animate-pulse">Loading... </span>
      {:else}
        <span>Load more</span>
      {/if}
    </button>
  {/if}
</div>
