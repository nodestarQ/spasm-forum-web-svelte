<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { page } from '$app/stores';
  import type { SpasmEventV2 } from '$lib/types/interfaces';
  import { spasm } from '$lib/spasm';
  import { useProfilesStore } from '$lib/stores/useProfilesStore.svelte';
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';
  import { useWeb3 } from '$lib/utils/useWeb3';
  import { useNostr } from '$lib/utils/useNostr';
  import { useTime } from '$lib/utils/useTime';
  import { useFeed } from '$lib/utils/useFeed';
  import ExtraBlockies from '$lib/components/extra/ExtraBlockies.svelte';
  import IconsBullish from '@lucide/svelte/icons/trending-up';
  import IconsBearish from '@lucide/svelte/icons/trending-down';
  import IconsImportant from '@lucide/svelte/icons/circle-alert';
  import IconsScam from '@lucide/svelte/icons/triangle-alert';
  import IconsUpvote from '@lucide/svelte/icons/thumbs-up';
  import IconsDownvote from '@lucide/svelte/icons/thumbs-down';
  import IconsComments from '@lucide/svelte/icons/message-square';

  let {
    post,
    showTimeAgo = true,
    showPinnedIcon = false
  }: {
    post: SpasmEventV2;
    showTimeAgo?: boolean;
    showPinnedIcon?: boolean;
  } = $props();

  const profilesStore = useProfilesStore();
  const appConfig = useAppConfigStore()?.getAppConfig;
  const shortUrlsLengthOfWeb3Ids = appConfig?.shortUrlsLengthOfWeb3Ids;
  const { extractIdForDisplay, extractOneAuthorAddressForDisplay, extractSourceNameForDisplay } =
    useWeb3();
  const { standardizeId } = useNostr();
  const { hideFeed } = useFeed();

  const addressForDisplay = extractOneAuthorAddressForDisplay(post);
  const addressValue = extractOneAuthorAddressForDisplay(post, true);

  const checkIfSelected = (
    id: (string | number) | (string | number)[] | undefined
  ): boolean => {
    if (Array.isArray(id)) return false;
    if (id && typeof id === 'string') {
      return Boolean(spasm.checkIfEventHasThisId(post, standardizeId(id), shortUrlsLengthOfWeb3Ids));
    }
    return false;
  };

  // Highlight the card if its post is the one open in the info panel.
  const isSelectedPost = $derived.by(() => {
    const routeId = $page.params.id;
    const queryP = $page.url.searchParams.get('p');
    if (routeId) return checkIfSelected(routeId);
    if (queryP) return checkIfSelected(queryP);
    return false;
  });

  let timeAgoEvent = $state(useTime().timeAgoEvent(post));
  onMount(() => {
    const interval = setInterval(() => {
      timeAgoEvent = useTime().timeAgoEvent(post);
    }, 60000);
    return () => clearInterval(interval);
  });

  const postClicked = () => {
    hideFeed();
  };

  // Queue the author address so its profile gets fetched later.
  if (browser && post.authors?.[0]?.addresses?.[0]?.value) {
    profilesStore.addAddress(post.authors[0].addresses[0].value.toString());
  }
</script>

<div
  class="p-1 py-2 px-2 border-b border-borderColor-light dark:border-borderColor-dark {isSelectedPost ? 'bg-bgHover-light dark:bg-bgHover-dark' : ''}"
>
  <div class="">
    {#if showPinnedIcon}
      <span class="mr-1 text-colorNotImportant-light dark:text-colorNotImportant-dark">*</span>
    {/if}
    {#if showTimeAgo && post.db?.addedTimestamp}
      <span class="mr-1 text-colorNotImportant-light dark:text-colorNotImportant-dark">{timeAgoEvent}</span>
    {/if}
    {#if spasm.getVerifiedSigners(post, 'npub')?.includes(addressValue)}
      <a
        href={`/news/${extractIdForDisplay(post)}`}
        onclick={() => hideFeed()}
        class="app-link text-colorNotImportant-light dark:text-colorNotImportant-dark"
      >
        <span class="inline-block"><ExtraBlockies seed={addressValue} scale={2} /></span>
        {#if profilesStore.getMetadataByAddressNostr(addressValue, 'username') && profilesStore.getMetadataByAddressNostr(addressValue, 'username') !== 'none'}
          <span class="ml-1">
            <span class="">{profilesStore.getMetadataByAddressNostr(addressValue, 'username')?.slice(0, 40)}</span>
            <span class="text-sm">(Nostr)</span>
          </span>
        {:else}
          <span class="ml-1"><span>{addressForDisplay}</span></span>
        {/if}
      </a>
    {:else if extractSourceNameForDisplay(post)}
      <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
        {extractSourceNameForDisplay(post)}
      </span>
    {/if}
  </div>
  <div class="clr"></div>

  {#if extractIdForDisplay(post)}
    <a href={`/news/${extractIdForDisplay(post)}`} class="app-link">
      {#if post.title}
        <span onclick={() => postClicked()}>{post.title.slice(0, 100)}</span>
      {/if}
      {#if !post.title && post.content}
        <span onclick={() => postClicked()}>{post.content.slice(0, 100)}</span>
      {/if}
    </a>
  {/if}

  <div>
    {#if spasm.getTotalOfReaction(post, 'bullish')}
      <span class="mr-2 text-colorGreen-light dark:text-colorGreen-dark"><IconsBullish class="custom-icons" /> {spasm.getTotalOfReaction(post, 'bullish')}</span>
    {/if}
    {#if spasm.getTotalOfReaction(post, 'bearish')}
      <span class="mr-2 text-colorRed-light dark:text-colorRed-dark"><IconsBearish class="custom-icons" /> {spasm.getTotalOfReaction(post, 'bearish')}</span>
    {/if}
    {#if spasm.getTotalOfReaction(post, 'important')}
      <span class="mr-2 text-colorOrange-light dark:text-colorOrange-dark"><IconsImportant class="custom-icons" /> {spasm.getTotalOfReaction(post, 'important')}</span>
    {/if}
    {#if spasm.getTotalOfReaction(post, 'scam')}
      <span class="mr-2 text-colorRed-light dark:text-colorRed-dark"><IconsScam class="custom-icons" /> {spasm.getTotalOfReaction(post, 'scam')}</span>
    {/if}
    {#if spasm.getTotalOfReaction(post, 'upvote')}
      <span class="mr-2 text-colorNotImportant-light dark:text-colorNotImportant-dark"><IconsUpvote class="custom-icons" /> {spasm.getTotalOfReaction(post, 'upvote')}</span>
    {/if}
    {#if spasm.getTotalOfReaction(post, 'downvote')}
      <span class="mr-2 text-colorNotImportant-light dark:text-colorNotImportant-dark"><IconsDownvote class="custom-icons" /> {spasm.getTotalOfReaction(post, 'downvote')}</span>
    {/if}
    {#if spasm.getTotalOfReply(post)}
      <span class="mr-2 text-colorBlue-light dark:text-colorBlue-dark"><IconsComments class="custom-icons" /> {spasm.getTotalOfReply(post)}</span>
    {/if}
  </div>
</div>
