<script lang="ts">
  import { onMount } from 'svelte';
  import { slide } from 'svelte/transition';
  import type { AppConfig } from '$lib/types/interfaces';
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';
  import { useNotificationStore } from '$lib/stores/useNotificationStore';
  import { useWeb3 } from '$lib/utils/useWeb3';
  import { useNostr } from '$lib/utils/useNostr';
  import { useUtils } from '$lib/utils/useUtils';
  import IconsTriangle from '$lib/components/icons/IconsTriangle.svelte';
  import IconsReset from '@lucide/svelte/icons/refresh-cw';
  import ExtraAddressIcons from '$lib/components/extra/ExtraAddressIcons.svelte';
  import ExtraFaviconsMenuItem from '$lib/components/extra/ExtraFaviconsMenuItem.svelte';

  const appConfigStore = useAppConfigStore();
  const notificationStore = useNotificationStore();
  const { isInList } = useNostr();
  const { connectedAddress, submitSingleSignedEventV2 } = useWeb3();
  const { hasValue, splitIntoArray } = useUtils();

  const admins = $derived(appConfigStore.getAppConfig?.admins);

  // ----- Field definitions (single source of truth) -----
  const BOOLEAN_FIELDS = [
    'enableShortUrlsForWeb3Actions', 'allowNewEventsWithoutSignature',
    'enableDefaultIntro', 'enableDefaultContacts', 'ifShowDevelopersInfo',
    'enableDefaultHeaderImage', 'enableDefaultButtonPrimary',
    'enableDefaultButtonSecondary', 'enableCustomIntro', 'enableCustomContacts',
    'ifShowContactsInIntro', 'ifShowIntroTutorial', 'ifShowHomeLatestComments',
    'ifShowCategoriesFilter', 'ifAllowGuestLogin', 'enableNewWeb3ActionsAll',
    'enableNewEthereumActionsAll', 'enableNewNostrActionsAll',
    'enableNewWeb3ActionsPost', 'enableNewWeb3ActionsReply',
    'enableNewWeb3ActionsReact', 'enableNewWeb3ActionsOther',
    'enableNewWeb3ActionsModerate', 'enableModeration', 'enableMarkdownInPosts',
    'enableMarkdownInComments', 'enableEmbedImageTagsForAllUsers',
    'enableEmbedImageTagsForFullLineImageLinks', 'enableEmbedImageTagsInPosts',
    'enableEmbedImageTagsInComments', 'enableEmbedVideoTagsForAllUsers',
    'enableEmbedVideoTagsForFullLineVideoLinks', 'enableEmbedVideoTagsInPosts',
    'enableEmbedVideoTagsInComments', 'enableEmbedAudioTagsForAllUsers',
    'enableEmbedAudioTagsForFullLineAudioLinks', 'enableEmbedAudioTagsInPosts',
    'enableEmbedAudioTagsInComments', 'enableWhitelistForActionPost',
    'enableWhitelistForActionReply', 'enableWhitelistForActionReact',
    'enableWhitelistForActionOther', 'enableSpasmModule',
    'enableSpasmSourcesUpdates', 'enableFederationDefaultLists',
    'enableFederationDefaultListOfficial', 'enableFederationDefaultListCrypto',
    'enableFederationDefaultListPrivacy', 'enableFederationDefaultListTech',
    'enableFederationDefaultListPolitics', 'enableFederationCustomLinks',
    'enableFederationCustomSources', 'enableRssFeedChannel'
  ] as const;

  const ARRAY_FIELDS = [
    'moderators', 'whitelistedForActionPost', 'whitelistedForActionReply',
    'whitelistedForActionReact', 'whitelistedForActionOther', 'pinnedIds',
    'envCategories', 'federationCustomLinks'
  ] as const;

  const STRING_FIELDS = [
    'faviconTheme', 'faviconLink', 'defaultHeaderImageLink',
    'introTitle', 'introTitleExtra', 'introAbout',
    'postPlaceholder', 'commentPlaceholder',
    'defaultButtonPrimaryText', 'defaultButtonPrimaryLink',
    'defaultButtonSecondaryText', 'defaultButtonSecondaryLink',
    'anotherWebsiteLink', 'ipfsLink', 'torLink', 'ipfsHttpGatewayLink',
    'nostrLink', 'sessionLink', 'simplexLink', 'statusLink', 'lensLink',
    'farcasterLink', 'blueskyLink', 'hiveLink', 'pushLink', 'mirrorLink',
    'mastodonLink', 'matrixLink', 'discordLink', 'telegramLink', 'twitterLink',
    'redditLink', 'youtubeLink', 'instagramLink', 'facebookLink', 'linkedinLink',
    'wikipediaLink', 'gitLink', 'forgejoLink', 'giteaLink', 'radicleLink',
    'gitlabLink', 'codebergLink', 'bitbucketLink', 'githubLink', 'nostrNpub',
    'sessionName', 'matrixName', 'lensName', 'farcasterName', 'blueskyName',
    'hiveName', 'pushName', 'mirrorName', 'telegramName', 'twitterName',
    'redditName', 'signalNumber', 'whatsappNumber', 'xmppName', 'uniswapLink',
    'sushiswapLink', 'etherscanLink', 'ethvmLink', 'coingeckoLink',
    'coinmarketcapLink', 'dextoolsLink', 'dexscreenerLink', 'birdeyeLink',
    'geckoterminalLink', 'extraContactInfo', 'rssFeedChannelTitle',
    'rssFeedChannelLink', 'rssFeedChannelDescription', 'rssFeedChannelImageLink'
  ] as const;

  const NUMBER_FIELDS = [
    'shortUrlsLengthOfWeb3Ids', 'feedFiltersActivityHot',
    'feedFiltersActivityRising'
  ] as const;

  // Color key -> [CSS variable, default value]. Drives the form
  // fields, applyTheme(), and setColorsToDefault().
  const COLOR_CSS: Record<string, [string, string]> = {
    colorPrimaryLight: ['--color-primary-light', '#f420af'],
    colorPrimaryDark: ['--color-primary-dark', '#f420af'],
    colorBaseLight: ['--color-base-light', '#000000'],
    colorBaseDark: ['--color-base-dark', '#d8d8d8'],
    colorSecondaryLight: ['--color-secondary-light', '#000000'],
    colorSecondaryDark: ['--color-secondary-dark', '#ffffff'],
    colorHoverLight: ['--color-hover-light', '#243746'],
    colorHoverDark: ['--color-hover-dark', '#cbd4d1'],
    colorNotImportantLight: ['--color-not-important-light', '#9b8bc6'],
    colorNotImportantDark: ['--color-not-important-dark', '#706297'],
    colorGreenLight: ['--color-green-light', '#089703'],
    colorGreenDark: ['--color-green-dark', '#0ad203'],
    colorRedLight: ['--color-red-light', '#ff0a0a'],
    colorRedDark: ['--color-red-dark', '#ff0a0a'],
    colorOrangeLight: ['--color-orange-light', '#f4af0c'],
    colorOrangeDark: ['--color-orange-dark', '#f4af0c'],
    colorBlueLight: ['--color-blue-light', '#3a3dff'],
    colorBlueDark: ['--color-blue-dark', '#3a3dff'],
    bgBaseLight: ['--bg-base-light', '#fafafa'],
    bgBaseDark: ['--bg-base-dark', '#0F0F0F'],
    bgSecondaryLight: ['--bg-secondary-light', '#f0f0f0'],
    bgSecondaryDark: ['--bg-secondary-dark', '#181818'],
    bgHoverLight: ['--bg-hover-light', '#e3e3e3'],
    bgHoverDark: ['--bg-hover-dark', '#1f1f1f'],
    bgDarkLight: ['--bg-dark-light', '#bbbbbb'],
    bgDarkDark: ['--bg-dark-dark', '#000000'],
    borderColorLight: ['--border-color-light', '#dddddd'],
    borderColorDark: ['--border-color-dark', '#312d3e']
  };
  const COLOR_FIELDS = Object.keys(COLOR_CSS);

  // Build the editable form from a config, coercing each field to
  // the type its input control needs.
  const makeForm = (c?: AppConfig | null): Record<string, any> => {
    const src = c as Record<string, any> | undefined | null;
    const f: Record<string, any> = {};
    for (const k of BOOLEAN_FIELDS) f[k] = src?.[k] ?? false;
    for (const k of STRING_FIELDS) f[k] = src?.[k] ?? '';
    for (const k of COLOR_FIELDS) f[k] = src?.[k] ?? null;
    for (const k of ARRAY_FIELDS) {
      f[k] = (Array.isArray(src?.[k]) ? src?.[k] : []).join(',');
    }
    for (const k of NUMBER_FIELDS) f[k] = src?.[k] ?? null;
    return f;
  };

  const pickColors = (src: Record<string, any>): Record<string, any> => {
    const out: Record<string, any> = {};
    for (const k of COLOR_FIELDS) out[k] = src[k] ?? null;
    return out;
  };

  let form: Record<string, any> = $state(makeForm(appConfigStore.getAppConfig));
  let savedTheme: Record<string, any> = $state(pickColors(form));

  let isResponseError = $state(false);
  let responseMessage = $state('');

  // ----- Section toggles (UI only) -----
  let showHomePage = $state(false);
  let showTheme = $state(false);
  let showAdvancedColors = $state(false);
  let showSocialMediaLinks = $state(false);
  let showSocialMediaNames = $state(false);
  let showBlockchainLinks = $state(false);
  let showFeedSettings = $state(false);
  let showOther = $state(false);
  let showNewContent = $state(false);
  let showMediaContent = $state(false);
  let showRssFeedChannel = $state(false);
  let showFederation = $state(false);

  // ----- Favicons -----
  const favicons = [
    'custom-link', 'spasm', 'monero', 'zcash', 'ethereum', 'bitcoin', 'solana',
    'campfire', 'chat', 'cube', 'research', 'rocket', 'roger', 'default'
  ];
  let faviconDropDownShown = $state(false);
  const toggleFaviconDropDown = () => {
    faviconDropDownShown = !faviconDropDownShown;
  };

  const ensureHtmlLink = (selector: string, createAttrs: Record<string, string>) => {
    let link = document.head.querySelector(selector) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement('link');
      for (const [k, v] of Object.entries(createAttrs)) link.setAttribute(k, v);
      document.head.appendChild(link);
    }
    return link;
  };

  const updateFaviconInBrowserTab = (faviconValue?: string) => {
    if (!faviconValue || typeof faviconValue !== 'string') return;
    const href = faviconValue;
    const icon = ensureHtmlLink("link[rel='icon']", { rel: 'icon', type: 'image/x-icon' });
    icon.type = 'image/x-icon';
    icon.href = href;
    const shortcut = ensureHtmlLink("link[rel='shortcut icon']", { rel: 'shortcut icon' });
    shortcut.href = href;
    const apple = ensureHtmlLink("link[rel='apple-touch-icon'][sizes='512x512']", {
      rel: 'apple-touch-icon',
      sizes: '512x512'
    });
    apple.href = href;
  };

  const selectFavicon = (newFavicon: string): void => {
    form.faviconTheme = newFavicon.toLowerCase();
    toggleFaviconDropDown();
    const faviconMap: Record<string, string> = {
      spasm: '/favicons/spasm.ico',
      monero: '/favicons/monero.ico',
      zcash: '/favicons/zcash.ico',
      ethereum: '/favicons/ethereum.ico',
      bitcoin: '/favicons/bitcoin.ico',
      solana: '/favicons/solana.ico',
      'custom-link': form.faviconLink,
      campfire: '/favicons/campfire.ico',
      chat: '/favicons/chat.ico',
      cube: '/favicons/cube.ico',
      research: '/favicons/research.ico',
      rocket: '/favicons/rocket.ico',
      roger: '/favicons/roger.ico',
      default: '/favicon.ico'
    };
    updateFaviconInBrowserTab(faviconMap[newFavicon] ?? faviconMap.default);
  };

  // ----- Themes -----
  const themes = ['Spasm', 'DarkVegas', 'Neon', 'Greeny', 'Custom'];
  let theme = $state('Custom');
  let themeDropDownShown = $state(false);
  const toggleThemeDropDown = () => {
    themeDropDownShown = !themeDropDownShown;
  };

  const setColors = (values: Record<string, string | null>) => {
    for (const k of COLOR_FIELDS) {
      if (k in values) form[k] = values[k];
    }
  };

  const resetColorsToSavedTheme = () => {
    for (const k of COLOR_FIELDS) form[k] = savedTheme[k];
    theme = 'Custom';
  };

  const setColorsToNull = () => {
    for (const k of COLOR_FIELDS) form[k] = null;
  };

  const setColorsToDefault = () => {
    for (const k of COLOR_FIELDS) form[k] = COLOR_CSS[k][1];
  };

  const setThemeSpasm = () => {
    setColorsToDefault();
    setColors({ colorPrimaryLight: '#f420af', colorPrimaryDark: '#f420af' });
  };
  const setThemeDarkVegas = () => {
    setColorsToDefault();
    setColors({
      colorPrimaryLight: '#ff0000', colorPrimaryDark: '#ff0000',
      bgBaseLight: '#f6f5f4', bgBaseDark: '#000000',
      bgSecondaryLight: '#eeeeee', bgSecondaryDark: '#080808'
    });
  };
  const setThemeNeon = () => {
    setColorsToDefault();
    setColors({
      colorPrimaryLight: '#f420af', colorPrimaryDark: '#f420af',
      colorBaseLight: '#613583', colorBaseDark: '#f5c211',
      colorNotImportantLight: '#1a5fb4', colorNotImportantDark: '#1a5fb4',
      bgBaseLight: '#f6f5f4', bgBaseDark: '#000000',
      bgSecondaryLight: '#eeeeee', bgSecondaryDark: '#080808'
    });
  };
  const setThemeGreeny = () => {
    setColorsToDefault();
    setColors({
      colorPrimaryLight: '#e5c46b', colorPrimaryDark: '#e5c46b',
      colorNotImportantLight: '#4fb848', colorNotImportantDark: '#4fb848',
      bgBaseDark: '#161616', bgSecondaryDark: '#1a1a1a'
    });
  };

  const selectTheme = (newTheme: string): void => {
    theme = newTheme;
    toggleThemeDropDown();
    if (newTheme === 'Spasm') setThemeSpasm();
    if (newTheme === 'DarkVegas') setThemeDarkVegas();
    if (newTheme === 'Neon') setThemeNeon();
    if (newTheme === 'Greeny') setThemeGreeny();
    if (newTheme === 'Custom') resetColorsToSavedTheme();
  };

  const applyTheme = () => {
    const root = document.documentElement;
    for (const k of COLOR_FIELDS) {
      const [varName, def] = COLOR_CSS[k];
      root.style.setProperty(varName, form[k] || def);
    }
  };

  const count = (list: any): number => {
    if (!list) return 0;
    if (Array.isArray(list) && list.length) return list.length;
    if (typeof list === 'string') {
      if (typeof list.split(',')?.length === 'number') return list.split(',').length;
    }
    return 0;
  };

  // Live theme preview as colors change.
  $effect(() => {
    applyTheme();
  });

  // Always load the freshest config into the form so an admin
  // never overwrites the saved config with stale defaults.
  onMount(async () => {
    await appConfigStore.fetchAndUpdateAppConfig();
    const c = appConfigStore.getAppConfig;
    form = makeForm(c);
    savedTheme = pickColors(form);
  });

  const saveAppConfig = async () => {
    try {
      isResponseError = false;
      responseMessage = '';

      const newAppConfig: AppConfig = {};
      const out = newAppConfig as Record<string, any>;

      for (const k of BOOLEAN_FIELDS) out[k] = form[k];
      for (const k of ARRAY_FIELDS) out[k] = splitIntoArray(form[k]);
      for (const k of STRING_FIELDS) {
        if (typeof form[k] === 'string') out[k] = form[k];
      }
      // Colors: skip nulls so "delete all custom colors" omits them.
      for (const k of COLOR_FIELDS) {
        if (form[k] != null && typeof form[k] === 'string') out[k] = form[k];
      }
      // Numbers: accept finite numbers (or numeric strings).
      for (const k of NUMBER_FIELDS) {
        const raw = form[k];
        if (raw == null) continue;
        const num = typeof raw === 'number' ? raw : Number(raw);
        if (Number.isFinite(num)) out[k] = num;
      }

      if (!hasValue(newAppConfig)) return;
      const text = JSON.stringify(newAppConfig);

      notificationStore.showNotification('Submitting', 'note', 3000);
      const response = await submitSingleSignedEventV2('app-config-dr', text, '', '');
      if (!response) {
        responseMessage = 'Something went wrong. Try again.';
        isResponseError = true;
        return;
      }
      const { res } = response;
      if (res && typeof res === 'string') {
        responseMessage = res;
        if (res.toLowerCase().startsWith('error')) {
          isResponseError = true;
          notificationStore.showNotification('Something went wrong', 'error', 6000);
          return;
        } else if (res.toLowerCase().startsWith('success')) {
          await appConfigStore.fetchAndUpdateAppConfig();
          notificationStore.showNotification('Success: config is saved', 'success', 8000);
          return;
        }
      }
    } catch (error) {
      console.error('Error saving app config:', error);
      responseMessage = 'Something went wrong...';
      isResponseError = true;
      return;
    }
  };
