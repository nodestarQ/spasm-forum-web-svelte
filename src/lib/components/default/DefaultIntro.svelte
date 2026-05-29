<!--
  Even though Title, Extra, and About are specified by the server
  admin in the .env file, it's still recommended to use DOMPurify
  in case the admin has accidentally copied some malicious code
  into the .env file.
-->
<script lang="ts">
  import DOMPurify from 'dompurify';
  import { marked } from 'marked';
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';

  const appConfig = useAppConfigStore()?.getAppConfig;
  const introTitle = appConfig?.introTitle;
  const introTitleExtra = appConfig?.introTitleExtra;
  const introAbout = appConfig?.introAbout;

  const aboutHtml = introAbout
    ? (marked(introAbout, { breaks: true }) as string)
    : '';

  // Sanitize client-side only. These start empty so the server
  // render and the initial client (hydration) render match, which
  // avoids an {@html} hydration mismatch (Svelte would otherwise
  // keep the empty server value and the text would never appear).
  // The $effect fills them in after mount; DOMPurify needs a DOM,
  // so it can't run during SSR anyway.
  let titleHtml = $state('');
  let titleExtraHtml = $state('');
  let aboutHtmlSafe = $state('');
  $effect(() => {
    titleHtml = introTitle ? DOMPurify.sanitize(introTitle) : '';
    titleExtraHtml = introTitleExtra ? DOMPurify.sanitize(introTitleExtra) : '';
    aboutHtmlSafe = aboutHtml ? DOMPurify.sanitize(aboutHtml) : '';
  });
</script>

<div class="whitespace-pre-wrap">
  {#if introTitle}
    <p class="text-2xl mb-4">
      <span class="font-bold text-4xl text-colorPrimary-light dark:text-colorPrimary-dark">
        {@html titleHtml}
      </span>
      <!-- &nbsp; is one space -->
      <span>&nbsp;</span>
      {#if introTitleExtra}
        <span>{@html titleExtraHtml}</span>
      {/if}
    </p>
  {/if}
  <div>{@html aboutHtmlSafe}</div>
</div>
