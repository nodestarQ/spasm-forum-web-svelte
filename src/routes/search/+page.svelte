<script lang="ts">
  import { spasm } from '$lib/spasm';
  import type {
    NostrNetworkFilter,
    NostrEventSignedOpened,
    SpasmEventV2,
    CustomSubscribeToNostrRelayConfig,
    CustomNostrRelayOnEventFunction
  } from '$lib/types/interfaces';
  import { useNostrRelaysStore } from '$lib/stores/useNostrRelaysStore.svelte';
  import { useProfilesStore } from '$lib/stores/useProfilesStore.svelte';
  import { useNostr } from '$lib/utils/useNostr';
  import { useUtils } from '$lib/utils/useUtils';
  import InfoEventCommentsCard from '$lib/components/info/InfoEventCommentsCard.svelte';

  const { getNostrRelays, toBeHex } = useNostr();
  const {
    isArrayWithValues,
    isObjectWithValues,
    isValidSpasmEventV2,
    wait,
    getUniqueByFirstId
  } = useUtils();

  let filterIds = $state('');
  let filterAuthors = $state('');
  let filterKinds = $state('');
  let filterTagsE = $state('');
  let filterTagsP = $state('');
  let filterTagsExtra1Name = $state('');
  let filterTagsExtra1Value = $state('');
  let filterTagsExtra2Name = $state('');
  let filterTagsExtra2Value = $state('');
  let filterLimit = $state('');
  let events: SpasmEventV2[] = $state([]);
  let newEvents: SpasmEventV2[] = $state([]);

  const searchNostrNetwork = async (): Promise<void> => {
    const filter: NostrNetworkFilter = {};

    const ids: string[] = [];
    if (filterIds && typeof filterIds === 'string') {
      const rawIds = filterIds.toLowerCase().split(',');
      if (rawIds && isArrayWithValues(rawIds)) {
        rawIds.forEach((rawId) => {
          const str = toBeHex(String(rawId));
          if (str && typeof str === 'string') {
            ids.push(str.trim());
          }
        });
      }
    }
    if (isArrayWithValues(ids)) filter.ids = ids;

    const authors: string[] = [];
    if (filterAuthors && typeof filterAuthors === 'string') {
      const rawAuthors = filterAuthors.toLowerCase().split(',');
      if (rawAuthors && isArrayWithValues(rawAuthors)) {
        rawAuthors.forEach((rawAuthor) => {
          const str = toBeHex(String(rawAuthor));
          if (str && typeof str === 'string') {
            authors.push(str.trim());
          }
        });
      }
    }
    if (isArrayWithValues(authors)) filter.authors = authors;

    const kinds: number[] = [];
    if (filterKinds && typeof filterKinds === 'string') {
      const rawKinds = filterKinds.toLowerCase().split(',');
      if (rawKinds && isArrayWithValues(rawKinds)) {
        rawKinds.forEach((rawKind) => {
          const num = Number(rawKind);
          if (typeof num === 'number') {
            kinds.push(num);
          }
        });
      }
    }
    if (Array.isArray(kinds) && typeof kinds[0] === 'number') filter.kinds = kinds;

    const tagsE: string[] = [];
    if (filterTagsE && typeof filterTagsE === 'string') {
      const rawValues = filterTagsE.toLowerCase().split(',');
      if (rawValues && isArrayWithValues(rawValues)) {
        rawValues.forEach((rawValue) => {
          const str = toBeHex(String(rawValue));
          if (str && typeof str === 'string') {
            tagsE.push(str.trim());
          }
        });
      }
    }
    if (isArrayWithValues(tagsE)) filter['#e'] = tagsE;

    const tagsP: string[] = [];
    if (filterTagsP && typeof filterTagsP === 'string') {
      const rawValues = filterTagsP.toLowerCase().split(',');
      if (rawValues && isArrayWithValues(rawValues)) {
        rawValues.forEach((rawValue) => {
          const str = toBeHex(String(rawValue));
          if (str && typeof str === 'string') {
            tagsP.push(str.trim());
          }
        });
      }
    }
    if (isArrayWithValues(tagsP)) filter['#p'] = tagsP;

    const tagsExtra1: string[] = [];
    if (filterTagsExtra1Value && typeof filterTagsExtra1Value === 'string') {
      const rawValues = filterTagsExtra1Value.split(',');
      if (rawValues && isArrayWithValues(rawValues)) {
        rawValues.forEach((rawValue) => {
          const str = String(rawValue);
          if (str && typeof str === 'string') {
            tagsExtra1.push(str.trim());
          }
        });
      }
    }
    if (
      filterTagsExtra1Name &&
      String(filterTagsExtra1Name) &&
      isArrayWithValues(tagsExtra1)
    ) {
      const filterName = '#' + String(filterTagsExtra1Name).trim();
      filter[filterName] = tagsExtra1;
    }

    const tagsExtra2: string[] = [];
    if (filterTagsExtra1Value && typeof filterTagsExtra1Value === 'string') {
      const rawValues = filterTagsExtra2Value.split(',');
      if (rawValues && isArrayWithValues(rawValues)) {
        rawValues.forEach((rawValue) => {
          const str = String(rawValue);
          if (str && typeof str === 'string') {
            tagsExtra2.push(str.trim());
          }
        });
      }
    }
    if (
      filterTagsExtra2Name &&
      String(filterTagsExtra1Name) &&
      isArrayWithValues(tagsExtra2)
    ) {
      const filterName = '#' + String(filterTagsExtra2Name).trim();
      filter[filterName] = tagsExtra2;
    }

    let limit = 20;
    if (filterLimit && typeof filterLimit === 'string') {
      const num = Number(filterLimit);
      if (num && typeof num === 'number') {
        limit = num;
      }
    }
    if (limit && typeof limit === 'number') filter.limit = limit;

    const relays: string[] | null = getNostrRelays();
    if (!relays) return;

    await searchNostrNetworkByFilters(filter, relays);
  };

  const searchNostrNetworkByFilters = async (
    filter: NostrNetworkFilter,
    relays: string[]
  ): Promise<NostrEventSignedOpened | null> => {
    if (!filter) return null;
    if (!isObjectWithValues(filter)) return null;
    if (!relays) return null;
    if (!isArrayWithValues(relays)) return null;

    const onEventFunction: CustomNostrRelayOnEventFunction = (
      event: any,
      _: string,
      ifAfterEose: boolean
    ) => {
      const spasmEventV2 = spasm.convertToSpasm(event);
      if (spasmEventV2 && isValidSpasmEventV2(spasmEventV2)) {
        if (!ifAfterEose) {
          spasm.appendToArrayIfEventIsUnique(events, spasmEventV2);
        } else {
          const ifDuplicate = spasm.checkIfArrayHasThisEvent(events, spasmEventV2);
          if (!ifDuplicate) {
            spasm.prependToArrayIfEventIsUnique(newEvents, spasmEventV2);
          }
        }
      }
    };
    const onEoseFunction = (relayUrl: string, totalEventsFound: number) => {
      console.log(relayUrl, 'eose, found events:', totalEventsFound);
    };

    try {
      const config: CustomSubscribeToNostrRelayConfig = {
        filters: [filter],
        onEventFunction,
        onEoseFunction,
        // Keep the sub open after EOSE for 60s to test new events.
        ifCloseSubOnEose: false,
        closeSubAfterTime: 60000,
        // Await EOSE before updateAllProfiles() so usernames are
        // fetched for all new addresses.
        ifAwaitUntilEose: true
      };
      const relayUrls: string[] = relays;
      await useNostrRelaysStore().subscribeToNostrRelaysByFilters(relayUrls, config);

      await wait(5000);

      await useProfilesStore().updateAllProfiles(['relays', 'username']);
    } catch (err) {
      console.error('error in Nostr relay connection', err);
    }
    return null;
  };

  const cleanEventsList = () => {
    events = [];
    newEvents = [];
  };

  const showNewEvents = async (): Promise<void> => {
    // slice() makes a shallow copy so the original isn't modified.
    newEvents
      ?.slice()
      .reverse()
      .forEach((newEvent: SpasmEventV2) => {
        spasm.prependToArrayIfEventIsUnique(events, newEvent);
      });
    newEvents = [];
  };
