<script lang="ts">
  // RSS block is only rendered client-side because on a server-
  // side we sometimes don't know API URL, unless it was
  // provided via the env variable. For example, a docker
  // deployment often doesn't include API URL in env variables.
  // But on a client-side we can get URL from window origin.
  import { browser } from '$app/environment';
  import type { SpasmEventV2 } from '$lib/types/interfaces';
  import { spasm } from '$lib/spasm';
  import { useUtils } from '$lib/utils/useUtils';
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';
  import IconsRss from '$lib/components/icons/IconsRss.svelte';
  import IconsTriangle from '$lib/components/icons/IconsTriangle.svelte';
  import IconsExternalWebsite from '$lib/components/icons/IconsExternalWebsite.svelte';
  import IconsCopyToClipboard from '$lib/components/icons/IconsCopyToClipboard.svelte';
  import IconsCheck from '$lib/components/icons/IconsCheck.svelte';

  const apiUrl = useAppConfigStore()?.getApiUrl;
  const { hasValue, copyToClipboard, isArrayWithValues } = useUtils();
  const appConfig = useAppConfigStore()?.getAppConfig;
  const enableRssFeedChannel = appConfig?.enableRssFeedChannel;

  let {
    event,
    activity: activityProp = 'all',
    signer,
    showSubscribeButton = true,
    showRssIcon = true,
    showActivityFilter = true,
    showCopyToClipboard = true,
    showSignerFilter = false,
    showCategoryFilter = false,
    enablePosts: enablePostsProp = true,
    enableComments: enableCommentsProp = false
  }: {
    event?: SpasmEventV2;
    activity?: string;
    signer?: string;
    showSubscribeButton?: boolean;
    showRssIcon?: boolean;
    showActivityFilter?: boolean;
    showCopyToClipboard?: boolean;
    showSignerFilter?: boolean;
    showCategoryFilter?: boolean;
    enablePosts?: boolean;
    enableComments?: boolean;
  } = $props();

  const activities = ['hot', 'rising', 'all'];

  let enablePosts = $state(enablePostsProp);
  let enableComments = $state(enableCommentsProp);
  let enableThisAuthor = $state(true);
  let enableThisCategory = $state(false);
  const baseUrl = apiUrl + '/api/events?format=rss';

  let copyToClipboardTitle = $state('Click to copy');
  let showCopyToClipboardSuccess = $state(false);

  let rssShown = $state(false);
  const toggleRss = () => {
    rssShown = !rssShown;
  };

  let activityDropDownShown = $state(false);
  const toggleActivityDropDown = () => {
    activityDropDownShown = !activityDropDownShown;
  };

  let activity = $state(activityProp || 'hot');

  const selectActivity = (newActivity: string): void => {
    activity = newActivity;
    toggleActivityDropDown();
  };

  const finalUrl = $derived.by(() => {
    let tempUrl = baseUrl;
    if (activity && typeof activity === 'string') {
      tempUrl += '&activity=' + activity;
    }
    if (enablePosts) {
      tempUrl += '&action=post';
    }
    if (enableComments) {
      tempUrl += '&action=reply';
    }
    if (enableThisAuthor) {
      if (signer && typeof signer === 'string') {
        tempUrl += '&signer=' + signer;
      } else {
        // For nostr addresses use npubs instead of hex
        // because signer's pubkey is added to channel title.
        const signers = spasm.getVerifiedSigners(event, 'npub');
        if (signers && isArrayWithValues(signers)) {
          signers.forEach((s) => {
            tempUrl += '&signer=' + s;
          });
        }
      }
    }
    if (enableThisCategory) {
      const categories = event?.categories;
      if (categories && isArrayWithValues(categories)) {
        categories.forEach((category) => {
          if (
            category && 'name' in category &&
            category.name && typeof category.name === 'string'
          ) {
            tempUrl += '&category=' + category.name;
          }
        });
      }
    }
    return tempUrl;
  });

  const copyToClipboardClicked = (value: string | number | undefined): void => {
    copyToClipboard(value);
    copyToClipboardTitle = 'Copied';
    showCopyToClipboardSuccess = true;
    setTimeout(() => {
      copyToClipboardTitle = 'Click to copy';
      showCopyToClipboardSuccess = false;
    }, 2000);
  };

  const toggleEnablePosts = () => {
    enablePosts = !enablePosts;
  };
  const toggleEnableComments = () => {
    enableComments = !enableComments;
  };
  const toggleEnableThisAuthor = () => {
    enableThisAuthor = !enableThisAuthor;
  };
  const toggleEnableThisCategory = () => {
    enableThisCategory = !enableThisCategory;
  };
