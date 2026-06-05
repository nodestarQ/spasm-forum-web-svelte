<script lang="ts">
  import { dev } from '$app/environment';
  import { goto } from '$app/navigation';
  import type {
    SpasmEventBodyTipsV2,
    SpasmEventCategoryV2,
    SpasmEventV2,
    SubmitEventV2Return
  } from '$lib/types/interfaces';
  import { spasm } from '$lib/spasm';
  import { config } from '$lib/config';
  import { useNotificationStore } from '$lib/stores/useNotificationStore';
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';
  import { useWeb3 } from '$lib/utils/useWeb3';
  import { useNostr } from '$lib/utils/useNostr';
  import { useUtils } from '$lib/utils/useUtils';
  import IconsTriangle from '$lib/components/icons/IconsTriangle.svelte';
  import IconsExternalWebsite from '@lucide/svelte/icons/external-link';

  const appConfig = useAppConfigStore()?.getAppConfig;
  const notificationStore = useNotificationStore();

  const ifShowCategoriesFilter = appConfig?.ifShowCategoriesFilter;
  const envCategories = appConfig?.envCategories;

  const {
    submitSingleSignedEventV2,
    submitMultiSignedEventV2,
    connectedAddressEthereum,
    connectedAddressNostr,
    connectedKeyType,
    showWeb3Modal,
    removeAddressEthereum,
    removeAddressNostr,
    resetMultiSigning,
    turnOnMultiSign,
    turnOffMultiSign,
    signMessageWithEthereum,
    signSavedMessageWithNostr,
    isNetworkSpasmSelected,
    isNetworkNostrSelected,
    isMultiSign,
    spasmEventSignedWithEthereum,
    spasmEventSignedWithNostr,
    savedMergedMultiSignedSpasmEventV2
  } = useWeb3();
  const { getNostrRelays, toBeNote } = useNostr();
  const { sliceAddress, isStringOrNumber, isArrayWithValues } = useUtils();
  const postPlaceholder = config?.postPlaceholder;

  let {
    formAction = 'reply',
    parentEvent,
    enableMoreOptions = true,
    tipsAllowedTickers = ['xmr', 'zec', 'eth', 'btc', 'sol'],
    replySubmitted
  }: {
    formAction?: 'post' | 'reply';
    parentEvent?: SpasmEventV2 | null;
    enableMoreOptions?: boolean;
    tipsAllowedTickers?: string[];
    replySubmitted?: (
      targets?: (string | number)[] | null,
      response?: SubmitEventV2Return
    ) => void;
  } = $props();

  let titlePlaceholder = $state('title');
  let bodyPlaceholder = $state(postPlaceholder ?? '');

  let userInputTitle = $state('');
  let userInput = $state('');
  let userInputCategoryMain = $state('');
  let userInputCategorySub = $state('');
  let userInputTipsMonero = $state('');
  let userInputTipsZcash = $state('');
  let userInputTipsEthereum = $state('');
  let userInputTipsBitcoin = $state('');
  let userInputTipsSolana = $state('');

  let errorTitle = $state(false);
  let errorBody = $state(false);

  let errorMessage = $state('');
  let errorMessageMultiSign = $state('');

  let categoriesDropDownShown = $state(false);

  let moreOptionsShown = $state(false);
  let tipsInputFieldsShown = $state(false);
  let showAdvanced = $state(false);
  let showAdvancedText = $state('Show');

  const categoryOptions = [...(envCategories ?? []), 'none'];

  const idNostrNote = $derived.by(() => {
    if (parentEvent) {
      const idNostrHex: string | number | null = spasm.getIdByFormat(
        parentEvent,
        { name: 'nostr-hex' },
        'event'
      );
      if (idNostrHex && String(idNostrHex)) {
        const note = toBeNote(String(idNostrHex));
        if (note) return note;
      }
    }
    return '';
  });

  // Any input change invalidates a partially-completed multi-sign.
  $effect(() => {
    if (userInputTitle) errorTitle = false;
    resetMultiSigning();
  });
  $effect(() => {
    if (userInput) errorBody = false;
    resetMultiSigning();
  });
  $effect(() => {
    // track tip fields
    userInputTipsMonero;
    userInputTipsZcash;
    userInputTipsEthereum;
    userInputTipsBitcoin;
    userInputTipsSolana;
    resetMultiSigning();
  });

  const toggleCategoriesDropDown = () => {
    categoriesDropDownShown = !categoriesDropDownShown;
  };

  const toggleTipsInputFieldsShown = () => {
    tipsInputFieldsShown = !tipsInputFieldsShown;
  };

  const hideTipsInputFieldsShown = (): void => {
    tipsInputFieldsShown = false;
  };

  const toggleMoreOptionsShown = () => {
    moreOptionsShown = !moreOptionsShown;
    if (moreOptionsShown === false) {
      hideTipsInputFieldsShown();
      hideShowAdvanced();
    }
  };

  const hideMoreOptionsShown = (): void => {
    moreOptionsShown = false;
  };

  const toggleShowAdvanced = (): void => {
    showAdvanced = !showAdvanced;
    showAdvancedText = showAdvancedText === 'Show' ? 'Hide' : 'Show';
    if (showAdvanced) {
      turnOnMultiSign();
    } else {
      turnOffMultiSign();
    }
  };

  const hideShowAdvanced = (): void => {
    showAdvanced = false;
    showAdvancedText = 'Show';
    turnOffMultiSign();
  };

  // Build the categories payload from the parent event (for a
  // reply) or from the user's category selection (for a post).
  const buildCategories = (): SpasmEventCategoryV2[] | null => {
    if (
      parentEvent && 'categories' in parentEvent &&
      parentEvent.categories &&
      Array.isArray(parentEvent.categories) &&
      parentEvent.categories[0] &&
      'name' in parentEvent.categories[0] &&
      typeof parentEvent.categories[0].name === 'string'
    ) {
      return parentEvent.categories;
    } else if (
      userInputCategoryMain &&
      typeof userInputCategoryMain === 'string' &&
      userInputCategoryMain.toLowerCase() !== 'any' &&
      userInputCategoryMain.toLowerCase() !== 'none'
    ) {
      if (
        userInputCategorySub &&
        typeof userInputCategorySub === 'string' &&
        userInputCategorySub.toLowerCase() !== 'any' &&
        userInputCategorySub.toLowerCase() !== 'none'
      ) {
        return [
          {
            name: userInputCategoryMain.toLowerCase(),
            sub: { name: userInputCategorySub.toLowerCase() }
          }
        ];
      }
      return [{ name: userInputCategoryMain.toLowerCase() }];
    }
    return null;
  };

  // Collect tip addresses entered by the user. `trimmed` is used
  // for the multi-sign path to match the original behaviour.
  const buildTips = (trimmed: boolean): SpasmEventBodyTipsV2[] | null => {
    const inputTips: SpasmEventBodyTipsV2[] = [];
    const clean = (v: string) => (trimmed ? v.trim() : v);
    if (userInputTipsMonero && typeof userInputTipsMonero === 'string') {
      inputTips.push({
        address: clean(userInputTipsMonero),
        currency: { name: 'monero', ticker: 'xmr' }
      });
    }
    if (userInputTipsZcash && typeof userInputTipsZcash === 'string') {
      inputTips.push({
        address: clean(userInputTipsZcash),
        currency: { name: 'zcash', ticker: 'zec' }
      });
    }
    if (userInputTipsEthereum && typeof userInputTipsEthereum === 'string') {
      inputTips.push({
        address: clean(userInputTipsEthereum),
        currency: { name: 'ethereum', ticker: 'eth' }
      });
    }
    if (userInputTipsBitcoin && typeof userInputTipsBitcoin === 'string') {
      inputTips.push({
        address: clean(userInputTipsBitcoin),
        currency: { name: 'bitcoin', ticker: 'btc' }
      });
    }
    if (userInputTipsSolana && typeof userInputTipsSolana === 'string') {
      inputTips.push({
        address: clean(userInputTipsSolana),
        currency: { name: 'solana', ticker: 'sol' }
      });
    }
    return inputTips && isArrayWithValues(inputTips) ? inputTips : null;
  };

  const extractParentIds = (): (string | number)[] => {
    const parentIds: (string | number)[] = [];
    if (parentEvent?.ids && Array.isArray(parentEvent.ids)) {
      parentEvent.ids.forEach((id) => {
        if (id && 'value' in id && id.value && isStringOrNumber(id.value)) {
          parentIds.push(id.value);
        }
      });
    }
    return parentIds;
  };

  const resetForm = () => {
    userInput = '';
    userInputTipsMonero = '';
    userInputTipsZcash = '';
    userInputTipsEthereum = '';
    userInputTipsBitcoin = '';
    userInputTipsSolana = '';
  };

  const submitMessage = async (e: Event): Promise<void> => {
    e.preventDefault();
    errorMessageMultiSign = '';

    let response: SubmitEventV2Return | null | undefined;

    // Multi signed message
    if (isMultiSign.value && showAdvanced) {
      if (!spasmEventSignedWithEthereum.value) {
        errorMessageMultiSign = 'Message is not signed with Ethereum yet';
      } else if (!spasmEventSignedWithNostr.value) {
        errorMessageMultiSign = 'Message is not signed with Nostr yet';
      } else if (!savedMergedMultiSignedSpasmEventV2.value) {
        errorMessageMultiSign =
          'Something went wrong. Try signing with Ethereum and Nostr again.';
      }
      notificationStore.showNotification('Submitting', 'note', 3000);
      response = await submitMultiSignedEventV2();

      // Single signed message
    } else {
      // highlight a title input field if a title is empty
      if (!userInputTitle && formAction === 'post') {
        errorTitle = true;
        titlePlaceholder = 'title is required';
        return;
      }

      // highlight a body input field if a body is empty
      if (!userInput) {
        errorBody = true;
        bodyPlaceholder = 'this field is required';
        return;
      }

      const categories = buildCategories();
      const finalTips = buildTips(false);

      // It's a comment if there is a target (action = 'reply').
      if (
        formAction === 'reply' &&
        parentEvent?.ids &&
        Array.isArray(parentEvent.ids)
      ) {
        const parentIds = extractParentIds();
        notificationStore.showNotification('Submitting', 'note', 3000);
        response = await submitSingleSignedEventV2(
          'reply',
          userInput,
          parentIds,
          '',
          categories,
          parentEvent,
          finalTips
        );

        // It's a new post if there is no target (action = 'post').
      } else if (formAction === 'post') {
        response = await submitSingleSignedEventV2(
          'post',
          userInput,
          '',
          userInputTitle,
          categories,
          parentEvent,
          finalTips
        );
      }
    }

    if (
      response &&
      response.res &&
      typeof response.res === 'string' &&
      response.res.startsWith('ERROR:')
    ) {
      errorMessage = response.res;
    }

    if (
      response && 'res' in response && response.res &&
      typeof response.res === 'string' &&
      response.res.toLowerCase().startsWith('success')
    ) {
      if (formAction === 'post') {
        if (response.id && typeof response.id === 'string') {
          goto(`/news/${response.id}`);

          setTimeout(() => {
            userInput = '';
            userInputTitle = '';
            userInputTipsMonero = '';
            userInputTipsZcash = '';
            userInputTipsEthereum = '';
            userInputTipsBitcoin = '';
            userInputTipsSolana = '';
            errorBody = false;
            errorTitle = false;
            hideShowAdvanced();
            hideMoreOptionsShown();
            hideTipsInputFieldsShown();
            resetMultiSigning();
          }, 2000);
        }
      } else if (formAction === 'reply') {
        resetForm();
        errorMessage = '';
        const targets = extractParentIds();
        hideShowAdvanced();
        hideMoreOptionsShown();
        hideTipsInputFieldsShown();
        resetMultiSigning();
        replySubmitted?.(targets, response);
      }
    }

    if (
      response && response.res &&
      response.res === "Sorry, but you've already submitted the same action"
    ) {
      notificationStore.showNotification(
        "You've already submitted this comment to this post",
        'error',
        6000
      );
    }

    if (
      response && response.res &&
      response.res === 'ERROR: this address is not whitelisted to submit new posts'
    ) {
      errorMessage = 'ERROR: this address is not whitelisted to submit new posts';
    }
  };

  const signWithEthereum = async (): Promise<void> => {
    errorMessageMultiSign = '';
    // highlight a title input field if a title is empty
    if (!userInputTitle && formAction === 'post') {
      errorTitle = true;
      titlePlaceholder = 'title is required';
      return;
    }

    // highlight a body input field if a body is empty
    if (!userInput) {
      errorBody = true;
      bodyPlaceholder = 'this field is required';
      return;
    }

    const categories = buildCategories();
    const finalTips = buildTips(true);

    // It's a comment if there is a target (action = 'reply').
    if (
      formAction === 'reply' &&
      parentEvent?.ids &&
      Array.isArray(parentEvent.ids)
    ) {
      const parentIds = extractParentIds();
      await signMessageWithEthereum(
        'reply',
        userInput,
        parentIds,
        '',
        categories ?? undefined,
        parentEvent,
        finalTips
      );

      // It's a new post if there is no target (action = 'post').
    } else if (formAction === 'post') {
      await signMessageWithEthereum(
        'post',
        userInput,
        '',
        userInputTitle,
        categories ?? undefined,
        parentEvent,
        finalTips
      );
    }
  };

  const signWithNostr = async (): Promise<void> => {
    errorMessageMultiSign = '';
    await signSavedMessageWithNostr();
  };

  const selectCategoryMain = (category: string): void => {
    userInputCategoryMain = category;
    toggleCategoriesDropDown();
    resetMultiSigning();
  };
