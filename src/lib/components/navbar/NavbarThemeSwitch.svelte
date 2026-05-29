<script lang="ts">
  import { toggleMode } from 'mode-watcher';
  import IconsSun from '$lib/components/icons/IconsSun.svelte';
  import IconsMoon from '$lib/components/icons/IconsMoon.svelte';
</script>

<span class="cursor-pointer" onclick={toggleMode}>
  <IconsSun class="m-1 w-6 inline-block dark:hidden" />
  <IconsMoon class="m-1 w-6 hidden dark:inline-block" />
</span>
