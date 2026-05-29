<script lang="ts">
  import FeedFilters from './FeedFilters.svelte';
  import FeedEvents from './FeedEvents.svelte';

  let { class: className = '' }: { class?: string } = $props();
</script>

<div class={className}>
  <FeedFilters class="sticky top-0 w-full" />
  <FeedEvents class="mt-0 pl-0.5" />
</div>
