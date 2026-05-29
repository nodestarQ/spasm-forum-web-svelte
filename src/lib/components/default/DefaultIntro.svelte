<!--
  Even though Title, Extra, and About are specified by the server
  admin in the .env file, it's still recommended to use DOMPurify
  in case the admin has accidentally copied some malicious code
  into the .env file.
-->
<script lang="ts">
  import { browser } from '$app/environment';
  import DOMPurify from 'dompurify';
  import { marked } from 'marked';
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';

  const appConfig = useAppConfigStore()?.getAppConfig;
  const introTitle = appConfig?.introTitle;
  const introTitleExtra = appConfig?.introTitleExtra;
  const introAbout = appConfig?.introAbout;

  const purify = (html: string): string =>
    browser ? DOMPurify.sanitize(html) : '';
  const aboutHtml = introAbout
    ? (marked(introAbout, { breaks: true }) as string)
    : '';
</script>

<div class="whitespace-pre-wrap">
  {#if introTitle}
    <p class="text-2xl mb-4">
      <span class="font-bold text-4xl text-colorPrimary-light dark:text-colorPrimary-dark">
        {@html purify(introTitle)}
      </span>
      <!-- &nbsp; is one space -->
      <span>&nbsp;</span>
      {#if introTitleExtra}
        <span>{@html purify(introTitleExtra)}</span>
      {/if}
    </p>
  {/if}
  <div>{@html purify(aboutHtml)}</div>
</div>
