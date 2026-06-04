import { env } from '$env/dynamic/public';

/**
 * Central public config for browser-exposed values.
 *
 * Values are read from $env/dynamic/public, which SvelteKit resolves
 * from the runtime environment on the server and injects into the
 * client. That keeps the app runtime-configurable (e.g. pre-built
 * Docker/Podman images set env at container start), exactly like the
 * Nuxt runtimeConfig did.
 *
 * Every value is a raw string (or undefined). Boolean/number/array
 * coercion happens downstream in the appConfig store via
 * parseEnvBool()/splitIntoArray(), unchanged from before. A handful of
 * keys keep their hardcoded fallbacks.
 *
 * Env naming: client config vars use a single
 * into a single `PUBLIC_FOO`. SvelteKit requires the PUBLIC_ prefix to
 * expose a variable to the browser. See .env.example.
 *
 * This replaces the ~209 `useRuntimeConfig()?.public?.X` reads:
 * `import { config } from '$lib/config'` and read `config.X`.
 */
export const config = {
  faviconPath: env.PUBLIC_FAVICON_BASE || '/favicon.ico',
  faviconTheme: env.PUBLIC_FAVICON_THEME || 'default',

  apiURL: env.PUBLIC_API_URL,

  // Testing
  useMockedDataIfBackendIsDown: env.PUBLIC_USE_MOCKED_DATA_IF_BACKEND_IS_DOWN,

  // App config
  enableAppConfigChanges: env.PUBLIC_ENABLE_APP_CONFIG_CHANGES,
  enableAppConfigChangesByAdmin: env.PUBLIC_ENABLE_APP_CONFIG_CHANGES_BY_ADMIN,

  // Admin
  enableAdmin: env.PUBLIC_ENABLE_ADMIN,
  admins: env.PUBLIC_ADMINS,

  // Moderation
  enableModeration: env.PUBLIC_ENABLE_MODERATION,
  moderators: env.PUBLIC_MODERATORS,

  // Default intro, contacts, images, buttons
  enableDefaultIntro: env.PUBLIC_ENABLE_DEFAULT_INTRO,
  enableDefaultContacts: env.PUBLIC_ENABLE_DEFAULT_CONTACTS,
  enableDefaultHeaderImage: env.PUBLIC_ENABLE_DEFAULT_HEADER_IMAGE,
  defaultHeaderImageLink: env.PUBLIC_DEFAULT_HEADER_IMAGE_LINK,
  enableDefaultButtonPrimary: env.PUBLIC_ENABLE_DEFAULT_BUTTON_PRIMARY,
  defaultButtonPrimaryText: env.PUBLIC_DEFAULT_BUTTON_PRIMARY_TEXT,
  defaultButtonPrimaryLink: env.PUBLIC_DEFAULT_BUTTON_PRIMARY_LINK,
  enableDefaultButtonSecondary: env.PUBLIC_ENABLE_DEFAULT_BUTTON_SECONDARY,
  defaultButtonSecondaryText: env.PUBLIC_DEFAULT_BUTTON_SECONDARY_TEXT,
  defaultButtonSecondaryLink: env.PUBLIC_DEFAULT_BUTTON_SECONDARY_LINK,

  // Custom header image, intro, contacts
  enableCustomIntro: env.PUBLIC_ENABLE_CUSTOM_INTRO,
  enableCustomContacts: env.PUBLIC_ENABLE_CUSTOM_CONTACTS,

  introTitle: env.PUBLIC_INTRO_TITLE,
  introTitleExtra: env.PUBLIC_INTRO_TITLE_EXTRA,
  introAbout: env.PUBLIC_INTRO_ABOUT,

  postPlaceholder: env.PUBLIC_POST_PLACEHOLDER,
  commentPlaceholder: env.PUBLIC_COMMENT_PLACEHOLDER,

  ifShowContactsInIntro: env.PUBLIC_IF_SHOW_CONTACTS_IN_INTRO,
  ifShowIntroTutorial: env.PUBLIC_IF_SHOW_INTRO_TUTORIAL,
  ifShowHomeLatestComments: env.PUBLIC_IF_SHOW_HOME_LATEST_COMMENTS,

  // Menu
  showNewPostButtonInMenu: env.PUBLIC_SHOW_NEW_POST_BUTTON_IN_MENU,

  // Shortened URLs for web3 actions
  enableShortUrlsForWeb3Actions: env.PUBLIC_ENABLE_SHORT_URLS_FOR_WEB3_ACTIONS,
  shortUrlsLengthOfWeb3Ids: env.PUBLIC_SHORT_URLS_LENGTH_OF_WEB3_IDS,

  // New web3 actions
  enableNewWeb3ActionsAll: env.PUBLIC_ENABLE_NEW_WEB3_ACTIONS_ALL,
  enableNewWeb3ActionsPost: env.PUBLIC_ENABLE_NEW_WEB3_ACTIONS_POST,
  enableNewWeb3ActionsReply: env.PUBLIC_ENABLE_NEW_WEB3_ACTIONS_REPLY,
  enableNewWeb3ActionsReact: env.PUBLIC_ENABLE_NEW_WEB3_ACTIONS_REACT,
  enableNewWeb3ActionsModerate: env.PUBLIC_ENABLE_NEW_WEB3_ACTIONS_MODERATE,

  ifAllowGuestLogin: env.PUBLIC_IF_ALLOW_GUEST_LOGIN,

  enableNewNostrActionsAll: env.PUBLIC_ENABLE_NEW_NOSTR_ACTIONS_ALL,
  enableNewEthereumActionsAll: env.PUBLIC_ENABLE_NEW_ETHEREUM_ACTIONS_ALL,

  // White list
  enableWhitelistForActionPost: env.PUBLIC_ENABLE_WHITELIST_FOR_ACTION_POST,
  whitelistedForActionPost: env.PUBLIC_WHITELISTED_FOR_ACTION_POST,
  enableWhitelistForActionReply: env.PUBLIC_ENABLE_WHITELIST_FOR_ACTION_REPLY,
  whitelistedForActionReply: env.PUBLIC_WHITELISTED_FOR_ACTION_REPLY,
  enableWhitelistForActionReact: env.PUBLIC_ENABLE_WHITELIST_FOR_ACTION_REACT,
  whitelistedForActionReact: env.PUBLIC_WHITELISTED_FOR_ACTION_REACT,
  enableWhitelistForActionOther: env.PUBLIC_ENABLE_WHITELIST_FOR_ACTION_OTHER,
  whitelistedForActionOther: env.PUBLIC_WHITELISTED_FOR_ACTION_OTHER,

  // Nostr network
  enableNostrNetwork: env.PUBLIC_ENABLE_NOSTR_NETWORK,
  enableNostrNetworkFetchProfiles: env.PUBLIC_ENABLE_NOSTR_NETWORK_FETCH_PROFILES,
  enableNostrNetworkFetchPreferredRelays: env.PUBLIC_ENABLE_NOSTR_NETWORK_FETCH_PREFERRED_RELAYS,
  enableNostrNetworkFetchMessages: env.PUBLIC_ENABLE_NOSTR_NETWORK_FETCH_MESSAGES,
  enableNostrNetworkUsePreferredRelays: env.PUBLIC_ENABLE_NOSTR_NETWORK_USE_PREFERRED_RELAYS,
  enableNostrDisplayProfilesUsernames: env.PUBLIC_ENABLE_NOSTR_DISPLAY_PROFILES_USERNAMES,
  enableNostrDisplayProfilesAbouts: env.PUBLIC_ENABLE_NOSTR_DISPLAY_PROFILES_ABOUTS,
  enableNostrDisplayProfilesWebsites: env.PUBLIC_ENABLE_NOSTR_DISPLAY_PROFILES_WEBSITES,
  enableNostrDisplayProfilesPictures: env.PUBLIC_ENABLE_NOSTR_DISPLAY_PROFILES_PICTURES,
  enableNostrDisplayProfilesMessages: env.PUBLIC_ENABLE_NOSTR_DISPLAY_PROFILES_MESSAGES,
  nostrDefaultRelays: env.PUBLIC_NOSTR_DEFAULT_RELAYS,

  // Markdown
  enableMarkdownInPosts: env.PUBLIC_ENABLE_MARKDOWN_IN_POSTS,
  enableMarkdownInComments: env.PUBLIC_ENABLE_MARKDOWN_IN_COMMENTS,

  // Images
  enableEmbedImageTagsForAllUsers: env.PUBLIC_ENABLE_EMBED_IMAGE_TAGS_FOR_ALL_USERS,
  enableEmbedImageTagsForFullLineImageLinks: env.PUBLIC_ENABLE_EMBED_IMAGE_TAGS_FOR_FULL_LINE_IMAGE_LINKS,
  enableEmbedImageTagsInPosts: env.PUBLIC_ENABLE_EMBED_IMAGE_TAGS_IN_POSTS,
  enableEmbedImageTagsInComments: env.PUBLIC_ENABLE_EMBED_IMAGE_TAGS_IN_COMMENTS,

  // Videos
  enableEmbedVideoTagsForAllUsers: env.PUBLIC_ENABLE_EMBED_VIDEO_TAGS_FOR_ALL_USERS,
  enableEmbedVideoTagsForFullLineVideoLinks: env.PUBLIC_ENABLE_EMBED_VIDEO_TAGS_FOR_FULL_LINE_VIDEO_LINKS,
  enableEmbedVideoTagsInPosts: env.PUBLIC_ENABLE_EMBED_VIDEO_TAGS_IN_POSTS,
  enableEmbedVideoTagsInComments: env.PUBLIC_ENABLE_EMBED_VIDEO_TAGS_IN_COMMENTS,

  // Audios
  enableEmbedAudioTagsForAllUsers: env.PUBLIC_ENABLE_EMBED_AUDIO_TAGS_FOR_ALL_USERS,
  enableEmbedAudioTagsForFullLineAudioLinks: env.PUBLIC_ENABLE_EMBED_AUDIO_TAGS_FOR_FULL_LINE_AUDIO_LINKS,
  enableEmbedAudioTagsInPosts: env.PUBLIC_ENABLE_EMBED_AUDIO_TAGS_IN_POSTS,
  enableEmbedAudioTagsInComments: env.PUBLIC_ENABLE_EMBED_AUDIO_TAGS_IN_COMMENTS,

  // Iframe tags (manage with caution: see .env.example security notes)
  enableEmbedIframeTagsForSelectedUsers: env.PUBLIC_ENABLE_EMBED_IFRAME_TAGS_FOR_SELECTED_USERS,
  enableEmbedIframeTagsForInlineLinks: env.PUBLIC_ENABLE_EMBED_IFRAME_TAGS_FOR_INLINE_LINKS,
  enableEmbedIframeTagsForVideos: env.PUBLIC_ENABLE_EMBED_IFRAME_TAGS_FOR_VIDEOS,
  enableEmbedIframeTagsForImages: env.PUBLIC_ENABLE_EMBED_IFRAME_TAGS_FOR_IMAGES,
  enableEmbedIframeTagsForAudio: env.PUBLIC_ENABLE_EMBED_IFRAME_TAGS_FOR_AUDIO,
  enableEmbedIframeTagsInPosts: env.PUBLIC_ENABLE_EMBED_IFRAME_TAGS_IN_POSTS,
  enableEmbedIframeTagsInComments: env.PUBLIC_ENABLE_EMBED_IFRAME_TAGS_IN_COMMENTS,
  signersAllowedToEmbedIframeTags: env.PUBLIC_SIGNERS_ALLOWED_TO_EMBED_IFRAME_TAGS,
  iframeTagsAllowedDomains: env.PUBLIC_IFRAME_TAGS_ALLOWED_DOMAINS,
  iframeTagsAllowedDomainsAny: env.PUBLIC_IFRAME_TAGS_ALLOWED_DOMAINS_ANY,
  iframeVideoWidth: env.PUBLIC_IFRAME_VIDEO_WIDTH,
  iframeVideoHeight: env.PUBLIC_IFRAME_VIDEO_HEIGHT,
  iframeAdditionalParams: env.PUBLIC_IFRAME_ADDITIONAL_PARAMS,
  iframeHideOneLineUrl: env.PUBLIC_IFRAME_HIDE_ONE_LINE_URL,

  // Default explorers for Ethereum/Nostr addresses
  defaultExplorerEthereumAddress: env.PUBLIC_DEFAULT_EXPLORER_ETHEREUM_ADDRESS,
  defaultExplorerNostrAddress: env.PUBLIC_DEFAULT_EXPLORER_NOSTR_ADDRESS,

  // Another website links
  anotherWebsiteLink: env.PUBLIC_ANOTHER_WEBSITE_LINK,
  torLink: env.PUBLIC_TOR_LINK,
  ipfsLink: env.PUBLIC_IPFS_LINK,
  ipfsHttpGatewayLink: env.PUBLIC_IPFS_HTTP_GATEWAY_LINK,

  // Social media links
  nostrLink: env.PUBLIC_NOSTR_LINK,
  sessionLink: env.PUBLIC_SESSION_LINK,
  simplexLink: env.PUBLIC_SIMPLEX_LINK,
  statusLink: env.PUBLIC_STATUS_LINK,
  lensLink: env.PUBLIC_LENS_LINK,
  farcasterLink: env.PUBLIC_FARCASTER_LINK,
  blueskyLink: env.PUBLIC_BLUESKY_LINK,
  hiveLink: env.PUBLIC_HIVE_LINK,
  pushLink: env.PUBLIC_PUSH_LINK,
  mirrorLink: env.PUBLIC_MIRROR_LINK,
  mastodonLink: env.PUBLIC_MASTODON_LINK,
  matrixLink: env.PUBLIC_MATRIX_LINK,
  discordLink: env.PUBLIC_DISCORD_LINK,
  telegramLink: env.PUBLIC_TELEGRAM_LINK,
  twitterLink: env.PUBLIC_TWITTER_LINK,
  redditLink: env.PUBLIC_REDDIT_LINK,
  youtubeLink: env.PUBLIC_YOUTUBE_LINK,
  instagramLink: env.PUBLIC_INSTAGRAM_LINK,
  facebookLink: env.PUBLIC_FACEBOOK_LINK,
  linkedinLink: env.PUBLIC_LINKEDIN_LINK,
  wikipediaLink: env.PUBLIC_WIKIPEDIA_LINK,
  gitLink: env.PUBLIC_GIT_LINK,
  forgejoLink: env.PUBLIC_FORGEJO_LINK,
  giteaLink: env.PUBLIC_GITEA_LINK,
  radicleLink: env.PUBLIC_RADICLE_LINK,
  gitlabLink: env.PUBLIC_GITLAB_LINK,
  codebergLink: env.PUBLIC_CODEBERG_LINK,
  bitbucketLink: env.PUBLIC_BITBUCKET_LINK,
  githubLink: env.PUBLIC_GITHUB_LINK,

  // Messengers
  nostrNpub: env.PUBLIC_NOSTR_NPUB,
  sessionName: env.PUBLIC_SESSION_NAME,
  matrixName: env.PUBLIC_MATRIX_NAME,
  lensName: env.PUBLIC_LENS_NAME,
  farcasterName: env.PUBLIC_FARCASTER_NAME,
  blueskyName: env.PUBLIC_BLUESKY_NAME,
  hiveName: env.PUBLIC_HIVE_NAME,
  pushName: env.PUBLIC_PUSH_NAME,
  mirrorName: env.PUBLIC_MIRROR_NAME,
  telegramName: env.PUBLIC_TELEGRAM_NAME,
  twitterName: env.PUBLIC_TWITTER_NAME,
  redditName: env.PUBLIC_REDDIT_NAME,
  signalNumber: env.PUBLIC_SIGNAL_NUMBER,
  whatsappNumber: env.PUBLIC_WHATSAPP_NUMBER,
  xmppName: env.PUBLIC_XMPP_NAME,

  // Blockchain
  uniswapLink: env.PUBLIC_UNISWAP_LINK,
  sushiswapLink: env.PUBLIC_SUSHISWAP_LINK,
  etherscanLink: env.PUBLIC_ETHERSCAN_LINK,
  ethvmLink: env.PUBLIC_ETHVM_LINK,
  coingeckoLink: env.PUBLIC_COINGECKO_LINK,
  coinmarketcapLink: env.PUBLIC_COINMARKETCAP_LINK,
  dextoolsLink: env.PUBLIC_DEXTOOLS_LINK,
  dexscreenerLink: env.PUBLIC_DEXSCREENER_LINK,
  birdeyeLink: env.PUBLIC_BIRDEYE_LINK,
  geckoterminalLink: env.PUBLIC_GECKOTERMINAL_LINK,

  // Extra contact links
  extraContactInfo: env.PUBLIC_EXTRA_CONTACT_INFO,

  ifShowDevelopersInfo: env.PUBLIC_IF_SHOW_DEVELOPERS_INFO,

  // Categories
  ifShowCategoriesFilter: env.PUBLIC_IF_SHOW_CATEGORIES_FILTER,
  envCategories: env.PUBLIC_CATEGORIES || 'tech,privacy,defi,memes',

  // Authors
  enableAutoGeneratedNames: env.PUBLIC_ENABLE_AUTO_GENERATED_NAMES,
  enableAutoGeneratedNamesDictionaryTech: env.PUBLIC_ENABLE_AUTO_GENERATED_NAMES_DICTIONARY_TECH,

  // Feed filters
  feedFiltersActivityHot: env.PUBLIC_FEED_FILTERS_ACTIVITY_HOT,
  feedFiltersActivityRising: env.PUBLIC_FEED_FILTERS_ACTIVITY_RISING,

  // Pinned events
  pinnedIds: env.PUBLIC_PINNED_IDS,

  // Additional appConfig/AppConfig keys that the original frontend
  // config did not wire (so they were previously undefined).
  // Wired here for completeness; mostly federation / spasm-module /
  // RSS-feed-channel options. Not yet in .env.example.
  faviconLink: env.PUBLIC_FAVICON_LINK,
  enableNewWeb3ActionsOther: env.PUBLIC_ENABLE_NEW_WEB3_ACTIONS_OTHER,
  enableSpasmModule: env.PUBLIC_ENABLE_SPASM_MODULE,
  enableSpasmSourcesUpdates: env.PUBLIC_ENABLE_SPASM_SOURCES_UPDATES,
  enableFederationDefaultLists: env.PUBLIC_ENABLE_FEDERATION_DEFAULT_LISTS,
  enableFederationDefaultListOfficial: env.PUBLIC_ENABLE_FEDERATION_DEFAULT_LIST_OFFICIAL,
  enableFederationDefaultListCrypto: env.PUBLIC_ENABLE_FEDERATION_DEFAULT_LIST_CRYPTO,
  enableFederationDefaultListPrivacy: env.PUBLIC_ENABLE_FEDERATION_DEFAULT_LIST_PRIVACY,
  enableFederationDefaultListTech: env.PUBLIC_ENABLE_FEDERATION_DEFAULT_LIST_TECH,
  enableFederationDefaultListPolitics: env.PUBLIC_ENABLE_FEDERATION_DEFAULT_LIST_POLITICS,
  enableFederationCustomLinks: env.PUBLIC_ENABLE_FEDERATION_CUSTOM_LINKS,
  enableFederationCustomSources: env.PUBLIC_ENABLE_FEDERATION_CUSTOM_SOURCES,
  federationCustomLinks: env.PUBLIC_FEDERATION_CUSTOM_LINKS,
  enableRssFeedChannel: env.PUBLIC_ENABLE_RSS_FEED_CHANNEL,
  rssFeedChannelTitle: env.PUBLIC_RSS_FEED_CHANNEL_TITLE,
  rssFeedChannelLink: env.PUBLIC_RSS_FEED_CHANNEL_LINK,
  rssFeedChannelDescription: env.PUBLIC_RSS_FEED_CHANNEL_DESCRIPTION,
  rssFeedChannelImageLink: env.PUBLIC_RSS_FEED_CHANNEL_IMAGE_LINK,

  // Colors (fallbacks match the default theme; the CSS
  // variables themselves live in app.css / the theme layer)
  colorPrimaryLight: env.PUBLIC_COLOR_PRIMARY_LIGHT || '#f420af',
  colorPrimaryDark: env.PUBLIC_COLOR_PRIMARY_DARK || '#f420af',
  colorBaseLight: env.PUBLIC_COLOR_BASE_LIGHT || '#000000',
  colorBaseDark: env.PUBLIC_COLOR_BASE_DARK || '#d8d8d8',
  colorSecondaryLight: env.PUBLIC_COLOR_SECONDARY_LIGHT || '#000000',
  colorSecondaryDark: env.PUBLIC_COLOR_SECONDARY_DARK || '#ffffff',
  colorHoverLight: env.PUBLIC_COLOR_HOVER_LIGHT || '#243746',
  colorHoverDark: env.PUBLIC_COLOR_HOVER_DARK || '#cbd4d1',
  colorNotImportantLight: env.PUBLIC_COLOR_NOT_IMPORTANT_LIGHT || '#9b8bc6',
  colorNotImportantDark: env.PUBLIC_COLOR_NOT_IMPORTANT_DARK || '#706297',
  colorGreenLight: env.PUBLIC_COLOR_GREEN_LIGHT || '#089703',
  colorGreenDark: env.PUBLIC_COLOR_GREEN_DARK || '#0ad203',
  colorRedLight: env.PUBLIC_COLOR_RED_LIGHT || '#ff0a0a',
  colorRedDark: env.PUBLIC_COLOR_RED_DARK || '#ff0a0a',
  colorOrangeLight: env.PUBLIC_COLOR_ORANGE_LIGHT || '#f4af0c',
  colorOrangeDark: env.PUBLIC_COLOR_ORANGE_DARK || '#f4af0c',
  colorBlueLight: env.PUBLIC_COLOR_BLUE_LIGHT || '#3a3dff',
  colorBlueDark: env.PUBLIC_COLOR_BLUE_DARK || '#3a3dff',
  bgBaseLight: env.PUBLIC_BG_BASE_LIGHT || '#fafafa',
  bgBaseDark: env.PUBLIC_BG_BASE_DARK || '#0F0F0F',
  bgSecondaryLight: env.PUBLIC_BG_SECONDARY_LIGHT || '#f0f0f0',
  bgSecondaryDark: env.PUBLIC_BG_SECONDARY_DARK || '#181818',
  bgHoverLight: env.PUBLIC_BG_HOVER_LIGHT || '#e3e3e3',
  bgHoverDark: env.PUBLIC_BG_HOVER_DARK || '#1f1f1f',
  bgDarkLight: env.PUBLIC_BG_DARK_LIGHT || '#bbbbbb',
  bgDarkDark: env.PUBLIC_BG_DARK_DARK || '#000000',
  borderColorLight: env.PUBLIC_BORDER_COLOR_LIGHT || '#ddd',
  borderColorDark: env.PUBLIC_BORDER_COLOR_DARK || '#312d3e',
};

export type Config = typeof config;