</script>

<div class="mb-16">
  {#if errorMessage}
    <div class="text-colorRed-light dark:text-colorRed-dark">{errorMessage}</div>
  {/if}
  {#if formAction === 'post'}
    <div class="mb-4">Create a new post</div>
  {/if}
  <form class="mb-4" onsubmit={submitMessage}>
    <!-- Category -->
    {#if formAction === 'post'}
      {#if ifShowCategoriesFilter}
        <!-- Dropdown toggle button -->
        <div>
          <span
            onclick={() => toggleCategoriesDropDown()}
            class="text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer"
          >
            <span>
              <span class="mt-2">Category:</span>
              <span class="ml-2 uppercase text-colorPrimary-light dark:text-colorPrimary-dark">
                {userInputCategoryMain}
              </span>
            </span>
            <IconsTriangle rotateIf={categoriesDropDownShown} />
          </span>
        </div>

        <!-- Dropdown menu -->
        {#if categoriesDropDownShown}
          <div class="pl-20 bg-bgSecondary-light dark:bg-bgSecondary-dark rounded-md shadow-md">
            {#each categoryOptions as category}
              <div>
                <span
                  class="uppercase hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer"
                  onclick={() => selectCategoryMain(String(category))}
                >
                  {category}
                </span>
              </div>
            {/each}
          </div>
        {/if}
      {/if}
    {/if}

    <!-- TITLE -->
    {#if formAction === 'post'}
      <div class="mt-2 text-colorNotImportant-light dark:text-colorNotImportant-dark">Title:</div>
      <input
        bind:value={userInputTitle}
        placeholder={titlePlaceholder}
        class="p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[700px] focus:outline-hidden border-2 {errorTitle ? 'border-red-400 dark:border-red-400 placeholder:text-red-400' : ''}"
      />
    {/if}

    <!-- CONTENT -->
    {#if formAction === 'post'}
      <div class="mt-2 text-colorNotImportant-light dark:text-colorNotImportant-dark">Body:</div>
    {/if}
    <textarea
      bind:value={userInput}
      placeholder={bodyPlaceholder}
      class="block p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[700px] h-60 lg:h-48 focus:outline-hidden rounded-b-lg border-2 {errorBody ? 'border-red-400 dark:border-red-400 placeholder:text-red-400' : ''}"
    ></textarea>

    <!-- MORE OPTIONS -->
    {#if enableMoreOptions}
      <div class="my-2">
        <div>
          <span
            class="ml-2 text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
            onclick={() => toggleMoreOptionsShown()}
          >
            More options
            <IconsTriangle rotateIf={moreOptionsShown} />
          </span>
        </div>

        {#if moreOptionsShown}
          <div class="ml-2">
            <!-- TIPS -->
            <div class="ml-2 my-2">
              <div>
                <span
                  class="text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
                  onclick={() => toggleTipsInputFieldsShown()}
                >
                  Add addresses for tips
                  <IconsTriangle rotateIf={tipsInputFieldsShown} />
                </span>
              </div>

              {#if tipsInputFieldsShown}
                <!-- Monero (XMR) -->
                {#if tipsAllowedTickers?.includes('xmr')}
                  <div>
                    <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">XMR:</span>
                    <input
                      bind:value={userInputTipsMonero}
                      placeholder="Monero address"
                      class="p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[550px] focus:outline-hidden border-2"
                    />
                  </div>
                {/if}

                <!-- Zcash (ZEC) -->
                {#if tipsAllowedTickers?.includes('zec')}
                  <div>
                    <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">ZEC:</span>
                    <input
                      bind:value={userInputTipsZcash}
                      placeholder="Zcash address"
                      class="p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[550px] focus:outline-hidden border-2"
                    />
                  </div>
                {/if}

                <!-- Ethereum (ETH) -->
                {#if tipsAllowedTickers?.includes('eth')}
                  <div>
                    <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">ETH:</span>
                    <input
                      bind:value={userInputTipsEthereum}
                      placeholder="Ethereum address"
                      class="p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[550px] focus:outline-hidden border-2"
                    />
                  </div>
                {/if}

                <!-- Bitcoin (BTC) -->
                {#if tipsAllowedTickers?.includes('btc')}
                  <div>
                    <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">BTC:</span>
                    <input
                      bind:value={userInputTipsBitcoin}
                      placeholder="Bitcoin address"
                      class="p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[550px] focus:outline-hidden border-2"
                    />
                  </div>
                {/if}

                <!-- Solana (SOL) -->
                {#if tipsAllowedTickers?.includes('sol')}
                  <div>
                    <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">SOL:</span>
                    <input
                      bind:value={userInputTipsSolana}
                      placeholder="Solana address"
                      class="p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[550px] focus:outline-hidden border-2"
                    />
                  </div>
                {/if}
              {/if}
            </div>

            <span class="block">
              <span
                class="mt-2 ml-2 mb-4 cursor-pointer text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
                onclick={() => toggleShowAdvanced()}
              >
                {showAdvancedText} multi-signing options
                <IconsTriangle rotateIf={showAdvanced} />
              </span>
            </span>

            <!-- Advanced (multi-signing) -->
            {#if showAdvanced}
              <div class="mt-1 ml-2">
                Sign with multiple private keys:
                {#if connectedAddressEthereum.value}
                  <div>
                    Ethereum: {sliceAddress(connectedAddressEthereum.value, 8, 6)}
                    <span
                      onclick={() => showWeb3Modal()}
                      class="hover:underline cursor-pointer text-colorPrimary-light dark:text-colorPrimary-dark"
                    >
                      change
                    </span>
                    /
                    <span
                      onclick={() => removeAddressEthereum()}
                      class="hover:underline cursor-pointer text-colorPrimary-light dark:text-colorPrimary-dark"
                    >
                      remove
                    </span>
                  </div>
                {:else}
                  <div>
                    <span
                      onclick={() => showWeb3Modal()}
                      class="hover:underline cursor-pointer text-colorPrimary-light dark:text-colorPrimary-dark"
                    >
                      Click to connect Ethereum
                    </span>
                  </div>
                {/if}
                {#if connectedAddressNostr.value}
                  <div>
                    Nostr: {sliceAddress(connectedAddressNostr.value, 8)}
                    <span
                      onclick={() => showWeb3Modal()}
                      class="hover:underline cursor-pointer text-colorPrimary-light dark:text-colorPrimary-dark"
                    >
                      change
                    </span>
                    /
                    <span
                      onclick={() => removeAddressNostr()}
                      class="hover:underline cursor-pointer text-colorPrimary-light dark:text-colorPrimary-dark"
                    >
                      remove
                    </span>
                  </div>
                {:else}
                  <div>
                    <span
                      onclick={() => showWeb3Modal()}
                      class="hover:underline cursor-pointer text-colorPrimary-light dark:text-colorPrimary-dark"
                    >
                      Click to connect Nostr
                    </span>
                  </div>
                {/if}
                {#if connectedAddressEthereum.value && connectedAddressNostr.value}
                  {#if !spasmEventSignedWithEthereum.value}
                    <div
                      class="block hover:underline cursor-pointer text-colorPrimary-light dark:text-colorPrimary-dark"
                      onclick={() => signWithEthereum()}
                    >
                      Sign with Ethereum
                    </div>
                  {/if}
                  {#if spasmEventSignedWithEthereum.value}
                    <div>Ethereum: signed</div>
                  {/if}
                  {#if !spasmEventSignedWithNostr.value && spasmEventSignedWithEthereum.value}
                    <div
                      class="block hover:underline cursor-pointer text-colorPrimary-light dark:text-colorPrimary-dark"
                      onclick={() => signWithNostr()}
                    >
                      Sign with Nostr
                    </div>
                  {/if}
                  {#if spasmEventSignedWithNostr.value}
                    <div>Nostr: signed</div>
                  {/if}
                {/if}
                {#if errorMessageMultiSign}
                  <div class="text-colorRed-light dark:text-colorRed-dark">
                    ERROR: {errorMessageMultiSign}
                  </div>
                {/if}
                {#if spasmEventSignedWithEthereum.value && spasmEventSignedWithNostr.value}
                  <button
                    class="inline px-6 lg:min-w-[200px] min-h-[40px] text-colorPrimary-light dark:text-colorPrimary-dark border-2 border-colorPrimary-light dark:border-colorPrimary-dark rounded-lg hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
                  >
                    Submit to
                    {#if isNetworkSpasmSelected.value}<span>Spasm</span>{/if}
                    {#if isNetworkSpasmSelected.value && isNetworkNostrSelected.value}<span> and </span>{/if}
                    {#if isNetworkNostrSelected.value}<span>Nostr</span>{/if}
                  </button>
                {/if}
              </div>
            {/if}
          </div>
        {/if}
      </div>
    {/if}

    <!-- NETWORKS -->
    {#if (connectedKeyType.value === 'nostr' && !isMultiSign.value) || (connectedAddressNostr.value && isMultiSign.value)}
      <div class="ml-2 my-2 mt-2">
        Submit to networks:
        <span class="ml-2">
          <input type="checkbox" class="h-4 w-4" bind:checked={isNetworkSpasmSelected.value} />
          <label class="ml-1">Spasm</label>
        </span>
        <span class="ml-3">
          <input type="checkbox" class="h-4 w-4" bind:checked={isNetworkNostrSelected.value} />
          <label class="ml-1">Nostr</label>
        </span>
      </div>
    {/if}

    <!-- SUBMIT BUTTON -->
    {#if !showAdvanced}
      <button
        type="submit"
        class="inline px-6 lg:min-w-[200px] min-h-[40px] text-colorPrimary-light dark:text-colorPrimary-dark border-2 border-colorPrimary-light dark:border-colorPrimary-dark rounded-lg hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
      >
        Sign message
      </button>
    {/if}

    <!-- REPLY WITH NOSTR APP -->
    {#if idNostrNote}
      <span class="block mt-4 ml-2 mb-2 cursor-pointer">
        <a
          href={`nostr:${idNostrNote}`}
          target="_blank"
          class="text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
        >
          Reply with your Nostr app
          <IconsExternalWebsite class="custom-icons-large lg:custom-icons pb-1" />
        </a>
      </span>
    {/if}

    <!-- relays -->
    {#if isNetworkNostrSelected.value}
      {#if getNostrRelays() && isArrayWithValues(getNostrRelays())}
        <div class="ml-2 text-colorNotImportant-light dark:text-colorNotImportant-dark">
          Submitting to these Nostr relays:
          {#each getNostrRelays() ?? [] as relay}
            {#if relay && typeof relay === 'string'}
              <div>{relay.slice(6)}</div>
            {/if}
          {/each}
        </div>
      {/if}
    {/if}
  </form>

  {#if dev}
    DevOnly
    <div>
      Signed with Ethereum:
      <br />
      {spasmEventSignedWithEthereum.value}
    </div>
    <div>
      Signed with Nostr:
      <br />
      {spasmEventSignedWithNostr.value}
    </div>
    <div class="mb-8">
      Multi signed with Ethereum and Nostr:
      <br />
      {savedMergedMultiSignedSpasmEventV2.value}
      <br />
      Number of siblings:
      {savedMergedMultiSignedSpasmEventV2.value?.siblings?.length}
    </div>
  {/if}
</div>
