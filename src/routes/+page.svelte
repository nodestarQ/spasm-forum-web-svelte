<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import type { SpasmEventV2 } from '$lib/types/interfaces';
  import { spasm } from '$lib/spasm';
  import { config } from '$lib/config';
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';
  import { useProfilesStore } from '$lib/stores/useProfilesStore.svelte';
  import { useFeed } from '$lib/utils/useFeed';
  import { useUtils } from '$lib/utils/useUtils';
  import { useMocks } from '$lib/utils/useMocks';
  import { useFetch } from '$lib/utils/useFetch';
  import DefaultHeaderImage from '$lib/components/default/DefaultHeaderImage.svelte';
  import DefaultIntro from '$lib/components/default/DefaultIntro.svelte';
  import DefaultContacts from '$lib/components/default/DefaultContacts.svelte';
  import DefaultHomeButtons from '$lib/components/default/DefaultHomeButtons.svelte';
  import CustomIntro from '$lib/components/custom/CustomIntro.svelte';
  import CustomContacts from '$lib/components/custom/CustomContacts.svelte';
  import ExtraRssBlock from '$lib/components/extra/ExtraRssBlock.svelte';
  import InfoEventCommentsCard from '$lib/components/info/InfoEventCommentsCard.svelte';
  import IconsRocket from '@lucide/svelte/icons/rocket';

  const profilesStore = useProfilesStore();
  const appConfig = useAppConfigStore()?.getAppConfig;
  const apiURL = useAppConfigStore()?.getApiUrl;

  const { showFeed } = useFeed();
  const { areValidSpasmEventsV2, getUniqueByFirstId } = useUtils();
  const { getMockSpasmEventComments } = useMocks();
  const useMockedDataIfBackendIsDown =
    config?.useMockedDataIfBackendIsDown === 'true';

  // Default-intro
  const enableDefaultHeaderImage = appConfig?.enableDefaultHeaderImage;
  const enableDefaultIntro = appConfig?.enableDefaultIntro;
  const enableDefaultContacts = appConfig?.enableDefaultContacts;
  const enableDefaultButtonPrimary = appConfig?.enableDefaultButtonPrimary;
  const enableDefaultButtonSecondary = appConfig?.enableDefaultButtonSecondary;
  // Custom-intro
  const enableCustomIntro = appConfig?.enableCustomIntro;
  const enableCustomContacts = appConfig?.enableCustomContacts;

  const ifShowContactsInIntro = appConfig?.ifShowContactsInIntro;
  const ifShowIntroTutorial = appConfig?.ifShowIntroTutorial;
  const ifShowHomeLatestComments = appConfig?.ifShowHomeLatestComments;

  let showActionDetails = $state(false);
  let showActionDetailsText = $state('show');
  let comments: SpasmEventV2[] = $state([]);
  let isError = $state(false);

  onMount(async () => {
    // Comments are fetched on mount because event sanitization
    // with DOMPurify inside convertManyToSpasm() only works in a
    // browser environment (client-side).
    const path = `${apiURL}/api/events?webType=false&action=reply&category=any&source=false&activity=all&keyword=false&limit=15`;

    const { data, error } = await useFetch(path);

    if (error.value) {
      // Don't show an error if testing locally without backend API.
      if (!useMockedDataIfBackendIsDown) {
        isError = true;
      }
      console.error(error.value);
    }

    if (data?.value) {
      const spasmEvents = spasm.convertManyToSpasm(data.value);
      if (spasmEvents && areValidSpasmEventsV2(spasmEvents)) {
        comments = spasmEvents;
      }
      // Use mock posts for testing locally without backend.
    } else if (useMockedDataIfBackendIsDown) {
      comments = getMockSpasmEventComments();
    }

    // Queue author addresses so profiles (e.g. usernames) get
    // fetched during an update function.
    if (comments && typeof comments === 'object') {
      profilesStore.addAddressesFromSpasmEvents(comments);
      setTimeout(() => {
        profilesStore.updateAllProfiles();
      }, 2000);
    }
  });

  const toggleShowActionDetails = (): void => {
    showActionDetails = !showActionDetails;
    showActionDetailsText = showActionDetailsText === 'show' ? 'hide' : 'show';
  };
</script>

<div class="p-5 mb-10">
  {#if enableDefaultHeaderImage}
    <DefaultHeaderImage />
  {/if}

  {#if enableDefaultIntro}
    <DefaultIntro />
  {/if}

  {#if ifShowContactsInIntro}
    {#if enableDefaultContacts}
      <DefaultContacts />
    {/if}
  {/if}

  {#if enableDefaultButtonPrimary || enableDefaultButtonSecondary}
    <DefaultHomeButtons />
  {/if}

  {#if enableCustomIntro}
    <CustomIntro />
  {/if}

  {#if ifShowContactsInIntro}
    {#if enableCustomContacts}
      <CustomContacts />
    {/if}
  {/if}

  {#if ifShowIntroTutorial}
    <div class="mt-4">
      <p>- Connect a browser extension (MetaMask, Rabby, nos2x, Flamingo) or log in as a guest.</p>
      <p>- Sign all comments and reactions with your Ethereum or Nostr private keys.</p>
      <p>- Never sign any messages that you don't understand.</p>
      <div>
        - This forum is part of the
        <a href="https://spasm.network" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">
          Spasm
          <IconsRocket class="custom-icons" />
        </a>
        network.
      </div>
    </div>
  {/if}

  <button
    class="block lg:hidden mt-4 mb-4 border-2 py-2 px-3 text-colorPrimary-light dark:text-colorPrimary-dark rounded-md border-colorPrimary-light dark:border-colorPrimary-dark"
    onclick={() => showFeed()}
  >
    SHOW FEED
  </button>

  <ExtraRssBlock
    class="mt-4 ml-2"
    enablePosts={true}
    enableComments={true}
    activity={'rising'}
    showActivityFilter={true}
  />

  {#if ifShowHomeLatestComments}
    <div class="mt-2">
      {#if browser}
        {#if isError}
          <div>
            <p class="text-colorNotImportant dark:text-colorNotImportant-dark">
              Failed to download the latest comments. Try again later.
            </p>
          </div>
        {/if}

        {#if areValidSpasmEventsV2(comments)}
          {#if comments[0]}
            <div class="mt-4 mb-32 border-t border-borderColor-light dark:border-borderColor-dark p-2">
              Latest comments:

              <div
                class="cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark mb-4 hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
                onclick={() => toggleShowActionDetails()}
              >
                {showActionDetailsText} details
              </div>

              {#each getUniqueByFirstId(comments) as comment (comment.ids?.[0]?.value)}
                <InfoEventCommentsCard
                  comment={comment}
                  showCommentsCount={true}
                  showActionDetails={showActionDetails}
                />
              {/each}
            </div>
          {/if}
        {/if}
      {:else}
        <!-- Rendered on the server side -->
        <p class="animate-pulse text-colorNotImportant dark:text-colorNotImportant-dark">
          Loading...
        </p>
      {/if}
    </div>
  {/if}
</div>
