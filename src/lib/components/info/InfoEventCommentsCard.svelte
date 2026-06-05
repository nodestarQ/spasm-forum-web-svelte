<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import DOMPurify from 'dompurify';
  import type {
    SpasmEventV2,
    SpasmEventChildV2,
    SubmitEventV2Return
  } from '$lib/types/interfaces';
  import { spasm } from '$lib/spasm';
  import { config } from '$lib/config';
  import { useProfilesStore } from '$lib/stores/useProfilesStore.svelte';
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';
  import { useWeb3 } from '$lib/utils/useWeb3';
  import { useUtils } from '$lib/utils/useUtils';
  import { useUtilsEnv } from '$lib/utils/useUtilsEnv';
  import { useHtmlTags } from '$lib/utils/useHtmlTags';
  import ExtraBlockies from '$lib/components/extra/ExtraBlockies.svelte';
  import ExtraAddressIcons from '$lib/components/extra/ExtraAddressIcons.svelte';
  import ExtraTipsBlock from '$lib/components/extra/ExtraTipsBlock.svelte';
  import InfoEventCommentsCardReactionsBar from './InfoEventCommentsCardReactionsBar.svelte';
  import InfoCreateNewMessageForm from './InfoCreateNewMessageForm.svelte';
  import IconsComments from '$lib/components/icons/IconsComments.svelte';
  // Recursive self-import (Svelte 5 replacement for <svelte:self>).
  import InfoEventCommentsCard from './InfoEventCommentsCard.svelte';

  const appConfig = useAppConfigStore()?.getAppConfig;
  const profilesStore = useProfilesStore();
  const {
    extractIdForDisplay,
    extractParentIdForLink,
    extractParentIdForDisplay,
    extractOneAuthorAddressForDisplay
  } = useWeb3();
  const { sliceAddress, toBeDate, isValidSpasmEventV2, getUniqueByFirstId } =
    useUtils();
  const { extractTextForDisplay, standardizeTextForDisplay } = useUtilsEnv();
  const enableMarkdownInComments = appConfig?.enableMarkdownInComments;
  const enableNewWeb3ActionsAll = appConfig?.enableNewWeb3ActionsAll;
  const enableNewWeb3ActionsReply = appConfig?.enableNewWeb3ActionsReply;
  const enableEmbedIframeTagsInComments =
    config?.enableEmbedIframeTagsInComments === 'true';
  const { checkIfSignerAllowedIframe, getArrayOfArraysOfTextAndTagsV2 } =
    useHtmlTags();

  // The prop is named `comment` for historical reasons, but the
  // value passed by callers is the child's `event` (a full
  // SpasmEventV2), so that's the type used here.
  let {
    comment,
    showActionDetails,
    showCommentsCount,
    replySubmitted
  }: {
    comment?: SpasmEventV2;
    showActionDetails?: boolean;
    showCommentsCount?: boolean;
    replySubmitted?: (
      targets?: (string | number)[] | null,
      response?: SubmitEventV2Return
    ) => void;
  } = $props();

  const purify = (html: string): string =>
    browser ? DOMPurify.sanitize(html) : '';

  const addressForDisplay = $derived(
    comment ? extractOneAuthorAddressForDisplay(comment) : undefined
  );
  const addressValue = $derived(
    comment ? extractOneAuthorAddressForDisplay(comment, true) : undefined
  );

  let showReplyForm = $state(false);
  let showReplyFormText = $state('reply');

  const toggleReplyForm = () => {
    showReplyForm = !showReplyForm;
    showReplyFormText = showReplyFormText === 'reply' ? 'hide' : 'reply';
  };

  // Actions like replies and reactions can come from child
  // comments, so we have to bubble them up to InfoEventComments.
  const handleReplySubmitted = (
    targets?: (string | number)[] | null,
    response?: SubmitEventV2Return
  ) => {
    showReplyForm = false;
    showReplyFormText = 'reply';
    replySubmitted?.(targets);
    // Render submitted event
    if (
      response && typeof response === 'object' &&
      'signedEvent' in response && response.signedEvent
    ) {
      const spasmEvent: SpasmEventV2 | null = spasm.convertToSpasm(
        response.signedEvent
      );
      if (
        spasmEvent && 'ids' in spasmEvent && spasmEvent.ids &&
        isValidSpasmEventV2(spasmEvent)
      ) {
        const spasmEventChild: SpasmEventChildV2 = {
          ids: spasmEvent.ids,
          event: spasmEvent
        };
        if (comment) {
          if ('children' in comment && Array.isArray(comment.children)) {
            comment.children.unshift(spasmEventChild);
          } else {
            comment.children = [spasmEventChild];
          }
        }
      }
    }
  };

  // Iframe tags. WARNING: it's very important to check whether
  // the signer is allowed to add iframe tags because that's a
  // potential attack vector.
  const iframeData = $derived.by(() => {
    let isSignerAllowedIframe = false;
    let arrayOfTextChunks: string[] = [''];
    let arrayOfHtmlTags: string[] = [''];
    if (enableEmbedIframeTagsInComments) {
      const signer = comment?.authors?.[0]?.addresses?.[0]?.value?.toString();
      if (typeof signer === 'string') {
        isSignerAllowedIframe = checkIfSignerAllowedIframe(signer);
      }
      if (typeof comment?.content === 'string' && isSignerAllowedIframe) {
        const arrayOfArraysOfTextAndTags = getArrayOfArraysOfTextAndTagsV2(comment);
        if (arrayOfArraysOfTextAndTags) {
          arrayOfTextChunks = arrayOfArraysOfTextAndTags[0];
          arrayOfHtmlTags = arrayOfArraysOfTextAndTags[1];
        }
      }
    }
    return { isSignerAllowedIframe, arrayOfTextChunks, arrayOfHtmlTags };
  });

  // Add the author address to the list that gets checked for
  // profile info (e.g. usernames) during an update function.
  onMount(() => {
    const signer = comment?.authors?.[0]?.addresses?.[0]?.value;
    if (signer) {
      profilesStore.addAddress(String(signer));
    }
  });
