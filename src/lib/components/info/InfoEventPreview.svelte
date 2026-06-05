<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import DOMPurify from 'dompurify';
  import type { SpasmEventV2 } from '$lib/types/interfaces';
  import { spasm } from '$lib/spasm';
  import { config } from '$lib/config';
  import { useProfilesStore } from '$lib/stores/useProfilesStore.svelte';
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';
  import { useWeb3 } from '$lib/utils/useWeb3';
  import { useNostr } from '$lib/utils/useNostr';
  import { useUtils } from '$lib/utils/useUtils';
  import { useUtilsEnv } from '$lib/utils/useUtilsEnv';
  import { useHtmlTags } from '$lib/utils/useHtmlTags';
  import InfoEventAuthorAddress from './InfoEventAuthorAddress.svelte';
  import ExtraRssBlock from '$lib/components/extra/ExtraRssBlock.svelte';
  import IconsExternalWebsite from '$lib/components/icons/IconsExternalWebsite.svelte';

  const appConfig = useAppConfigStore()?.getAppConfig;
  const profilesStore = useProfilesStore();
  const {
    connectedAddress,
    connectedAddressNostr,
    connectedAddressEthereum,
    extractParentIdForDisplay,
    extractParentIdForLink,
    extractSourceNameForDisplay,
    sendEventV2ToSpasm
  } = useWeb3();
  const { toBeHex, getNostrRelays, sendEventToNostrNetwork } = useNostr();
  const enableMarkdownInPosts = appConfig?.enableMarkdownInPosts;
  const enableShortUrlsForWeb3Actions = appConfig?.enableShortUrlsForWeb3Actions;
  const shortUrlsLengthOfWeb3Ids = appConfig?.shortUrlsLengthOfWeb3Ids;
  const admins = appConfig?.admins;
  const enableEmbedIframeTagsInPosts: boolean =
    config?.enableEmbedIframeTagsInPosts === 'true';
  const { checkIfSignerAllowedIframe, getArrayOfArraysOfTextAndTagsV2 } =
    useHtmlTags();
  const { sliceId, randomNumber, toBeDate, isArrayWithValues, isValidUrl } =
    useUtils();
  const { extractTextForDisplay, standardizeTextForDisplay } = useUtilsEnv();

  let { event, class: className = '' }: { event?: SpasmEventV2; class?: string } =
    $props();

  // Lowercase helper that never returns undefined so the value
  // is safe to pass to .includes() / toBeHex().
  const lower = (v?: string | null): string => v?.toLowerCase() ?? '';

  const purify = (html: string): string =>
    browser ? DOMPurify.sanitize(html) : '';

  // Iframe tags. WARNING: it's very important to check whether
  // the signer is allowed to add iframe tags because that's a
  // potential attack vector.
  const iframeData = $derived.by(() => {
    let isSignerAllowedIframe = false;
    let arrayOfTextChunks: string[] = [''];
    let arrayOfHtmlTags: string[] = [''];
    if (enableEmbedIframeTagsInPosts) {
      const signer = event?.authors?.[0]?.addresses?.[0]?.value?.toString();
      if (signer && typeof signer === 'string') {
        isSignerAllowedIframe = checkIfSignerAllowedIframe(signer);
      }
      if (typeof event?.content === 'string' && isSignerAllowedIframe) {
        const arrayOfArraysOfTextAndTags = getArrayOfArraysOfTextAndTagsV2(event);
        if (arrayOfArraysOfTextAndTags && isArrayWithValues(arrayOfArraysOfTextAndTags)) {
          arrayOfTextChunks = arrayOfArraysOfTextAndTags[0];
          arrayOfHtmlTags = arrayOfArraysOfTextAndTags[1];
        }
      }
    }
    return { isSignerAllowedIframe, arrayOfTextChunks, arrayOfHtmlTags };
  });

  // TODO: how to wait until all feed posts are fetched and only
  // then call an update function? Meanwhile, added a delay.
  onMount(() => {
    const t = setTimeout(() => {
      profilesStore.updateAllProfiles();
    }, 2000);
    return () => clearTimeout(t);
  });

  let broadcastToOtherNetworksDropDownShown = $state(false);
  const toggleBroadcastToOtherNetworks = () => {
    broadcastToOtherNetworksDropDownShown = !broadcastToOtherNetworksDropDownShown;
  };
  const hideBroadcastToOtherNetworks = () => {
    broadcastToOtherNetworksDropDownShown = false;
  };

  let broadcastToOtherInstancesDropDownShown = $state(false);
  const toggleBroadcastToOtherInstances = () => {
    broadcastToOtherInstancesDropDownShown = !broadcastToOtherInstancesDropDownShown;
  };

  let customApiUrl = $state('');
  let errorCustomApiUrl = $state(false);
  let sendToAnotherInstanceResponse = $state('');

  const sendEventToAnotherInstance = async () => {
    if (!customApiUrl || !isValidUrl(customApiUrl)) {
      errorCustomApiUrl = true;
      return;
    }
    if (!event) return;
    sendToAnotherInstanceResponse = 'pending';
    const res = await sendEventV2ToSpasm(event, customApiUrl);
    if (!res) {
      sendToAnotherInstanceResponse = 'something went wrong';
    } else {
      sendToAnotherInstanceResponse = typeof res === 'string' ? res : 'Success';
    }
  };

  $effect(() => {
    if (customApiUrl) {
      errorCustomApiUrl = false;
      sendToAnotherInstanceResponse = '';
    }
  });
