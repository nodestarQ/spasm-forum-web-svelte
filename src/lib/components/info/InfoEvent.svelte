<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { spasm } from '$lib/spasm';
  import type { SpasmEventV2, SubmitEventV2Return } from '$lib/types/interfaces';
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';
  import { useEventsStore } from '$lib/stores/useEventsStore.svelte';
  import { useNotificationStore } from '$lib/stores/useNotificationStore';
  import { useUtils } from '$lib/utils/useUtils';
  import { useNostr } from '$lib/utils/useNostr';
  import InfoEventPreview from './InfoEventPreview.svelte';
  import InfoEventReactionsBar from './InfoEventReactionsBar.svelte';
  import InfoEventModeratorBar from './InfoEventModeratorBar.svelte';
  import InfoEventComments from './InfoEventComments.svelte';
  import InfoCreateNewMessageForm from './InfoCreateNewMessageForm.svelte';
  import ExtraTipsBlock from '$lib/components/extra/ExtraTipsBlock.svelte';
  import ExtraAddressIcons from '$lib/components/extra/ExtraAddressIcons.svelte';
  import ExtraSpinner from '$lib/components/extra/ExtraSpinner.svelte';

  const appConfig = useAppConfigStore()?.getAppConfig;
  const eventsStore = useEventsStore();
  const notificationStore = useNotificationStore();
  const enableNewWeb3ActionsAll = appConfig?.enableNewWeb3ActionsAll;
  const enableNewWeb3ActionsReply = appConfig?.enableNewWeb3ActionsReply;
  const { isValidSpasmEventV2, isArrayWithValues, isStringOrNumber } = useUtils();
  const { toBeHex, getNostrRelays, isHex } = useNostr();

  // getPost returns SpasmEventV2 | null; child components expect
  // SpasmEventV2 | undefined, so normalize once here.
  const post = $derived(eventsStore.getPost ?? undefined);

  let eventId = $state('');
  let searchBy = $state('');
  let isErrorEventNotFound = $state(false);
  let isNostrEvent = $state(false);

  // Convert Nostr's note ID to hex ID. Returns the resolved
  // searchBy value so callers don't need to read the state back.
  const setSearchBy = (newId: string | number): string => {
    if (!newId || !isStringOrNumber(newId)) return searchBy;
    const newIdString = String(newId);
    if (!newIdString || typeof newIdString !== 'string') return searchBy;
    if (newIdString.length === 63 && newIdString.startsWith('note')) {
      const eventIdHex = toBeHex(newIdString);
      // Valid Nostr ID
      if (eventIdHex && typeof eventIdHex === 'string') {
        searchBy = eventIdHex;
        isNostrEvent = true;
      } else {
        // Invalid Nostr's note ID
        searchBy = newIdString;
      }
      // May be Nostr's hex ID
    } else if (newIdString.length === 64 && isHex(newIdString)) {
      searchBy = newIdString;
      isNostrEvent = true;
      // Not Nostr ID
    } else {
      searchBy = newIdString;
    }
    return searchBy;
  };

  const updateEventWithComments = async (
    id: string | number,
    ifSetCurrentPostId: boolean = true
  ): Promise<void> => {
    if (!id) return;
    // 1. Get full event tree from local store or fetch from a
    //    Spasm instance (with comments).
    const result: SpasmEventV2[] | null =
      await eventsStore.fetchAndSaveEventsWithCommentsByIds([id]);

    // 2. Fetch event from Nostr network (without comments).
    if (
      !result || !isArrayWithValues(result) ||
      !result[0] || !isValidSpasmEventV2(result[0])
    ) {
      const nostrHexId = spasm.toBeNostrHex(searchBy);
      if (nostrHexId) {
        await eventsStore.fetchFromNostrNetworkByIds([nostrHexId]);
      }
    }

    if (ifSetCurrentPostId) eventsStore.setCurrentPostId(id);
    const event = eventsStore.getPost;

    // 3. Fetch comments from all networks.
    if (isValidSpasmEventV2(event)) {
      isErrorEventNotFound = false;
      const eventIds: (string | number)[] = spasm.getAllEventIds(event);
      await eventsStore.fetchRepliesFromAllNetworksByIds(eventIds);
    } else {
      isErrorEventNotFound = true;
    }
  };

  // Already searching by default inside updateEventWithComments().
  const searchNostrNetwork = async (): Promise<void> => {
    await eventsStore.fetchFromNostrNetworkByIds([searchBy]);
  };

  const replySubmitted = async (
    targets?: (string | number)[] | null,
    response?: SubmitEventV2Return
  ): Promise<void> => {
    // Attach submitted event to tree event if reply came from
    // InfoCreateNewMessageForm directly, since replies coming
    // from InfoEventComments should not have a 'response'.
    try {
      if (!targets || !isArrayWithValues(targets)) return;
      const treeEvent = eventsStore.getPost;
      if (!isValidSpasmEventV2(treeEvent)) return;

      if (
        response && typeof response === 'object' &&
        'signedEvent' in response && response.signedEvent
      ) {
        const spasmEvent = spasm.convertToSpasm(response.signedEvent);
        const treeEventIds: (string | number)[] =
          spasm.getAllEventIds(treeEvent);
        if (spasmEvent) {
          eventsStore.addEventsToTreeByIds(treeEventIds, [spasmEvent]);
          notificationStore.showNotification('Submitted', 'success');
        }
      }
    } catch (err) {
      console.error(err);
      return;
    }
  };

  // Examples:
  //   /news/123     -> params.id (id)
  //   /news/0x123   -> params.id (sig)
  //   /news/?p=123  -> query.p   (id)
  //   /news/?p=0x12 -> query.p   (sig)
  //   /news/?p=http -> query.p   (url)
  const resolveEventId = (): string => {
    const paramId = $page.params.id;
    const queryP = $page.url.searchParams.get('p');
    if (paramId && typeof paramId === 'string') return paramId;
    if (queryP && typeof queryP === 'string') return queryP;
    return '';
  };

  // Code inside <script> runs once when an instance is created,
  // but SvelteKit reuses the page component across param/query
  // changes (e.g. clicking 'in reply to' which uses '/?p=123').
  // So we react to route changes and refetch when the id changes.
  let lastFetched = '';
  $effect(() => {
    const id = resolveEventId();
    if (!id) return;
    eventId = id;
    const resolved = setSearchBy(id);
    // setCurrentPostId() immediately shows the selected event if
    // it's already in the store. Then we fetch the tree.
    eventsStore.setCurrentPostId(resolved);
    if (id !== lastFetched) {
      lastFetched = id;
      updateEventWithComments(resolved, true);
    }
  });

  const scrollToTop = () => {
    const element = document.querySelector('#top-anchor');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  };

  onMount(() => {
    // Scroll to the top when author changes. Small delay to allow
    // the DOM to update.
    setTimeout(scrollToTop, 300);
  });

  // Meta
  const metaTitle = $derived.by(() => {
    let title = eventsStore.getPost?.title;
    if (title && typeof title === 'string') {
      title = title.slice(0, 100) + ' - ' + appConfig?.introTitle;
    }
    return title || appConfig?.introTitle || 'Feed';
  });

  const metaDescription = $derived.by(() => {
    let description = eventsStore.getPost?.content;
    if (description && typeof description === 'string') {
      description = description.slice(0, 255);
      if (description.length === 255) {
        description = description + '...';
      }
    }
    return description || appConfig?.introAbout || '';
  });