</script>

{#if comment}
  <div class="fade-in-custom ml-4 mt-2 mb-4 border-l-2 border-bgSecondary-light dark:border-bgSecondary-dark">
    <div class="overflow-auto overflow-wrap wrap-break-word">
      <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
        {#if addressValue && addressForDisplay}
          <span>
            {#if showActionDetails}Author: {/if}
            <ExtraBlockies seed={addressValue} scale={2} class="inline-block mr-1" />
            <a
              href={`/authors/${addressValue}`}
              class="text-colorPrimary-light dark:text-colorPrimary-dark hover:underline"
            >
              {#if profilesStore.getMetadataByAddressNostr(addressValue, 'username') && profilesStore.getMetadataByAddressNostr(addressValue, 'username') !== 'none'}
                <span class="ml-1">
                  <span class="">{profilesStore.getMetadataByAddressNostr(addressValue, 'username')?.slice(0, 40)}</span>
                  <span class="text-sm">(Nostr)</span>
                </span>
              {:else}
                <span class="ml-1">{addressForDisplay}</span>
              {/if}
            </a>
            {#if addressValue}
              <ExtraAddressIcons
                value={addressValue}
                showCopyToClipboard={true}
                showQrCode={true}
                showExternalWebsite={true}
              />
            {/if}
          </span>
        {/if}

        {#if showActionDetails}
          {#if spasm.getAllSignatures(comment)?.[0]}
            <span class="ml-1">
              <span class="signatureLabel">Signature: </span>
              {sliceAddress(String(spasm.getAllSignatures(comment)?.[0]))}
              {#if String(spasm.getAllSignatures(comment)?.[0])}
                <ExtraAddressIcons
                  value={String(spasm.getAllSignatures(comment)?.[0])}
                  showCopyToClipboard={true}
                />
              {/if}
            </span>
          {/if}
          {#if extractParentIdForLink(comment) && extractIdForDisplay(comment)}
            <span>
              <span class="ml-1">Parent ID: </span>
              <a
                class="text-colorPrimary-light dark:text-colorPrimary-dark hover:underline"
                href={`/news/${extractParentIdForLink(comment)}`}
              >
                <span>{sliceAddress(extractParentIdForDisplay(comment))}</span>
              </a>
              {#if String(extractParentIdForDisplay(comment))}
                <ExtraAddressIcons
                  value={String(extractParentIdForDisplay(comment))}
                  showCopyToClipboard={true}
                />
              {/if}
            </span>
          {/if}
        {/if}

        {#if extractIdForDisplay(comment)}
          <a
            href={`/news/${extractIdForDisplay(comment)}`}
            class="app-link text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
          >
            {#if comment.timestamp}
              ({toBeDate(comment.timestamp, 'short')})
            {/if}
          </a>
        {/if}
      </div>

      <div>
        {#if comment.title}
          <h6 class="font-bold">{comment.title}</h6>
        {/if}
      </div>

      {#if comment.content}
        <div class="whitespace-pre-line my-1 pl-1">
          <!-- No iframe tags -->
          {#if !iframeData.isSignerAllowedIframe}
            {#if !enableMarkdownInComments}
              <div>{extractTextForDisplay(comment)}</div>
            {:else}
              <div>{@html purify(extractTextForDisplay(comment))}</div>
            {/if}
          {:else}
            <!-- Iframe tags -->
            {#each iframeData.arrayOfTextChunks as textChunk, index}
              <div>
                {#if enableMarkdownInComments && textChunk}
                  <div>{@html purify(standardizeTextForDisplay(textChunk, 'reply'))}</div>
                {/if}
                {#if !enableMarkdownInComments && textChunk}
                  <div>{standardizeTextForDisplay(textChunk, 'reply')}</div>
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

    <ExtraTipsBlock class="mb-2" event={comment} />

    <div>
      <InfoEventCommentsCardReactionsBar comment={comment} class="mr-1" />

      {#if showCommentsCount}
        <a href={`/news/${extractIdForDisplay(comment)}`}>
          {#if spasm.getTotalOfReply(comment)}
            <button class="inline-block mr-2 text-colorBlue-light dark:text-colorBlue-dark">
              <span class="mr-2 text-colorBlue-light dark:text-colorBlue-dark">
                <IconsComments class="custom-icons" />
                {spasm.getTotalOfReply(comment)}
              </span>
            </button>
          {/if}
        </a>
      {/if}

      {#if enableNewWeb3ActionsAll && enableNewWeb3ActionsReply}
        <div class="inline-block">
          <div
            class="inline-block text-lg lg:text-base text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark"
            onclick={() => toggleReplyForm()}
          >
            {showReplyFormText}
          </div>
        </div>
      {/if}

      {#if showReplyForm}
        <InfoCreateNewMessageForm
          formAction={'reply'}
          parentEvent={comment}
          replySubmitted={handleReplySubmitted}
        />
      {/if}
    </div>

    <!--
      Actions like replies and reactions can come from child
      comments, so we bubble them up to InfoEventComments.
    -->
    {#if comment.children}
      <div class="children">
        {#each getUniqueByFirstId(comment.children) as child (child.ids?.[0]?.value)}
          <InfoEventCommentsCard
            comment={child.event}
            showActionDetails={showActionDetails}
            showCommentsCount={showCommentsCount}
            replySubmitted={handleReplySubmitted}
          />
        {/each}
      </div>
    {/if}
  </div>
{/if}

<style>
  .fade-in-custom {
    animation: fadeIn 1s;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