</script>

{#if browser && enableRssFeedChannel}
  <div class="overflow-auto overflow-wrap break-words">
    <div class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">
      {#if showSubscribeButton}
        Subscribe:
      {/if}
      <span
        onclick={() => toggleRss()}
        class="cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
      >
        {#if showRssIcon}
          <IconsRss />
        {/if}
        <span class="font-bold">RSS</span>
        <IconsTriangle rotateIf={rssShown} />
      </span>
    </div>

    {#if rssShown}
      <div class="mb-8">
        <div class="mt-2 mb-2 text-colorNotImportant-light dark:text-colorNotImportant-dark">
          Customize your feed:
        </div>

        <!-- Activity -->
        {#if showActivityFilter}
          <!-- Dropdown toggle button -->
          <div
            onclick={() => toggleActivityDropDown()}
            class="text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer"
          >
            <IconsTriangle rotateIf={activityDropDownShown} />
            <span>
              <span class="ml-2 font-bold text-colorBase-light dark:text-colorBase-dark">
                {activity}
              </span>
            </span>
          </div>

          <!-- Dropdown menu -->
          <div
            class="ml-6 pl-1 py-1 bg-bgSecondary-light dark:bg-bgSecondary-dark rounded-md shadow-md w-20 {activityDropDownShown ? '' : 'hidden'}"
          >
            {#each activities as activityOption}
              <div
                class="py-1 font-bold text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer"
                onclick={() => selectActivity(activityOption)}
              >
                {activityOption}
              </div>
            {/each}
          </div>
        {/if}

        <!-- Posts -->
        <div class="mt-2 font-bold">
          <span>
            <input class="m-1 cursor-pointer" bind:checked={enablePosts} type="checkbox" />
          </span>
          <span onclick={() => toggleEnablePosts()} class="cursor-pointer">posts</span>
        </div>
        <div class="mt-2 font-bold">
          <span>
            <input class="m-1 cursor-pointer" bind:checked={enableComments} type="checkbox" />
          </span>
          <span onclick={() => toggleEnableComments()} class="cursor-pointer">comments</span>
        </div>
        {#if showSignerFilter && (hasValue(spasm.getVerifiedSigners(event)) || signer)}
          <div class="mt-2 font-bold">
            <input class="m-1 cursor-pointer" bind:checked={enableThisAuthor} type="checkbox" />
            <span onclick={() => toggleEnableThisAuthor()} class="cursor-pointer">
              by this author only
            </span>
          </div>
        {/if}
        {#if showCategoryFilter && hasValue(event?.categories)}
          <div class="mt-2 font-bold">
            <input class="m-1 cursor-pointer" bind:checked={enableThisCategory} type="checkbox" />
            <span onclick={() => toggleEnableThisCategory()} class="cursor-pointer">
              in this category only
            </span>
          </div>
        {/if}
        <div
          onclick={() => copyToClipboardClicked(finalUrl)}
          class="mt-4 mb-4 text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer"
        >
          <div class="font-bold">
            Click here to copy your final RSS feed link
            <button onclick={() => copyToClipboardClicked(finalUrl)} title={copyToClipboardTitle} class="ml-1">
              {#if showCopyToClipboard && !showCopyToClipboardSuccess}
                <IconsCopyToClipboard class="custom-icons-large lg:custom-icons pb-1" />
              {/if}
              {#if showCopyToClipboard && showCopyToClipboardSuccess}
                <IconsCheck class="custom-icons-large lg:custom-icons pb-1 text-colorGreen-light dark:text-colorGreen-dark" />
              {/if}
            </button>
          </div>
        </div>
        <div>
          <a href={finalUrl} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark">
            {finalUrl}
            <IconsExternalWebsite class="custom-icons-large lg:custom-icons pb-1" />
          </a>
        </div>

        <div class="mt-4 text-colorNotImportant-light dark:text-colorNotImportant-dark">
          <div>Best viewed on these RSS apps:</div>
          <div>
            Android:
            <a href="https://capyreader.com/" target="_blank">
              Capy Reader
              <IconsExternalWebsite class="custom-icons w-4 pb-1" />
            </a>
          </div>
          <div>
            Podcasts:
            <a href="https://antennapod.org/" target="_blank">
              AntennaPod
              <IconsExternalWebsite class="custom-icons w-4 pb-1" />
            </a>
          </div>
        </div>
      </div>
    {/if}
  </div>
{/if}
