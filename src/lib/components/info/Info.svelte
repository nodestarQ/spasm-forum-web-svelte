<script lang="ts">
  import type { Snippet } from 'svelte';
  import { useFeed } from '$lib/utils/useFeed';
  import IconsArrowLeft from '$lib/components/icons/IconsArrowLeft.svelte';

  const { showFeed } = useFeed();

  let { children }: { children?: Snippet } = $props();
</script>

<div class="lg:p-2 lg:px-5 p-3 pb-16">
  <div class="max-w-[1000px]">
    <div
      class="pt-2 block cursor-pointer lg:hidden text-colorNotImportant-light dark:text-colorNotImportant-dark"
      onclick={() => showFeed()}
    >
      <IconsArrowLeft class="custom-icons" />Show feed
    </div>

    <!--
      Hydration mismatch can be solved by wrapping the content
      with a browser-only guard, but that's bad for SEO.
      Hydration mismatch doesn't occur with build/preview.
    -->
    {@render children?.()}
  </div>
</div>
