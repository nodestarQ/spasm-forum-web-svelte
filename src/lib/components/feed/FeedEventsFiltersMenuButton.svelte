<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { FiltersActivity, FiltersCategory } from '$lib/types/interfaces';

  let {
    filterName,
    filterSelected,
    block,
    onFilterClicked,
    children,
    class: className = ''
  }: {
    filterName: FiltersActivity | FiltersCategory;
    filterSelected: string | boolean | undefined;
    block: boolean | undefined;
    onFilterClicked?: (newFilter: FiltersActivity | FiltersCategory) => void;
    children?: Snippet;
    class?: string;
  } = $props();
</script>

<div
  class="p-1 text-lg cursor-pointer {className} {!block ? 'inline-block' : ''} {filterSelected === filterName ? 'text-colorPrimary-light dark:text-colorPrimary-dark' : ''}"
  onclick={() => onFilterClicked?.(filterName)}
>
  {@render children?.()}
</div>