</script>

<svelte:head>
  <title>{metaTitle}</title>
  <meta name="description" content={metaDescription} />
  <meta name="apple-mobile-web-app-title" content={metaTitle} />
  <meta name="og:title" property="og:title" content={metaTitle} />
  <meta name="og:site_name" property="og:site_name" content={metaTitle} />
  <meta name="og:description" content={metaDescription} />
</svelte:head>

<div>
  <span id="top-anchor"></span>
  {#if post && isValidSpasmEventV2(post)}
    <div class="mb-36">
      <InfoEventPreview event={post} class="mb-0" />

      <ExtraTipsBlock class="mb-2" event={post} />

      <InfoEventReactionsBar event={post} />

      <InfoEventModeratorBar event={post} />

      {#if enableNewWeb3ActionsAll && enableNewWeb3ActionsReply}
        {#if post?.ids?.[0]?.value}
          <InfoCreateNewMessageForm
            formAction={'reply'}
            parentEvent={post}
            replySubmitted={replySubmitted}
          />
        {/if}
      {/if}

      <InfoEventComments event={post} replySubmitted={replySubmitted} />
    </div>
  {/if}

  {#if !post || !isValidSpasmEventV2(post)}
    {#if isErrorEventNotFound}
      {#if eventId}
        <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
          Event ID:
        </div>
        <div class="overflow-auto overflow-wrap break-words">
          {eventId}
          <ExtraAddressIcons
            value={eventId}
            showCopyToClipboard={true}
            showQrCode={true}
            showExternalWebsite={true}
          />
        </div>
      {/if}

      <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
        Spasm network:
      </div>
      <div>Event not found on this instance.</div>

      <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
        Nostr network:
      </div>
      {#if !isNostrEvent}
        <div><div>Not a valid Nostr ID.</div></div>
      {/if}
      {#if isNostrEvent}
        <div>
          <div>Event has a valid Nostr ID.</div>
          <button
            onclick={() => searchNostrNetwork()}
            class="px-3 py-2 mx-0 mt-2 mb-2 border-2 rounded-lg border-colorPrimary-light dark:border-colorPrimary-dark text-colorPrimary-light dark:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
          >
            Search on Nostr network
          </button>
          {#if getNostrRelays()}
            <div>
              Using these Nostr relays:
              {#each getNostrRelays() ?? [] as relay}
                <div class="">{relay}</div>
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    {:else}
      <div class="animate-pulse"><ExtraSpinner /></div>
    {/if}
  {/if}
</div>
