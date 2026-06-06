<script module lang="ts">
  // Per-render counter so each toggle gets a unique checkbox id. This
  // lets both the text label and the switch be clickable while keeping
  // the same render order on server and client (hydration-safe).
  let counter = 0;
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    checked = $bindable(false),
    label = '',
    hint = '',
    children
  }: {
    checked?: boolean;
    label?: string;
    hint?: string;
    children?: Snippet;
  } = $props();

  const id = `toggle-${counter++}`;
</script>

<div class="flex items-start justify-between gap-3 py-1.5">
  <span class="leading-snug">
    {#if label}<label for={id} class="cursor-pointer select-none">{label}</label>{/if}
    {#if hint}<span class="text-colorNotImportant-light dark:text-colorNotImportant-dark"> {hint}</span>{/if}
    {#if children}{@render children()}{/if}
  </span>

  <label for={id} class="relative mt-0.5 inline-flex shrink-0 cursor-pointer">
    <input {id} type="checkbox" bind:checked class="peer sr-only" />
    <span
      class="h-5 w-9 rounded-full bg-gray-300 dark:bg-gray-600 transition-colors
             peer-checked:bg-colorPrimary-light dark:peer-checked:bg-colorPrimary-dark
             peer-focus-visible:ring-2 peer-focus-visible:ring-colorPrimary-light dark:peer-focus-visible:ring-colorPrimary-dark"
    ></span>
    <span
      class="pointer-events-none absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm
             transition-transform peer-checked:translate-x-4"
    ></span>
  </label>
</div>