</script>

<div>
  <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">Nostr network:</div>
  <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">Filters:</div>

  <!-- IDs -->
  <div>
    IDs:
    <textarea
      bind:value={filterIds}
      placeholder="note1,note2,3827,4730"
      class="p-1 bg-bgBase-light dark:bg-bgBase-dark w-[90%] max-w-[700px] h-8 rounded-b-lg focus:outline-hidden border-bgSecondary-light dark:border-bgSecondary-dark border"
    ></textarea>
  </div>

  <!-- Authors -->
  <div>
    Authors:
    <textarea
      bind:value={filterAuthors}
      placeholder="npub1,npub2,1234,5678"
      class="p-1 bg-bgBase-light dark:bg-bgBase-dark w-[90%] max-w-[700px] h-8 rounded-b-lg focus:outline-hidden border-bgSecondary-light dark:border-bgSecondary-dark border"
    ></textarea>
  </div>

  <!-- Kinds -->
  <div>
    Kinds:
    <textarea
      bind:value={filterKinds}
      placeholder="0,1,10002"
      class="p-1 bg-bgBase-light dark:bg-bgBase-dark w-[40%] max-w-[700px] h-8 rounded-b-lg focus:outline-hidden border-bgSecondary-light dark:border-bgSecondary-dark border"
    ></textarea>
  </div>

  <!-- #e -->
  <div>
    #e:
    <textarea
      bind:value={filterTagsE}
      placeholder="note1,note2,3827,4730"
      class="p-1 bg-bgBase-light dark:bg-bgBase-dark w-[90%] max-w-[700px] h-8 rounded-b-lg focus:outline-hidden border-bgSecondary-light dark:border-bgSecondary-dark border"
    ></textarea>
  </div>

  <!-- #p -->
  <div>
    #p:
    <textarea
      bind:value={filterTagsP}
      placeholder="npub1,npub2,1234,5678"
      class="p-1 bg-bgBase-light dark:bg-bgBase-dark w-[90%] max-w-[700px] h-8 rounded-b-lg focus:outline-hidden border-bgSecondary-light dark:border-bgSecondary-dark border"
    ></textarea>
  </div>

  <!-- Limit -->
  <div>
    Limit:
    <textarea
      bind:value={filterLimit}
      placeholder="10"
      class="p-1 bg-bgBase-light dark:bg-bgBase-dark w-[40%] max-w-[700px] h-8 rounded-b-lg focus:outline-hidden border-bgSecondary-light dark:border-bgSecondary-dark border"
    ></textarea>
  </div>

  <!-- Extra tags -->
  <div>
    <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">Extra tags:</div>
    <!-- Extra tag 1 -->
    <div>
      Tag1 name:
      <textarea
        bind:value={filterTagsExtra1Name}
        placeholder="o"
        class="p-1 bg-bgBase-light dark:bg-bgBase-dark w-24 h-8 rounded-b-lg focus:outline-hidden border-bgSecondary-light dark:border-bgSecondary-dark border"
      ></textarea>
    </div>
    <div>
      Tag1 value:
      <textarea
        bind:value={filterTagsExtra1Value}
        placeholder="value1,value2,value3,value4"
        class="p-1 bg-bgBase-light dark:bg-bgBase-dark w-[80%] max-w-[700px] h-8 rounded-b-lg focus:outline-hidden border-bgSecondary-light dark:border-bgSecondary-dark border"
      ></textarea>
    </div>
    <!-- Extra tag 2 -->
    <div>
      Tag2 name:
      <textarea
        bind:value={filterTagsExtra2Name}
        placeholder="i"
        class="p-1 bg-bgBase-light dark:bg-bgBase-dark w-24 h-8 rounded-b-lg focus:outline-hidden border-bgSecondary-light dark:border-bgSecondary-dark border"
      ></textarea>
    </div>
    <div>
      Tag2 value:
      <textarea
        bind:value={filterTagsExtra2Value}
        placeholder="value1,value2,value3,value4"
        class="p-1 bg-bgBase-light dark:bg-bgBase-dark w-[80%] max-w-[700px] h-8 rounded-b-lg focus:outline-hidden border-bgSecondary-light dark:border-bgSecondary-dark border"
      ></textarea>
    </div>
  </div>

  <button
    onclick={() => searchNostrNetwork()}
    class="px-3 py-2 mx-0 mt-2 mb-2 border-2 rounded-lg border-colorPrimary-light dark:border-colorPrimary-dark text-colorPrimary-light dark:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
  >
    Search on Nostr network
  </button>
  <button
    onclick={() => cleanEventsList()}
    class="ml-2 px-3 py-2 mx-0 mt-2 mb-2 border-2 rounded-lg border-colorPrimary-light dark:border-colorPrimary-dark text-colorPrimary-light dark:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
  >
    Clean events list
  </button>
  {#if getNostrRelays()}
    <div>
      Using these Nostr relays:
      {#each getNostrRelays() ?? [] as relay}
        <div class="">{relay}</div>
      {/each}
    </div>
  {/if}
  <div>Events:</div>
  {#if newEvents && newEvents.length}
    <div>
      <button
        onclick={() => showNewEvents()}
        class="px-3 py-2 mx-0 mt-2 mb-2 border-2 rounded-lg border-colorPrimary-light dark:border-colorPrimary-dark text-colorPrimary-light dark:text-colorPrimary-dark hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
      >
        Show new events ({newEvents.length})
      </button>
    </div>
  {/if}
  <div>
    {#each getUniqueByFirstId(events) as event (event.ids?.[0]?.value)}
      <InfoEventCommentsCard comment={event} showCommentsCount={true} />
    {/each}
  </div>
</div>
