import { ref, readonly } from '$lib/ref.svelte'

// Module-level singleton: whether the feed column is shown on mobile.
const isFeedShown = ref(false)

export const useFeed = () => {
  const showFeed = () => {
    isFeedShown.value = true
  }

  const hideFeed = () => {
    setTimeout(() => {
      isFeedShown.value = false
    }, 250)
  }

  return {
    isFeedShown: readonly(isFeedShown),
    showFeed,
    hideFeed,
  }
}
