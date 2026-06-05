<script lang="ts">
  import { toggleMode } from 'mode-watcher';
  import IconsSun from '@lucide/svelte/icons/sun';
  import IconsMoon from '@lucide/svelte/icons/moon';
</script>

<span class="cursor-pointer" onclick={toggleMode}>
  <IconsSun class="m-1 w-6 inline-block dark:hidden" />
  <IconsMoon class="m-1 w-6 hidden dark:inline-block" />
</span>