</script>

<div class="overflow-auto overflow-wrap wrap-break-word">
  <div class="mt-4">
    <div class="my-4">
      <div>
        Connected address:
        <a
          href={`/authors/${connectedAddress.value}`}
          class="text-colorPrimary-light dark:text-colorPrimary-dark hover:underline"
        >
          {connectedAddress.value}
        </a>
        {#if connectedAddress.value}
          <ExtraAddressIcons
            value={connectedAddress.value}
            showCopyToClipboard={true}
            showQrCode={true}
            showExternalWebsite={true}
          />
        {/if}
      </div>
      {#if connectedAddress.value && typeof connectedAddress.value === 'string' && isInList(connectedAddress.value, admins)}
        <div class="mb-6">
          <div>You're an admin on this instance.</div>
          <div class="mb-4">
            You can change settings and save them by signing an admin event with your
            private key.
          </div>
          <button
            onclick={() => saveAppConfig()}
            class="inline px-6 lg:min-w-[200px] min-h-[40px] text-colorPrimary-light dark:text-colorPrimary-dark border-2 border-colorPrimary-light dark:border-colorPrimary-dark rounded-lg hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
          >
            Save app config
          </button>
        </div>
      {:else if connectedAddress.value && typeof connectedAddress.value === 'string' && !isInList(connectedAddress.value, admins)}
        <div>
          <div>You're not an admin on this instance.</div>
          <div class="mb-4">
            You can play around with theme, favicons, etc., but only admins can save
            config.
          </div>
        </div>
      {:else}
        <div>
          <div>Connect your extension with admin keys to save config changes.</div>
          <div>
            <div>There are many Ethereum and Nostr apps, here are a few examples:</div>
            <div>
              <div>
                <span class="text-colorNotImportant-light dark:colorNotImportant-dark">Firefox:</span>
                <span>nos2x-fox, MetaMask</span>
              </div>
              <div>
                <span class="text-colorNotImportant-light dark:colorNotImportant-dark">Chrome/Brave:</span>
                <span>Rabby, MetaMask, nos2x</span>
              </div>
              <div>
                <span class="text-colorNotImportant-light dark:colorNotImportant-dark">Tor Browser:</span>
                <span>nos2-fox</span>
              </div>
              <div>
                <span class="text-colorNotImportant-light dark:colorNotImportant-dark">Desktop:</span>
                <span>Status app</span>
              </div>
              <div>
                <span class="text-colorNotImportant-light dark:colorNotImportant-dark">Mobile:</span>
                <span>MetaMask</span>
              </div>
            </div>
          </div>
        </div>
      {/if}
      <div class={isResponseError ? 'text-colorRed-light dark:text-colorRed-dark' : 'text-colorGreen-light dark:text-colorGreen-dark'}>
        {responseMessage}
      </div>
    </div>

    <!-- Theme -->
    <div class="admin-card {showTheme ? 'admin-card-open' : ''}">
      <button type="button" class="admin-card-header" onclick={() => (showTheme = !showTheme)}>
        <span>Theme</span>
        <IconsTriangle rotateIf={showTheme} />
      </button>

    {#if showTheme}
      <div transition:slide={{ duration: 250 }} class="admin-card-body">
        <!-- Favicons -->
        <div class="mt-0 mb-4">
          <div class="mt-2">
            <span onclick={() => toggleFaviconDropDown()} class="cursor-pointer">
              Favicon:
              <span class="font-bold text-colorPrimary-light dark:text-colorPrimary-dark">{form.faviconTheme}</span>
              <IconsTriangle rotateIf={faviconDropDownShown} />
            </span>
          </div>

          {#if faviconDropDownShown}
            <div transition:slide={{ duration: 250 }} class="ml-16 pl-1 py-1 bg-bgSecondary-light dark:bg-bgSecondary-dark rounded-md shadow-md w-28">
              {#each favicons as favicon}
                <ExtraFaviconsMenuItem {favicon} onclick={() => selectFavicon(favicon)} />
              {/each}
            </div>
          {/if}

          {#if form.faviconTheme === 'custom-link'}
            <div class="ml-5">
              Favicon custom-link:
              <input bind:value={form.faviconLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" />
              <div class="text-colorNotImportant-light text-colorNotImportant-dark">
                (Save and refresh the page to see new custom favicon)
              </div>
            </div>
          {/if}
        </div>

        <div>
          <div class="mt-3 mb-0">
            <span class="mr-2">Colors:</span>
            <span onclick={() => toggleThemeDropDown()} class="text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer">
              <span class="font-bold text-colorPrimary-light dark:text-colorPrimary-dark">{theme}</span>
              <IconsTriangle rotateIf={themeDropDownShown} />
            </span>
          </div>

          {#if themeDropDownShown}
            <div transition:slide={{ duration: 250 }} class="ml-16 pl-1 py-1 bg-bgSecondary-light dark:bg-bgSecondary-dark rounded-md shadow-md w-28">
              {#each themes as themeName}
                <div
                  class="py-1 font-bold text-colorNotImportant-light dark:text-colorNotImportant-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer"
                  onclick={() => selectTheme(themeName)}
                >
                  {themeName}
                </div>
              {/each}
            </div>
          {/if}

          <div class="mt-2 mb-2">
            <span class="ml-0 text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" onclick={() => resetColorsToSavedTheme()}>
              <IconsReset class="custom-icons" />
              Reset theme
            </span>
          </div>
        </div>

        <div>
          <span class="hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark cursor-pointer" onclick={() => (showAdvancedColors = !showAdvancedColors)}>
            Advanced colors
            <IconsTriangle rotateIf={showAdvancedColors} />
          </span>
        </div>

        {#if showAdvancedColors}
          <div transition:slide={{ duration: 250 }} class="pl-4">
            <div class="mt-2 ml-5">
              <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
                For each color you can specify values for dark and light themes
              </div>
              <div class="mt-2 mb-2">
                <span class="ml-0 text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" onclick={() => setColorsToNull()}>
                  <IconsReset class="custom-icons" />
                  Click to delete all custom colors
                  <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">(don't forget to save config)</span>
                </span>
              </div>
              <div>Primary color (light): <input bind:value={form.colorPrimaryLight} type="color" class="custom-color-picker" /> {form.colorPrimaryLight}</div>
              <div>Primary color (dark): <input bind:value={form.colorPrimaryDark} type="color" class="custom-color-picker" /> {form.colorPrimaryDark}</div>
              <div>Base color (light): <input bind:value={form.colorBaseLight} type="color" class="custom-color-picker" /> {form.colorBaseLight}</div>
              <div>Base color (dark): <input bind:value={form.colorBaseDark} type="color" class="custom-color-picker" /> {form.colorBaseDark}</div>
              <div>Secondary color (light): <input bind:value={form.colorSecondaryLight} type="color" class="custom-color-picker" /> {form.colorSecondaryLight}</div>
              <div>Secondary color (dark): <input bind:value={form.colorSecondaryDark} type="color" class="custom-color-picker" /> {form.colorSecondaryDark}</div>
              <div>Hover color (light): <input bind:value={form.colorHoverLight} type="color" class="custom-color-picker" /> {form.colorHoverLight}</div>
              <div>Hover color (dark): <input bind:value={form.colorHoverDark} type="color" class="custom-color-picker" /> {form.colorHoverDark}</div>
              <div>Not important color (light): <input bind:value={form.colorNotImportantLight} type="color" class="custom-color-picker" /> {form.colorNotImportantLight}</div>
              <div>Not important color (dark): <input bind:value={form.colorNotImportantDark} type="color" class="custom-color-picker" /> {form.colorNotImportantDark}</div>
              <div>Green color (light): <input bind:value={form.colorGreenLight} type="color" class="custom-color-picker" /> {form.colorGreenLight}</div>
              <div>Green color (dark): <input bind:value={form.colorGreenDark} type="color" class="custom-color-picker" />{form.colorGreenDark}</div>
              <div>Red color (light): <input bind:value={form.colorRedLight} type="color" class="custom-color-picker" /> {form.colorRedLight}</div>
              <div>Red color (dark): <input bind:value={form.colorRedDark} type="color" class="custom-color-picker" /> {form.colorRedDark}</div>
              <div>Orange color (light): <input bind:value={form.colorOrangeLight} type="color" class="custom-color-picker" /> {form.colorOrangeLight}</div>
              <div>Orange color (dark): <input bind:value={form.colorOrangeDark} type="color" class="custom-color-picker" /> {form.colorOrangeDark}</div>
              <div>Blue color (light): <input bind:value={form.colorBlueLight} type="color" class="custom-color-picker" /> {form.colorBlueLight}</div>
              <div>Blue color (dark): <input bind:value={form.colorBlueDark} type="color" class="custom-color-picker" /> {form.colorBlueDark}</div>
              <div>Background Base (light): <input bind:value={form.bgBaseLight} type="color" class="custom-color-picker" /> {form.bgBaseLight}</div>
              <div>Background Base (dark): <input bind:value={form.bgBaseDark} type="color" class="custom-color-picker" /> {form.bgBaseDark}</div>
              <div>Background Secondary (light): <input bind:value={form.bgSecondaryLight} type="color" class="custom-color-picker" /> {form.bgSecondaryLight}</div>
              <div>Background Secondary (dark): <input bind:value={form.bgSecondaryDark} type="color" class="custom-color-picker" /> {form.bgSecondaryDark}</div>
              <div>Background Hover (light): <input bind:value={form.bgHoverLight} type="color" class="custom-color-picker" /> {form.bgHoverLight}</div>
              <div>Background Hover (dark): <input bind:value={form.bgHoverDark} type="color" class="custom-color-picker" /> {form.bgHoverDark}</div>
              <div>Background Dark (light): <input bind:value={form.bgDarkLight} type="color" class="custom-color-picker" /> {form.bgDarkLight}</div>
              <div>Background Dark (dark): <input bind:value={form.bgDarkDark} type="color" class="custom-color-picker" /> {form.bgDarkDark}</div>
              <div>Border color (light): <input bind:value={form.borderColorLight} type="color" class="custom-color-picker" /> {form.borderColorLight}</div>
              <div>Border color (dark): <input bind:value={form.borderColorDark} type="color" class="custom-color-picker" /> {form.borderColorDark}</div>

              <div class="mt-2 mb-2">
                <span class="ml-0 text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" onclick={() => resetColorsToSavedTheme()}>
                  <IconsReset class="custom-icons" />
                  Reset colors
                </span>
              </div>
            </div>
          </div>
        {/if}

        <div class="mt-2 mb-6">
          <span class="ml-0 text-xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" onclick={() => (showTheme = !showTheme)}>
            hide section
            <IconsTriangle rotateIf={showTheme} />
          </span>
        </div>
      </div>
    {/if}
    </div>

    <!-- Home page -->
    <div class="admin-card {showHomePage ? 'admin-card-open' : ''}">
      <button type="button" class="admin-card-header" onclick={() => (showHomePage = !showHomePage)}>
        <span>Home page</span>
        <IconsTriangle rotateIf={showHomePage} />
      </button>

    {#if showHomePage}
      <div transition:slide={{ duration: 250 }} class="admin-card-body">
        <div class="pl-0 mt-2">
          <div class="pl-0 mt-2">
            <input bind:checked={form.enableDefaultHeaderImage} type="checkbox" />
            Enable header image
          </div>
          {#if form.enableDefaultHeaderImage}
            <div class="ml-5">
              Header image link:
              <input bind:value={form.defaultHeaderImageLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" />
            </div>
            <div class="ml-5 text-colorNotImportant-light text-colorNotImportant-dark">
              Option 1: add full URL to image file (.jpeg, .jpg, .png, .webp, .svg) <br />
              Option 2: leave URL field blank and upload your jpeg image to
              <code>static/header.jpeg</code> (only jpeg supported, docker/podman deployment not supported).
            </div>
          {/if}
        </div>
        <div class="pl-0 mt-4">
          <input bind:checked={form.enableDefaultIntro} type="checkbox" />
          Enable intro section: title, extra, about
          <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">(also used for meta)</span>
          {#if form.enableDefaultIntro}
            <div class="ml-5">
              <div>
                Intro title
                <input bind:value={form.introTitle} type="text" placeholder="enter intro title (e.g., Spasm)" class="custom-admin-input-socials" />
              </div>
              <div>
                Intro title extra
                <input bind:value={form.introTitleExtra} type="text" placeholder="enter intro title extra (e.g., forum)" class="custom-admin-input-socials" />
              </div>
              <div>
                Intro about
                <input bind:value={form.introAbout} type="text" placeholder="enter intro about (e.g., Unplug from slave tech!)" class="custom-admin-input-socials" />
              </div>
            </div>
          {/if}
        </div>
        <div class="pl-0 mt-4">
          <input bind:checked={form.enableDefaultContacts} type="checkbox" />
          Enable contacts
          {#if form.enableDefaultContacts}
            <div class="ml-5 pl-0">
              <input bind:checked={form.ifShowContactsInIntro} type="checkbox" />
              And show contacts in intro section
              <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
                (if disabled, contacts will be shown only at
                <a class="cursor-pointer text-colorPrimary-light dark:text-colorPrimary-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" href="/contacts">/contacts</a>
                page)
              </span>
            </div>
          {/if}
        </div>
        <div class="mt-6">
          <div class="pl-0">
            <input bind:checked={form.enableDefaultButtonPrimary} type="checkbox" />
            Enable button primary
          </div>
          {#if form.enableDefaultButtonPrimary}
            <div class="ml-5">Primary button link: <input bind:value={form.defaultButtonPrimaryLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
            <div class="ml-5">Primary button text: <input bind:value={form.defaultButtonPrimaryText} type="text" placeholder="enter button text (e.g., Get started)" class="custom-admin-input-socials" /></div>
          {/if}
          <div class="mt-2 pl-0">
            <input bind:checked={form.enableDefaultButtonSecondary} type="checkbox" />
            Enable button secondary
          </div>
          {#if form.enableDefaultButtonSecondary}
            <div class="ml-5">Secondary button link: <input bind:value={form.defaultButtonSecondaryLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
            <div class="ml-5">Secondary button text: <input bind:value={form.defaultButtonSecondaryText} type="text" placeholder="enter button text (e.g., Read docs)" class="custom-admin-input-socials" /></div>
          {/if}
        </div>
        <div class="mt-2 pl-0">
          <input bind:checked={form.ifShowIntroTutorial} type="checkbox" />
          Show intro tutorial
          <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">(tutorial like "connect your wallet, read what you sign, etc.")</span>
        </div>
        <div class="mt-2 pl-0">
          <input bind:checked={form.ifShowHomeLatestComments} type="checkbox" />
          Show latest comments
        </div>
        <h5 class="mt-4">Custom pages</h5>
        <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">(not supported via docker/podman deployment)</span>
        <div class="ml-5">
          <div class="pl-0">
            <input bind:checked={form.enableCustomIntro} type="checkbox" />
            Enable custom intro page
          </div>
          <div class="pl-0">
            <input bind:checked={form.enableCustomContacts} type="checkbox" />
            Enable custom contacts page
          </div>
        </div>

        <div class="mt-2 mb-6">
          <span class="ml-4 text-xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" onclick={() => (showHomePage = !showHomePage)}>
            hide section
            <IconsTriangle rotateIf={showHomePage} />
          </span>
        </div>
      </div>
    {/if}
    </div>

    <!-- Social media links -->
    <div class="admin-card {showSocialMediaLinks ? 'admin-card-open' : ''}">
      <button type="button" class="admin-card-header" onclick={() => (showSocialMediaLinks = !showSocialMediaLinks)}>
        <span>Social media links</span>
        <IconsTriangle rotateIf={showSocialMediaLinks} />
      </button>

    {#if showSocialMediaLinks}
      <div transition:slide={{ duration: 250 }} class="admin-card-body">
        <div>Another website: <input bind:value={form.anotherWebsiteLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>IPFS: <input bind:value={form.ipfsLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Tor: <input bind:value={form.torLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>IPFS HTTP gateway link: <input bind:value={form.ipfsHttpGatewayLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Nostr: <input bind:value={form.nostrLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Session: <input bind:value={form.sessionLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>SimpleX: <input bind:value={form.simplexLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Status: <input bind:value={form.statusLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Lens: <input bind:value={form.lensLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Farcaster: <input bind:value={form.farcasterLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Bluesky: <input bind:value={form.blueskyLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Hive: <input bind:value={form.hiveLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Push: <input bind:value={form.pushLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Mirror: <input bind:value={form.mirrorLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Mastodon: <input bind:value={form.mastodonLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Matrix: <input bind:value={form.matrixLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Discord: <input bind:value={form.discordLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Telegram: <input bind:value={form.telegramLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Twitter: <input bind:value={form.twitterLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Reddit: <input bind:value={form.redditLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Youtube: <input bind:value={form.youtubeLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Instagram: <input bind:value={form.instagramLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Facebook: <input bind:value={form.facebookLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>LinkedIn: <input bind:value={form.linkedinLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Wikipedia: <input bind:value={form.wikipediaLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Git: <input bind:value={form.gitLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Forgejo: <input bind:value={form.forgejoLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Gitea: <input bind:value={form.giteaLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Radicle: <input bind:value={form.radicleLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>GitLab: <input bind:value={form.gitlabLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Codeberg: <input bind:value={form.codebergLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Bitbucket: <input bind:value={form.bitbucketLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>GitHub: <input bind:value={form.githubLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div class="mt-2 mb-6">
          <span class="ml-4 text-xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" onclick={() => (showSocialMediaLinks = !showSocialMediaLinks)}>
            hide section
            <IconsTriangle rotateIf={showSocialMediaLinks} />
          </span>
        </div>
      </div>
    {/if}
    </div>

    <!-- Social media names -->
    <div class="admin-card {showSocialMediaNames ? 'admin-card-open' : ''}">
      <button type="button" class="admin-card-header" onclick={() => (showSocialMediaNames = !showSocialMediaNames)}>
        <span>Social media names</span>
        <IconsTriangle rotateIf={showSocialMediaNames} />
      </button>

    {#if showSocialMediaNames}
      <div transition:slide={{ duration: 250 }} class="admin-card-body">
        <div>Nostr npub: <input bind:value={form.nostrNpub} type="text" placeholder="enter npub" class="custom-admin-input-socials" /></div>
        <div>Session: <input bind:value={form.sessionName} type="text" placeholder="enter username" class="custom-admin-input-socials" /></div>
        <div>Matrix: <input bind:value={form.matrixName} type="text" placeholder="enter username" class="custom-admin-input-socials" /></div>
        <div>Lens: <input bind:value={form.lensName} type="text" placeholder="enter username" class="custom-admin-input-socials" /></div>
        <div>Farcaster: <input bind:value={form.farcasterName} type="text" placeholder="enter username" class="custom-admin-input-socials" /></div>
        <div>Bluesky: <input bind:value={form.blueskyName} type="text" placeholder="enter username" class="custom-admin-input-socials" /></div>
        <div>Hive: <input bind:value={form.hiveName} type="text" placeholder="enter username" class="custom-admin-input-socials" /></div>
        <div>Push: <input bind:value={form.pushName} type="text" placeholder="enter username" class="custom-admin-input-socials" /></div>
        <div>Mirror: <input bind:value={form.mirrorName} type="text" placeholder="enter username" class="custom-admin-input-socials" /></div>
        <div>Telegram: <input bind:value={form.telegramName} type="text" placeholder="enter username" class="custom-admin-input-socials" /></div>
        <div>Twitter: <input bind:value={form.twitterName} type="text" placeholder="enter username" class="custom-admin-input-socials" /></div>
        <div>Reddit: <input bind:value={form.redditName} type="text" placeholder="enter username" class="custom-admin-input-socials" /></div>
        <div>Signal: <input bind:value={form.signalNumber} type="text" placeholder="enter username or number" class="custom-admin-input-socials" /></div>
        <div>Whatsapp: <input bind:value={form.whatsappNumber} type="text" placeholder="enter number" class="custom-admin-input-socials" /></div>
        <div>XMPP: <input bind:value={form.xmppName} type="text" placeholder="enter username" class="custom-admin-input-socials" /></div>
        <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">Note: extra info supports markdown, but not <code>\n</code></div>
        <div>Extra info: <textarea bind:value={form.extraContactInfo} placeholder="enter any extra info (markdown links supported)" class="block p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[700px] h-60 lg:h-36 focus:outline-hidden rounded-b-lg border-2"></textarea></div>
        <div class="mt-2 mb-6">
          <span class="ml-4 text-xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" onclick={() => (showSocialMediaNames = !showSocialMediaNames)}>
            hide section
            <IconsTriangle rotateIf={showSocialMediaNames} />
          </span>
        </div>
      </div>
    {/if}
    </div>

    <!-- Blockchain links -->
    <div class="admin-card {showBlockchainLinks ? 'admin-card-open' : ''}">
      <button type="button" class="admin-card-header" onclick={() => (showBlockchainLinks = !showBlockchainLinks)}>
        <span>Blockchain links</span>
        <IconsTriangle rotateIf={showBlockchainLinks} />
      </button>

    {#if showBlockchainLinks}
      <div transition:slide={{ duration: 250 }} class="admin-card-body">
        <div>Uniswap: <input bind:value={form.uniswapLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Sushiswap: <input bind:value={form.sushiswapLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Etherscan: <input bind:value={form.etherscanLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Ethvm: <input bind:value={form.ethvmLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Coingecko: <input bind:value={form.coingeckoLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Coinmarketcap: <input bind:value={form.coinmarketcapLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Dextools: <input bind:value={form.dextoolsLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Dexscreener: <input bind:value={form.dexscreenerLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>Birdeye: <input bind:value={form.birdeyeLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div>GeckoTerminal: <input bind:value={form.geckoterminalLink} type="text" placeholder="enter full link with https://" class="custom-admin-input-socials" /></div>
        <div class="mt-2 mb-6">
          <span class="ml-4 text-xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" onclick={() => (showBlockchainLinks = !showBlockchainLinks)}>
            hide section
            <IconsTriangle rotateIf={showBlockchainLinks} />
          </span>
        </div>
      </div>
    {/if}
    </div>

    <!-- Feed settings -->
    <div class="admin-card {showFeedSettings ? 'admin-card-open' : ''}">
      <button type="button" class="admin-card-header" onclick={() => (showFeedSettings = !showFeedSettings)}>
        <span>Feed settings</span>
        <IconsTriangle rotateIf={showFeedSettings} />
      </button>

    {#if showFeedSettings}
      <div transition:slide={{ duration: 250 }} class="admin-card-body">
        <h5 class="mt-2">Feed activity filters</h5>
        <div class="ml-5">
          <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
            Hot/rising activity filter is based on reaction volume (upvote, downvote, etc.).
          </div>
          <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">
            Consider increasing thresholds if your instance has many users eligible to submit reactions.
          </div>
          <div>The amount of reactions for "Hot" filter: <input bind:value={form.feedFiltersActivityHot} type="number" placeholder="choose a number" class="custom-admin-input-socials-tiny" /></div>
          <div>The amount of reactions for "Rising" filter: <input bind:value={form.feedFiltersActivityRising} type="number" placeholder="choose a number" class="custom-admin-input-socials-tiny" /></div>
        </div>
        <h5 class="mt-2">Feed categories filters</h5>
        <div class="mt-2 ml-5">
          <input bind:checked={form.ifShowCategoriesFilter} type="checkbox" />
          show categories filter
        </div>
        <div class="mt-4 ml-5">
          Categories ({count(form.envCategories)})
          <textarea bind:value={form.envCategories} placeholder="defi,privacy,tech,memes" class="block p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[700px] h-24 lg:h-24 focus:outline-hidden rounded-b-lg border-2"></textarea>
        </div>

        <div class="mt-2 mb-6">
          <span class="ml-4 text-xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" onclick={() => (showFeedSettings = !showFeedSettings)}>
            hide section
            <IconsTriangle rotateIf={showFeedSettings} />
          </span>
        </div>
      </div>
    {/if}
    </div>

    <!-- Other -->
    <div class="admin-card {showOther ? 'admin-card-open' : ''}">
      <button type="button" class="admin-card-header" onclick={() => (showOther = !showOther)}>
        <span>Other</span>
        <IconsTriangle rotateIf={showOther} />
      </button>

    {#if showOther}
      <div transition:slide={{ duration: 250 }} class="admin-card-body">
        <div>
          <input bind:checked={form.enableShortUrlsForWeb3Actions} type="checkbox" />
          enable short URLs for Spasm IDs (recommended length is 30+ chars)
          <div class="ml-5">Short URL length: <input bind:value={form.shortUrlsLengthOfWeb3Ids} type="number" placeholder="choose a number" class="custom-admin-input-socials" /></div>
        </div>
        <div class="pl-0 mt-4">
          <input bind:checked={form.ifShowDevelopersInfo} type="checkbox" />
          Show developers info at
          <a class="cursor-pointer text-colorPrimary-light dark:text-colorPrimary-dark hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" href="/contacts">/contacts</a>
          page
          <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">(powered by Spasm)</span>
        </div>
        <div class="mt-2 mb-6">
          <span class="ml-4 text-xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" onclick={() => (showOther = !showOther)}>
            hide section
            <IconsTriangle rotateIf={showOther} />
          </span>
        </div>
      </div>
    {/if}
    </div>

    <!-- New content -->
    <div class="admin-card {showNewContent ? 'admin-card-open' : ''}">
      <button type="button" class="admin-card-header" onclick={() => (showNewContent = !showNewContent)}>
        <span>New Content</span>
        <IconsTriangle rotateIf={showNewContent} />
      </button>

    {#if showNewContent}
      <div transition:slide={{ duration: 250 }} class="admin-card-body">
        <div class="hidden mt-2 pl-4">
          RSS module:
          <div class="pl-4">
            <input bind:checked={form.allowNewEventsWithoutSignature} type="checkbox" />
            allow new events without signature (e.g., RSS posts)
          </div>
        </div>
        <div class="mt-4 pl-4">
          Pinned events at the top of the news feed:
          <div>
            List of Spasm IDs of pinned events
            ({count(form.pinnedIds)})
            <textarea bind:value={form.pinnedIds} placeholder="0x123456789" class="block p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[700px] h-60 lg:h-36 focus:outline-hidden rounded-b-lg border-2"></textarea>
          </div>
        </div>
        <div class="mt-4 pl-4">
          Connect button:
          <div class="ml-5">
            <input bind:checked={form.ifAllowGuestLogin} type="checkbox" />
            allow "log in as guest"
            <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">(uses browser-generated temporary Ethereum keys)</span>
          </div>
        </div>
        <div class="mt-4 pl-4">
          Enable private keys:
          <div class="ml-5">
            <div><input bind:checked={form.enableNewEthereumActionsAll} type="checkbox" /> Ethereum</div>
            <div><input bind:checked={form.enableNewNostrActionsAll} type="checkbox" /> Nostr</div>
          </div>
        </div>
        <div class="mt-4 pl-4">
          Enable new actions:
          <div class="ml-5">
            <div>
              <input bind:checked={form.enableNewWeb3ActionsAll} type="checkbox" />
              all
              <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">(you still need to enable all actions individually)</span>
            </div>
            <div><input bind:checked={form.enableNewWeb3ActionsPost} type="checkbox" /> post</div>
            <div>
              <input bind:checked={form.enableNewWeb3ActionsReply} type="checkbox" />
              reply
              <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">(comments)</span>
            </div>
            <div>
              <input bind:checked={form.enableNewWeb3ActionsReact} type="checkbox" />
              react
              <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">(upvote, downvote, etc.)</span>
            </div>
            <div>
              <input bind:checked={form.enableNewWeb3ActionsOther} type="checkbox" />
              other
              <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">(any non-standard event)</span>
            </div>
            <div><input bind:checked={form.enableNewWeb3ActionsModerate} type="checkbox" /> moderate</div>
          </div>
        </div>
        <div class="mt-4 pl-4">
          <input bind:checked={form.enableModeration} type="checkbox" />
          Enable moderation
          <div>
            List of moderators
            ({count(form.moderators)})
            <textarea bind:value={form.moderators} placeholder="0x123456789,npub123456789" class="block p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[700px] h-60 lg:h-36 focus:outline-hidden rounded-b-lg border-2"></textarea>
          </div>
        </div>
        <div class="mt-4 pl-4">
          <h6>Whitelists for new actions</h6>
          <div class="pl-2">
            <div>
              <input bind:checked={form.enableWhitelistForActionPost} type="checkbox" />
              enable whitelist for new posts
              ({count(form.whitelistedForActionPost)})
              <textarea bind:value={form.whitelistedForActionPost} placeholder="0x123456789,npub123456789" class="block p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[700px] h-60 lg:h-36 focus:outline-hidden rounded-b-lg border-2"></textarea>
            </div>
            <div class="mt-4">
              <input bind:checked={form.enableWhitelistForActionReply} type="checkbox" />
              enable whitelist for new replies
              <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">(comments)</span>
              ({count(form.whitelistedForActionReply)})
              <textarea bind:value={form.whitelistedForActionReply} placeholder="0x123456789,npub123456789" class="block p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[700px] h-60 lg:h-36 focus:outline-hidden rounded-b-lg border-2"></textarea>
            </div>
            <div class="mt-4">
              <input bind:checked={form.enableWhitelistForActionReact} type="checkbox" />
              enable whitelist for new reactions
              <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">(upvote, downvote, etc.)</span>
              ({count(form.whitelistedForActionReact)})
              <textarea bind:value={form.whitelistedForActionReact} placeholder="0x123456789,npub123456789" class="block p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[700px] h-60 lg:h-36 focus:outline-hidden rounded-b-lg border-2"></textarea>
            </div>
            <div class="mt-4">
              <input bind:checked={form.enableWhitelistForActionOther} type="checkbox" />
              enable whitelist for new other actions
              <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">(any non-standard event)</span>
              ({count(form.whitelistedForActionOther)})
              <textarea bind:value={form.whitelistedForActionOther} placeholder="0x123456789,npub123456789" class="block p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[700px] h-60 lg:h-36 focus:outline-hidden rounded-b-lg border-2"></textarea>
            </div>
          </div>
        </div>
        <div class="mt-2 mb-6">
          <span class="ml-4 text-xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" onclick={() => (showNewContent = !showNewContent)}>
            hide section
            <IconsTriangle rotateIf={showNewContent} />
          </span>
        </div>
      </div>
    {/if}
    </div>

    <!-- Media content -->
    <div class="admin-card {showMediaContent ? 'admin-card-open' : ''}">
      <button type="button" class="admin-card-header" onclick={() => (showMediaContent = !showMediaContent)}>
        <span>Media content</span>
        <IconsTriangle rotateIf={showMediaContent} />
      </button>

    {#if showMediaContent}
      <div transition:slide={{ duration: 250 }} class="admin-card-body">
        <div class="mt-2 pl-4">
          <div class="mt-2 pl-0">
            <div class="mt-2 pl-0">
              <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">Markdown must be allowed to auto-embed images, videos, and audios</span>
              <div class="mt-2 pl-0"><input bind:checked={form.enableMarkdownInPosts} type="checkbox" /> allow markdown in posts</div>
              <div class="mt-2 pl-0"><input bind:checked={form.enableMarkdownInComments} type="checkbox" /> allow markdown in comments</div>
            </div>

            {#if form.enableMarkdownInPosts || form.enableMarkdownInComments}
              <div class="mt-2 pl-5">
                <div class="mt-2 pl-0">
                  <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">Images</span>
                  <div class="mt-2 pl-0"><input bind:checked={form.enableEmbedImageTagsForAllUsers} type="checkbox" /> auto-embed images</div>
                  {#if form.enableEmbedImageTagsForAllUsers}
                    <div class="mt-0 pl-5">
                      <div class="mt-2 pl-0"><input bind:checked={form.enableEmbedImageTagsInPosts} type="checkbox" /> in posts</div>
                      <div class="mt-2 pl-0"><input bind:checked={form.enableEmbedImageTagsInComments} type="checkbox" /> in comments</div>
                      <div class="mt-2 pl-0"><input bind:checked={form.enableEmbedImageTagsForFullLineImageLinks} type="checkbox" /> full-line links</div>
                    </div>
                  {/if}
                </div>

                <div class="mt-2 pl-0">
                  <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">Videos</span>
                  <div class="mt-2 pl-0"><input bind:checked={form.enableEmbedVideoTagsForAllUsers} type="checkbox" /> auto-embed videos</div>
                  {#if form.enableEmbedVideoTagsForAllUsers}
                    <div class="mt-2 pl-5">
                      <div class="mt-2 pl-0"><input bind:checked={form.enableEmbedVideoTagsInPosts} type="checkbox" /> in posts</div>
                      <div class="mt-2 pl-0"><input bind:checked={form.enableEmbedVideoTagsInComments} type="checkbox" /> in comments</div>
                      <div class="mt-2 pl-0"><input bind:checked={form.enableEmbedVideoTagsForFullLineVideoLinks} type="checkbox" /> full-line links</div>
                    </div>
                  {/if}
                </div>

                <div class="mt-2 pl-0">
                  <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">Audios</span>
                  <div class="mt-2 pl-0"><input bind:checked={form.enableEmbedAudioTagsForAllUsers} type="checkbox" /> auto-embed audios</div>
                  {#if form.enableEmbedAudioTagsForAllUsers}
                    <div class="mt-2 pl-5">
                      <div class="mt-2 pl-0"><input bind:checked={form.enableEmbedAudioTagsInPosts} type="checkbox" /> in posts</div>
                      <div class="mt-2 pl-0"><input bind:checked={form.enableEmbedAudioTagsInComments} type="checkbox" /> in comments</div>
                      <div class="mt-2 pl-0"><input bind:checked={form.enableEmbedAudioTagsForFullLineAudioLinks} type="checkbox" /> full-line links</div>
                    </div>
                  {/if}
                </div>
              </div>
            {/if}
          </div>
        </div>

        <div class="mt-2 mb-6">
          <span class="ml-4 text-xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" onclick={() => (showMediaContent = !showMediaContent)}>
            hide section
            <IconsTriangle rotateIf={showMediaContent} />
          </span>
        </div>
      </div>
    {/if}
    </div>

    <!-- RSS feed channel -->
    <div class="admin-card {showRssFeedChannel ? 'admin-card-open' : ''}">
      <button type="button" class="admin-card-header" onclick={() => (showRssFeedChannel = !showRssFeedChannel)}>
        <span>RSS Channel</span>
        <IconsTriangle rotateIf={showRssFeedChannel} />
      </button>

    {#if showRssFeedChannel}
      <div transition:slide={{ duration: 250 }} class="admin-card-body">
        <div class="mt-2 pl-4">
          <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">Configure your RSS channel so users can follow your instance with legacy tech</span>
          <div class="mt-2 pl-0">
            <input bind:checked={form.enableRssFeedChannel} type="checkbox" />
            enable RSS channel

            {#if form.enableRssFeedChannel}
              <div class="pl-4 mt-2">
                <div>channel title: <input bind:value={form.rssFeedChannelTitle} type="text" placeholder="Spasm forum" class="custom-admin-input-socials" /></div>
                <div>forum link: <input bind:value={form.rssFeedChannelLink} type="text" placeholder="https://forum.spasm.network" class="custom-admin-input-socials" /></div>
                <div>description: <input bind:value={form.rssFeedChannelDescription} type="text" placeholder="Unplug from slave tech!" class="custom-admin-input-socials" /></div>
                <div>image link: <input bind:value={form.rssFeedChannelImageLink} type="text" placeholder="https://spasm.network/image.jpeg" class="custom-admin-input-socials" /></div>
              </div>
            {/if}
          </div>
        </div>

        <div class="mt-2 mb-6">
          <span class="ml-4 text-xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" onclick={() => (showRssFeedChannel = !showRssFeedChannel)}>
            hide section
            <IconsTriangle rotateIf={showRssFeedChannel} />
          </span>
        </div>
      </div>
    {/if}
    </div>

    <!-- Federation -->
    <div class="admin-card {showFederation ? 'admin-card-open' : ''}">
      <button type="button" class="admin-card-header" onclick={() => (showFederation = !showFederation)}>
        <span>Federation</span>
        <IconsTriangle rotateIf={showFederation} />
      </button>

    {#if showFederation}
      <div transition:slide={{ duration: 250 }} class="admin-card-body">
        <div class="mt-2 pl-4">
          <span class="text-colorNotImportant-light dark:text-colorNotImportant-dark">You can enable federation to automatically fetch events (posts, comments) from other instances.</span>
          <div class="mt-2 pl-0">
            <input bind:checked={form.enableSpasmModule} type="checkbox" />
            enable federation

            {#if form.enableSpasmModule}
              <div class="pl-4 mt-2">
                <div class="mb-2">
                  <input bind:checked={form.enableFederationDefaultLists} type="checkbox" />
                  enable default federation lists:

                  {#if form.enableFederationDefaultLists}
                    <div class="pl-4 mt-2"><input bind:checked={form.enableFederationDefaultListOfficial} type="checkbox" /> spasm</div>
                  {/if}
                  {#if form.enableFederationDefaultLists}
                    <div class="pl-4 mt-2"><input bind:checked={form.enableFederationDefaultListCrypto} type="checkbox" /> crypto</div>
                  {/if}
                  {#if form.enableFederationDefaultLists}
                    <div class="pl-4 mt-2"><input bind:checked={form.enableFederationDefaultListPrivacy} type="checkbox" /> privacy</div>
                  {/if}
                  {#if form.enableFederationDefaultLists}
                    <div class="pl-4 mt-2"><input bind:checked={form.enableFederationDefaultListTech} type="checkbox" /> tech</div>
                  {/if}
                  {#if form.enableFederationDefaultLists}
                    <div class="pl-4 mt-2"><input bind:checked={form.enableFederationDefaultListPolitics} type="checkbox" /> politics</div>
                  {/if}
                </div>

                <div class="mb-2">
                  <input bind:checked={form.enableFederationCustomLinks} type="checkbox" />
                  enable custom federation links:
                  {#if form.enableFederationCustomLinks}
                    <div class="mt-4 pl-4">
                      List of custom links
                      ({count(form.federationCustomLinks)})
                      <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">Accepts Spasm and RSS feeds.</div>
                      <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">Simple template:</div>
                      <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">url1,url2,url3,url4,url5</div>
                      <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">Advanced template:</div>
                      <div class="text-colorNotImportant-light dark:text-colorNotImportant-dark">url1|category|frequency|network|name|showSource,url2|category,url3||||name,url4</div>
                      <textarea bind:value={form.federationCustomLinks} placeholder="https://degenrocket.space/api/events?activity=rising,https://thedefiant.io/api/feed|defi" class="block p-1 bg-bgBase-light dark:bg-bgBase-dark border-bgSecondary-light dark:border-bgSecondary-dark w-[90%] max-w-[700px] h-60 lg:h-36 focus:outline-hidden rounded-b-lg border-2"></textarea>
                    </div>
                  {/if}
                </div>

                <div class="mb-2 hidden">
                  <input bind:checked={form.enableFederationCustomSources} type="checkbox" />
                  enable custom federation sources:
                </div>
              </div>
            {/if}
          </div>
        </div>

        <div class="mt-2 mb-6">
          <span class="ml-4 text-xl text-colorNotImportant-light dark:text-colorNotImportant-dark cursor-pointer hover:text-colorPrimary-light dark:hover:text-colorPrimary-dark" onclick={() => (showFederation = !showFederation)}>
            hide section
            <IconsTriangle rotateIf={showFederation} />
          </span>
        </div>
      </div>
    {/if}
    </div>

    <!-- Response -->
    <div class="my-4">
      <div class={isResponseError ? 'text-colorRed-light dark:text-colorRed-dark' : 'text-colorGreen-light dark:text-colorGreen-dark'}>
        {responseMessage}
      </div>
      {#if connectedAddress.value && typeof connectedAddress.value === 'string' && isInList(connectedAddress.value, admins)}
        <div class="mb-16">
          <button
            onclick={() => saveAppConfig()}
            class="inline px-6 lg:min-w-[200px] min-h-[40px] text-colorPrimary-light dark:text-colorPrimary-dark border-2 border-colorPrimary-light dark:border-colorPrimary-dark rounded-lg hover:bg-bgHover-light dark:hover:bg-bgHover-dark"
          >
            Save app config
          </button>
        </div>
      {/if}
    </div>
  </div>

  <div class="mb-32"></div>
</div>
