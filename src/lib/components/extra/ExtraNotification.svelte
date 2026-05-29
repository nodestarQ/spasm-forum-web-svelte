<script lang="ts">
  import { useNotificationStore } from '$lib/stores/useNotificationStore';

  const { notification } = useNotificationStore();
</script>

{#if notification.value.show}
  <div
    class="fixed m-5 top-5 right-5 z-50 rounded-md px-4 py-2 shadow-lg text-sm text-white transition-all duration-700 ease-out fade-in-custom"
    class:bg-green-500={notification.value.type === 'success'}
    class:bg-red-500={notification.value.type === 'error'}
    class:bg-yellow-500={notification.value.type === 'warning'}
    class:bg-blue-500={notification.value.type === 'note'}
    class:fade-out-custom={notification.value.animationState === 'leaving'}
  >
    {notification.value.message}
  </div>
{/if}

<style>
  .fade-in-custom {
    animation: fadeIn 0.5s;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .fade-out-custom {
    animation: fadeOut 2s;
  }

  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
</style>
