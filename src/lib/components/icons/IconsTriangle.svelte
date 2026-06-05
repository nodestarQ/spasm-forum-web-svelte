<script lang="ts">
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  let {
    rotateIf = false,
    class: className = ''
  }: { rotateIf?: boolean | null; class?: string } = $props();
</script>

<!-- Lucide chevron-down wrapped to keep the rotateIf API used by the
     collapsible toggles (admin panels, dropdowns, advanced options). -->
<ChevronDown class="inline w-5 h-5 {rotateIf ? 'rotate-180' : ''} {className}" />
