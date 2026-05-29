<script lang="ts">
  import FeedEventsFiltersMenu from './FeedEventsFiltersMenu.svelte';

  let { class: className = '' }: { class?: string } = $props();
</script>

<div class="pl-1 bg-bgSecondary-light dark:bg-bgSecondary-dark {className}">
  <FeedEventsFiltersMenu />
</div>