</script>

{#if event}
  <div class="overflow-auto overflow-wrap wrap-break-word {className}">
    {#if event.title}
      <div class="text-2xl my-1">{event.title}</div>
    {/if}

    <!-- category -->
    <div class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">
      {#if event.categories?.[0]?.name}
        <span class="mr-1">
          Category:
          {#each event.categories as category}
            {#if category.name}<span>{category.name}</span>{/if}
          {/each}
        </span>
      {/if}
    </div>

    <!-- database timestamp -->
    <div class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">
      {#if event.db?.addedTimestamp}
        <span class="mr-1">Added: {toBeDate(event.db?.addedTimestamp, 'short')}</span>
      {/if}
    </div>

    <!-- signed timestamp -->
    <div>
      {#if event.timestamp}
        <span class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">
          Signed: {toBeDate(event.timestamp, 'short')}
        </span>
      {/if}
      {#if enableShortUrlsForWeb3Actions && event.ids?.[0]?.value}
        <div class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">
          Link:
          <span>
            <a
              class="cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
              href={`/news/${event.ids?.[0]?.value?.toString()}`}
            >
              long
            </a>
          </span>
          /
          <span>
            <a
              class="cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
              href={`/news/${event.ids?.[0]?.value?.toString()?.slice(0, shortUrlsLengthOfWeb3Ids)}`}
            >
              short
            </a>
          </span>
        </div>
      {/if}
    </div>

    <!-- source -->
    <div class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">
      {#if extractSourceNameForDisplay(event)}
        <span class="mr-1">Source: {extractSourceNameForDisplay(event)}</span>
      {/if}
      {#if event.links?.[0]?.value}
        <span class="text-colorPrimary-light dark:text-colorPrimary-dark hover:underline">
          <a href={event.links?.[0]?.value} target="_blank">
            (read full)
            <IconsExternalWebsite class="custom-icons w-4 pb-1" />
          </a>
        </span>
      {/if}
    </div>

    <!-- TODO: handle multiple authors -->
    <!-- author addresses -->
    {#if event.authors?.[0]?.addresses?.[0]}
      {#each event.authors[0].addresses as address}
        <InfoEventAuthorAddress {address} />
      {/each}
    {/if}

    {#if event.authors?.[0]?.usernames?.[0]?.value}
      <div class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">
        Author: {event.authors?.[0]?.usernames?.[0]?.value}
      </div>
    {/if}

    {#if event.parent?.ids?.[0]?.value?.toString()}
      <div>
        <span class="text-base text-colorNotImportant-light dark:text-colorNotImportant-dark">
          In reply to:
        </span>
        {#if extractParentIdForLink(event)}
          <a
            class="text-colorPrimary-light dark:text-colorPrimary-dark hover:underline"
            href={`/news/?p=${extractParentIdForLink(event)}`}
          >
            <span>{sliceId(extractParentIdForDisplay(event), 13, 4, 30)}</span>
          </a>
        {/if}
      </div>
    {/if}

    <!-- Broadcast to other networks (Nostr) -->
    {#if spasm.extractSignedNostrEvent(event) && spasm.getVerifiedNostrSigners(event).includes(toBeHex(lower(connectedAddressNostr.value)))}
      <div>
        <div
          class="cursor-pointer text-base text-colorNotImportant-light dark:text-colorNotImportant-dark"
          onclick={() => toggleBroadcastToOtherNetworks()}
        >
          <span class="hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark">
            Broadcast to other networks (Nostr)
          </span>
          <svg
            class="inline w-5 h-5"
            class:rotate-180={broadcastToOtherNetworksDropDownShown}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        {#if broadcastToOtherNetworksDropDownShown}
          <div class="mb-8">
            {#if getNostrRelays() && isArrayWithValues(getNostrRelays())}
              <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
                <button
                  class="inline my-4 px-6 lg:min-w-[200px] min-h-[40px] text-colorPrimary-light dark:text-colorPrimary-dark border-2 border-colorPrimary-light dark:border-colorPrimary-dark rounded-lg hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
                  onclick={() => {
                    sendEventToNostrNetwork(event);
                    hideBroadcastToOtherNetworks();
                  }}
                >
                  Broadcast this event to Nostr
                </button>
                <div>
                  Submitting to these Nostr relays:
                  {#each getNostrRelays() ?? [] as relay}
                    {#if relay && typeof relay === 'string'}
                      <div>{relay.slice(6)}</div>
                    {/if}
                  {/each}
                </div>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    {/if}

    <!-- Broadcast to other Spasm instances -->
    {#if admins?.includes(lower(connectedAddress.value)) || admins?.includes(lower(connectedAddressEthereum.value)) || admins?.includes(toBeHex(lower(connectedAddressNostr.value))) || spasm.getVerifiedSigners(event).includes(lower(connectedAddress.value)) || spasm.getVerifiedEthereumSigners(event).includes(lower(connectedAddressEthereum.value)) || spasm.getVerifiedNostrSigners(event).includes(toBeHex(lower(connectedAddressNostr.value)))}
      <div>
        <div
          class="cursor-pointer text-base text-colorNotImportant-light dark:text-colorNotImportant-dark"
          onclick={() => toggleBroadcastToOtherInstances()}
        >
          <span class="hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark">
            Broadcast to other instances (Spasm)
          </span>
          <svg
            class="inline w-5 h-5"
            class:rotate-180={broadcastToOtherInstancesDropDownShown}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        {#if broadcastToOtherInstancesDropDownShown}
          <div class="mb-8">
            <input
              bind:value={customApiUrl}
              placeholder="Enter URL of another instance"
              class="inline p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[80%] max-w-[320px] focus:outline-hidden border-2 mr-4 {errorCustomApiUrl ? 'border-red-400 dark:border-red-400 placeholder:text-red-400' : ''}"
            />
            <button
              class="inline my-4 px-6 lg:min-w-[200px] min-h-[40px] text-colorPrimary-light dark:text-colorPrimary-dark border-2 border-colorPrimary-light dark:border-colorPrimary-dark rounded-lg hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
              onclick={() => sendEventToAnotherInstance()}
            >
              Send
            </button>
            {#if sendToAnotherInstanceResponse}
              <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
                Status: {sendToAnotherInstanceResponse}
              </div>
            {/if}
          </div>
        {/if}
      </div>
    {/if}

    <!-- RSS feed customization -->
    <div class="mb-4">
      <ExtraRssBlock
        {event}
        activity={'all'}
        showActivityFilter={true}
        showSignerFilter={true}
        showCategoryFilter={true}
      />
    </div>

    <!--
      1. white-space: pre-line; is needed to properly display
         multiple lines of text with \n line breakers.
      2. Eventually, decided to use marked library inside
         standardizeTextForDisplay function with {breaks:true},
         which replaces single \n with <br> to properly display
         a new line.
      3. Markdown (marked library) can be disabled in .env, e.g.
         due to security concerns, so 'white-space: pre-line' is
         used.
    -->
    {#if event.content}
      <div class="whitespace-pre-line my-1">
        <!-- No iframe tags -->
        {#if !iframeData.isSignerAllowedIframe}
          {#if !enableMarkdownInPosts}
            <div>{extractTextForDisplay(event)}</div>
          {:else}
            <div>{@html purify(extractTextForDisplay(event))}</div>
          {/if}
        {:else}
          <!-- Iframe tags -->
          {#each iframeData.arrayOfTextChunks as textChunk, index}
            <div>
              {#if enableMarkdownInPosts && textChunk}
                <div>{@html purify(standardizeTextForDisplay(textChunk, 'post'))}</div>
              {/if}
              {#if !enableMarkdownInPosts && textChunk}
                <div>{standardizeTextForDisplay(textChunk, 'post')}</div>
              {/if}
              <!--
                DOMPurify is not used so tags can be embedded.
                HTML tags in arrayOfHtmlTags are generated by the
                script and only for whitelisted users.
              -->
              {#if iframeData.arrayOfHtmlTags && iframeData.arrayOfHtmlTags[index]}
                <div>{@html iframeData.arrayOfHtmlTags[index]}</div>
              {/if}
            </div>
          {/each}
        {/if}
      </div>
    {/if}
  </div>
{/if}
