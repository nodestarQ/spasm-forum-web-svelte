import {
  AppConfig,
  AppConfigKeyBoolean,
  AppConfigKeyArray,
  AppConfigKeyString,
  AppConfigKeyNumber,
} from '$lib/types/interfaces'
import { config } from '$lib/config'
import { browser } from '$app/environment'
import { useUtils } from '$lib/utils/useUtils'
import { useEventsStore } from '$lib/stores/useEventsStore.svelte'
const {
  splitIntoArray,
  parseEnvBool
} = useUtils()

interface AppConfigState extends AppConfig {}

class AppConfigStore {
  state: AppConfigState = $state({
    // Environment settings:
    apiUrl: config.apiURL,
    enableAppConfigChanges: parseEnvBool(config.enableAppConfigChanges, true),
    enableAppConfigChangesByAdmin: parseEnvBool(config.enableAppConfigChangesByAdmin, true),
    enableAdmin: parseEnvBool(config.enableAdmin, true),
    admins: splitIntoArray(config.admins),
    // TODO backend env vars
    // Not set in frontend .env file:
    allowNewEventsWithoutSignature: undefined,

    // Set in frontend .env file:
    // Strings
    // Strings-default-intro
    faviconTheme: config.faviconTheme,
    faviconLink: config.faviconLink,
    defaultHeaderImageLink: config.defaultHeaderImageLink,
    introTitle: config.introTitle || "Spasm",
    introTitleExtra: config.introTitleExtra || "forum",
    introAbout: config.introAbout || "Unplug from slave tech!",
    postPlaceholder: config.postPlaceholder || "(Basic markdown is enabled, but HTML tags are not allowed, so use markdown instead).",
    commentPlaceholder: config.commentPlaceholder || "(Basic markdown is enabled, but HTML tags are not allowed, so use markdown instead).",
    defaultButtonPrimaryText: config.defaultButtonPrimaryText || "Primary button",
    defaultButtonPrimaryLink: config.defaultButtonPrimaryLink || "https://spasm.network",
    defaultButtonSecondaryText: config.defaultButtonSecondaryText || "Secondary button",
    defaultButtonSecondaryLink: config.defaultButtonSecondaryLink || "https://docs.spasm.network",
    // Colors
    colorPrimaryDark: config.colorPrimaryDark,
    colorPrimaryLight: config.colorPrimaryLight,
    colorBaseLight: config.colorBaseLight,
    colorBaseDark: config.colorBaseDark,
    colorSecondaryLight: config.colorSecondaryLight,
    colorSecondaryDark: config.colorSecondaryDark,
    colorHoverLight: config.colorHoverLight,
    colorHoverDark: config.colorHoverDark,
    colorNotImportantLight: config.colorNotImportantLight,
    colorNotImportantDark: config.colorNotImportantDark,
    colorGreenLight: config.colorGreenLight,
    colorGreenDark: config.colorGreenDark,
    colorRedLight: config.colorRedLight,
    colorRedDark: config.colorRedDark,
    colorOrangeLight: config.colorOrangeLight,
    colorOrangeDark: config.colorOrangeDark,
    colorBlueLight: config.colorBlueLight,
    colorBlueDark: config.colorBlueDark,
    bgBaseLight: config.bgBaseLight,
    bgBaseDark: config.bgBaseDark,
    bgSecondaryLight: config.bgSecondaryLight,
    bgSecondaryDark: config.bgSecondaryDark,
    bgHoverLight: config.bgHoverLight,
    bgHoverDark: config.bgHoverDark,
    bgDarkLight: config.bgDarkLight,
    bgDarkDark: config.bgDarkDark,
    borderColorLight: config.borderColorLight,
    borderColorDark: config.borderColorDark,
    // Strings-socials
    anotherWebsiteLink: config.anotherWebsiteLink,
    ipfsLink: config.ipfsLink,
    torLink: config.torLink,
    ipfsHttpGatewayLink: config.ipfsHttpGatewayLink,
    nostrLink: config.nostrLink,
    sessionLink: config.sessionLink,
    simplexLink: config.simplexLink,
    statusLink: config.statusLink,
    lensLink: config.lensLink,
    farcasterLink: config.farcasterLink,
    blueskyLink: config.farcasterLink,
    hiveLink: config.hiveLink,
    pushLink: config.pushLink,
    mirrorLink: config.mirrorLink,
    mastodonLink: config.mastodonLink,
    matrixLink: config.matrixLink,
    discordLink: config.discordLink,
    telegramLink: config.telegramLink,
    twitterLink: config.twitterLink,
    redditLink: config.redditLink,
    youtubeLink: config.youtubeLink,
    instagramLink: config.instagramLink,
    facebookLink: config.facebookLink,
    linkedinLink: config.linkedinLink,
    wikipediaLink: config.wikipediaLink,
    gitLink: config.gitLink,
    forgejoLink: config.forgejoLink,
    giteaLink: config.giteaLink,
    radicleLink: config.radicleLink,
    gitlabLink: config.gitlabLink,
    codebergLink: config.codebergLink,
    bitbucketLink: config.bitbucketLink,
    githubLink: config.githubLink,
    nostrNpub: config.nostrNpub,
    sessionName: config.sessionName,
    matrixName: config.matrixName,
    lensName: config.lensName,
    farcasterName: config.farcasterName,
    blueskyName: config.blueskyName,
    hiveName: config.hiveName,
    pushName: config.pushName,
    mirrorName: config.mirrorName,
    telegramName: config.telegramName,
    twitterName: config.twitterName,
    redditName: config.redditName,
    signalNumber: config.signalNumber,
    whatsappNumber: config.whatsappNumber,
    xmppName: config.xmppName,
    uniswapLink: config.uniswapLink,
    sushiswapLink: config.sushiswapLink,
    etherscanLink: config.etherscanLink,
    ethvmLink: config.ethvmLink,
    coingeckoLink: config.coingeckoLink,
    coinmarketcapLink: config.coinmarketcapLink,
    dextoolsLink: config.dextoolsLink,
    dexscreenerLink: config.dexscreenerLink,
    birdeyeLink: config.birdeyeLink,
    geckoterminalLink: config.geckoterminalLink,
    extraContactInfo: config.extraContactInfo,
    // RSS feed channel
    rssFeedChannelTitle: config.rssFeedChannelTitle,
    rssFeedChannelLink: config.rssFeedChannelLink,
    rssFeedChannelDescription: config.rssFeedChannelDescription,
    rssFeedChannelImageLink: config.rssFeedChannelImageLink,

    // Booleans
    // Boolean-default-intro
    enableDefaultIntro: parseEnvBool(config.enableDefaultIntro, true),
    enableDefaultContacts: parseEnvBool(config.enableDefaultContacts, true),
    ifShowDevelopersInfo: parseEnvBool(config.ifShowDevelopersInfo, true),
    enableDefaultHeaderImage: parseEnvBool(config.enableDefaultHeaderImage, false),
    enableDefaultButtonPrimary: parseEnvBool(config.enableDefaultButtonPrimary, false),
    enableDefaultButtonSecondary: parseEnvBool(config.enableDefaultButtonSecondary, false),
    // Boolean-custom-intro
    enableCustomIntro: parseEnvBool(config.enableCustomIntro, true),
    enableCustomContacts: parseEnvBool(config.enableCustomContacts, true),
    ifShowContactsInIntro: parseEnvBool(config.ifShowContactsInIntro, true),
    ifShowIntroTutorial: parseEnvBool(config.ifShowIntroTutorial, true),
    ifShowHomeLatestComments: parseEnvBool(config.ifShowHomeLatestComments, true),

    // Boolean-others
    enableNewWeb3ActionsAll: parseEnvBool(config.enableNewWeb3ActionsAll, true),
    enableNewWeb3ActionsPost: parseEnvBool(config.enableNewWeb3ActionsPost, true),
    enableNewWeb3ActionsReply: parseEnvBool(config.enableNewWeb3ActionsReply, true),
    enableNewWeb3ActionsReact: parseEnvBool(config.enableNewWeb3ActionsReact, true),
    enableNewWeb3ActionsOther: parseEnvBool(config.enableNewWeb3ActionsOther, true),
    enableNewWeb3ActionsModerate: parseEnvBool(config.enableNewWeb3ActionsModerate, true),
    enableMarkdownInPosts:
      parseEnvBool(config.enableMarkdownInPosts, true),
    enableMarkdownInComments:
      parseEnvBool(config.enableMarkdownInComments, true),
    enableEmbedImageTagsForAllUsers:
      parseEnvBool(config.enableEmbedImageTagsForAllUsers, true),
    enableEmbedImageTagsForFullLineImageLinks:
      parseEnvBool(config.enableEmbedImageTagsForFullLineImageLinks, true),
    enableEmbedImageTagsInPosts:
      parseEnvBool(config.enableEmbedImageTagsInPosts, true),
    enableEmbedImageTagsInComments:
      parseEnvBool(config.enableEmbedImageTagsInComments, true),
    enableEmbedVideoTagsForAllUsers:
      parseEnvBool(config.enableEmbedVideoTagsForAllUsers, true),
    enableEmbedVideoTagsForFullLineVideoLinks:
      parseEnvBool(config.enableEmbedVideoTagsForFullLineVideoLinks, true),
    enableEmbedVideoTagsInPosts:
      parseEnvBool(config.enableEmbedVideoTagsInPosts, true),
    enableEmbedVideoTagsInComments:
      parseEnvBool(config.enableEmbedVideoTagsInComments, true),
    enableEmbedAudioTagsForAllUsers:
      parseEnvBool(config.enableEmbedAudioTagsForAllUsers, true),
    enableEmbedAudioTagsForFullLineAudioLinks:
      parseEnvBool(config.enableEmbedAudioTagsForFullLineAudioLinks, true),
    enableEmbedAudioTagsInPosts:
      parseEnvBool(config.enableEmbedAudioTagsInPosts, true),
    enableEmbedAudioTagsInComments:
      parseEnvBool(config.enableEmbedAudioTagsInComments, true),
    ifShowCategoriesFilter: parseEnvBool(config.ifShowCategoriesFilter, true),
    ifAllowGuestLogin: parseEnvBool(config.ifAllowGuestLogin, true),
    enableNewNostrActionsAll: parseEnvBool(config.enableNewNostrActionsAll, true),
    enableNewEthereumActionsAll: parseEnvBool(config.enableNewEthereumActionsAll, true),
    enableModeration: parseEnvBool(config.enableModeration, true),
    enableShortUrlsForWeb3Actions:
      parseEnvBool(config.enableShortUrlsForWeb3Actions, true),
    enableWhitelistForActionPost:
      parseEnvBool(config.enableWhitelistForActionPost, false),
    enableWhitelistForActionReply:
      parseEnvBool(config.enableWhitelistForActionReply, false),
    enableWhitelistForActionReact:
      parseEnvBool(config.enableWhitelistForActionReact, false),
    enableWhitelistForActionOther:
      parseEnvBool(config.enableWhitelistForActionOther, false),
    enableSpasmModule:
      parseEnvBool(config.enableSpasmModule, true),
    enableSpasmSourcesUpdates:
      parseEnvBool(config.enableSpasmSourcesUpdates, true),
    enableFederationDefaultLists:
      parseEnvBool(config.enableFederationDefaultLists, true),
    enableFederationDefaultListOfficial:
      parseEnvBool(config.enableFederationDefaultListOfficial, true),
    enableFederationDefaultListCrypto:
      parseEnvBool(config.enableFederationDefaultListCrypto, true),
    enableFederationDefaultListPrivacy:
      parseEnvBool(config.enableFederationDefaultListPrivacy, true),
    enableFederationDefaultListTech:
      parseEnvBool(config.enableFederationDefaultListTech, true),
    enableFederationDefaultListPolitics:
      parseEnvBool(config.enableFederationDefaultListPolitics, true),
    enableFederationCustomLinks:
      parseEnvBool(config.enableFederationCustomLinks, true),
    enableFederationCustomSources:
      parseEnvBool(config.enableFederationCustomSources, true),

    // TODO backend env vars
    ignoreWhitelistForActionPostInSpasmModule: undefined,
    ignoreWhitelistForActionReplyInSpasmModule: undefined,
    ignoreWhitelistForActionReactInSpasmModule: undefined,
    ignoreWhitelistForActionOtherInSpasmModule: undefined,

    // RSS feed channel
    enableRssFeedChannel:
      parseEnvBool(config.enableRssFeedChannel, true),

    // Deprecated
    enableRssModule: undefined,
    enableRssSourcesUpdates: undefined,

    // Arrays
    moderators: splitIntoArray(config.moderators),
    whitelistedForActionPost: splitIntoArray(config.whitelistedForActionPost),
    whitelistedForActionReply: splitIntoArray(config.whitelistedForActionReply),
    whitelistedForActionReact: splitIntoArray(config.whitelistedForActionReact),
    pinnedIds: splitIntoArray(config.pinnedIds),
    envCategories: splitIntoArray(config.envCategories),
    federationCustomLinks: splitIntoArray(config.federationCustomLinks),

    // Numbers
    shortUrlsLengthOfWeb3Ids: Number(config.shortUrlsLengthOfWeb3Ids) || 30,
    feedFiltersActivityHot: Number(config.feedFiltersActivityHot) || 5,
    feedFiltersActivityRising: Number(config.feedFiltersActivityRising) || 3,
  })

  get getApiUrl(): string {
      function stripTrailingSlash(
        s?: string | null
      ): string {
        if (!s) return ""
        return s.endsWith('/') ? s.slice(0, -1) : s
      }

      // Client-side: prefer this.state.apiUrl,
      // fallback to location.origin
      if (browser) {
        const fromEnv = stripTrailingSlash(this.state.apiUrl)
        if (fromEnv && typeof(fromEnv) === "string") {
          return fromEnv
        }
        if (
          typeof(window) !== 'undefined' &&
          window?.location?.origin &&
          typeof(window?.location?.origin) === "string"
        ) {
          return stripTrailingSlash(window?.location?.origin)
        }
        return ""
      }

      // // Client-side: use this.state.apiUrl
      // if (process.client) {
      //   return this.state.apiUrl
      // }
      
      /**
       * apiUrlDockerSsr is used for SSR requests inside Docker
       * containers to reach backend via internal DNS because
       * localhost refers to a frontend container itself,
       * not the host.
       * For example, use "http://spasm-backend:5000"
       * instead of external domain.
       */
      // TODO (task 19 / SSR): restore the Docker-SSR internal URL via
      // serverConfig.apiUrlDockerSsr ($lib/server/config) once the SSR
      // strategy is settled. serverConfig is server-only and cannot be
      // imported into this shared module; we fall back to apiUrl below.
      
      // If apiUrlDockerSsr is not set, then the app is probably
      // not running in a container, so fallback to apiUrl.
      return stripTrailingSlash(this.state.apiUrl)
  }

  get getAppConfig(): AppConfig {
      const appConfig = {
        // Strings
        apiUrl:
          this.state.apiUrl,
        // Booleans
        enableAppConfigChanges:
          this.state.enableAppConfigChanges,
        enableAppConfigChangesByAdmin:
          this.state.enableAppConfigChangesByAdmin,
        enableAdmin:
          this.state.enableAdmin,
        enableDefaultIntro:
          this.state.enableDefaultIntro,
        enableDefaultContacts:
          this.state.enableDefaultContacts,
        ifShowDevelopersInfo:
          this.state.ifShowDevelopersInfo,
        enableDefaultHeaderImage:
          this.state.enableDefaultHeaderImage,
        enableDefaultButtonPrimary:
          this.state.enableDefaultButtonPrimary,
        enableDefaultButtonSecondary:
          this.state.enableDefaultButtonSecondary,
        enableCustomIntro:
          this.state.enableCustomIntro,
        enableCustomContacts:
          this.state.enableCustomContacts,
        ifShowContactsInIntro:
          this.state.ifShowContactsInIntro,
        ifShowIntroTutorial:
          this.state.ifShowIntroTutorial,
        ifShowHomeLatestComments:
          this.state.ifShowHomeLatestComments,
        allowNewEventsWithoutSignature:
          this.state.allowNewEventsWithoutSignature,
        enableNewWeb3ActionsAll:
          this.state.enableNewWeb3ActionsAll,
        enableNewWeb3ActionsPost:
          this.state.enableNewWeb3ActionsPost,
        enableNewWeb3ActionsReact:
          this.state.enableNewWeb3ActionsReact,
        enableNewWeb3ActionsReply:
          this.state.enableNewWeb3ActionsReply,
        enableNewWeb3ActionsOther:
          this.state.enableNewWeb3ActionsOther,
        enableNewWeb3ActionsModerate:
          this.state.enableNewWeb3ActionsModerate,
        enableMarkdownInPosts:
          this.state.enableMarkdownInPosts,
        enableMarkdownInComments:
          this.state.enableMarkdownInComments,
        enableEmbedImageTagsForAllUsers:
          this.state.enableEmbedImageTagsForAllUsers,
        enableEmbedImageTagsForFullLineImageLinks:
          this.state.enableEmbedImageTagsForFullLineImageLinks,
        enableEmbedImageTagsInPosts:
          this.state.enableEmbedImageTagsInPosts,
        enableEmbedImageTagsInComments:
          this.state.enableEmbedImageTagsInComments,
        enableEmbedVideoTagsForAllUsers:
          this.state.enableEmbedVideoTagsForAllUsers,
        enableEmbedVideoTagsForFullLineVideoLinks:
          this.state.enableEmbedVideoTagsForFullLineVideoLinks,
        enableEmbedVideoTagsInPosts:
          this.state.enableEmbedVideoTagsInPosts,
        enableEmbedVideoTagsInComments:
          this.state.enableEmbedVideoTagsInComments,
        enableEmbedAudioTagsForAllUsers:
          this.state.enableEmbedAudioTagsForAllUsers,
        enableEmbedAudioTagsForFullLineAudioLinks:
          this.state.enableEmbedAudioTagsForFullLineAudioLinks,
        enableEmbedAudioTagsInPosts:
          this.state.enableEmbedAudioTagsInPosts,
        enableEmbedAudioTagsInComments:
          this.state.enableEmbedAudioTagsInComments,
        ifShowCategoriesFilter:
          this.state.ifShowCategoriesFilter,
        ifAllowGuestLogin:
          this.state.ifAllowGuestLogin,
        enableNewNostrActionsAll:
          this.state.enableNewNostrActionsAll,
        enableNewEthereumActionsAll:
          this.state.enableNewEthereumActionsAll,
        enableModeration:
          this.state.enableModeration,
        enableShortUrlsForWeb3Actions:
          this.state.enableShortUrlsForWeb3Actions,
        enableWhitelistForActionPost:
          this.state.enableWhitelistForActionPost,
        enableWhitelistForActionReply:
          this.state.enableWhitelistForActionReply,
        enableWhitelistForActionReact:
          this.state.enableWhitelistForActionReact,
        enableWhitelistForActionOther:
          this.state.enableWhitelistForActionOther,
        enableSpasmModule:
          this.state.enableSpasmModule,
        enableSpasmSourcesUpdates:
          this.state.enableSpasmSourcesUpdates,
        enableFederationDefaultLists:
          this.state.enableFederationDefaultLists,
        enableFederationDefaultListOfficial:
          this.state.enableFederationDefaultListOfficial,
        enableFederationDefaultListCrypto:
          this.state.enableFederationDefaultListCrypto,
        enableFederationDefaultListPrivacy:
          this.state.enableFederationDefaultListPrivacy,
        enableFederationDefaultListTech:
          this.state.enableFederationDefaultListTech,
        enableFederationDefaultListPolitics:
          this.state.enableFederationDefaultListPolitics,
        enableFederationCustomLinks:
          this.state.enableFederationCustomLinks,
        enableFederationCustomSources:
          this.state.enableFederationCustomSources,
        enableRssModule:
          this.state.enableRssModule,
        enableRssSourcesUpdates:
          this.state.enableRssSourcesUpdates,
        ignoreWhitelistForActionPostInSpasmModule:
          this.state.ignoreWhitelistForActionPostInSpasmModule,
        ignoreWhitelistForActionReplyInSpasmModule:
          this.state.ignoreWhitelistForActionReplyInSpasmModule,
        ignoreWhitelistForActionReactInSpasmModule:
          this.state.ignoreWhitelistForActionReactInSpasmModule,
        ignoreWhitelistForActionOtherInSpasmModule:
          this.state.ignoreWhitelistForActionOtherInSpasmModule,
        enableRssFeedChannel:
          this.state.enableRssFeedChannel,
        // Arrays
        admins:
          this.state.admins,
        moderators:
          this.state.moderators,
        whitelistedForActionPost:
          this.state.whitelistedForActionPost,
        whitelistedForActionReply:
          this.state.whitelistedForActionReply,
        whitelistedForActionReact:
          this.state.whitelistedForActionReact,
        pinnedIds:
          this.state.pinnedIds,
        envCategories:
          this.state.envCategories,
        federationCustomLinks:
          this.state.federationCustomLinks,
        // Numbers
        shortUrlsLengthOfWeb3Ids:
          this.state.shortUrlsLengthOfWeb3Ids,
        feedFiltersActivityHot:
          this.state.feedFiltersActivityHot,
        feedFiltersActivityRising:
          this.state.feedFiltersActivityRising,
        // Strings
        // Strings-default-intro
        faviconTheme:
          this.state.faviconTheme,
        faviconLink:
          this.state.faviconLink,
        defaultHeaderImageLink:
          this.state.defaultHeaderImageLink,
        introTitle: this.state.introTitle,
        introTitleExtra: this.state.introTitleExtra,
        introAbout: this.state.introAbout,
        postPlaceholder: this.state.postPlaceholder,
        commentPlaceholder: this.state.commentPlaceholder,
        defaultButtonPrimaryText:
          this.state.defaultButtonPrimaryText,
        defaultButtonPrimaryLink:
          this.state.defaultButtonPrimaryLink,
        defaultButtonSecondaryText:
          this.state.defaultButtonSecondaryText,
        defaultButtonSecondaryLink:
          this.state.defaultButtonSecondaryLink,
        // Colors
        colorPrimaryDark: this.state.colorPrimaryDark,
        colorPrimaryLight: this.state.colorPrimaryLight,
        colorBaseLight: this.state.colorBaseLight,
        colorBaseDark: this.state.colorBaseDark,
        colorSecondaryLight: this.state.colorSecondaryLight,
        colorSecondaryDark: this.state.colorSecondaryDark,
        colorHoverLight: this.state.colorHoverLight,
        colorHoverDark: this.state.colorHoverDark,
        colorNotImportantLight: this.state.colorNotImportantLight,
        colorNotImportantDark: this.state.colorNotImportantDark,
        colorGreenLight: this.state.colorGreenLight,
        colorGreenDark: this.state.colorGreenDark,
        colorRedLight: this.state.colorRedLight,
        colorRedDark: this.state.colorRedDark,
        colorOrangeLight: this.state.colorOrangeLight,
        colorOrangeDark: this.state.colorOrangeDark,
        colorBlueLight: this.state.colorBlueLight,
        colorBlueDark: this.state.colorBlueDark,
        bgBaseLight: this.state.bgBaseLight,
        bgBaseDark: this.state.bgBaseDark,
        bgSecondaryLight: this.state.bgSecondaryLight,
        bgSecondaryDark: this.state.bgSecondaryDark,
        bgHoverLight: this.state.bgHoverLight,
        bgHoverDark: this.state.bgHoverDark,
        bgDarkLight: this.state.bgDarkLight,
        bgDarkDark: this.state.bgDarkDark,
        borderColorLight: this.state.borderColorLight,
        borderColorDark: this.state.borderColorDark,
        // Strings-socials
        anotherWebsiteLink: this.state.anotherWebsiteLink,
        ipfsLink: this.state.ipfsLink,
        torLink: this.state.torLink,
        ipfsHttpGatewayLink: this.state.ipfsHttpGatewayLink,
        nostrLink: this.state.nostrLink,
        sessionLink: this.state.sessionLink,
        simplexLink: this.state.simplexLink,
        statusLink: this.state.statusLink,
        lensLink: this.state.lensLink,
        farcasterLink: this.state.farcasterLink,
        blueskyLink: this.state.blueskyLink,
        hiveLink: this.state.hiveLink,
        pushLink: this.state.pushLink,
        mirrorLink: this.state.mirrorLink,
        mastodonLink: this.state.mastodonLink,
        matrixLink: this.state.matrixLink,
        discordLink: this.state.discordLink,
        telegramLink: this.state.telegramLink,
        twitterLink: this.state.twitterLink,
        redditLink: this.state.redditLink,
        youtubeLink: this.state.youtubeLink,
        instagramLink: this.state.instagramLink,
        facebookLink: this.state.facebookLink,
        linkedinLink: this.state.linkedinLink,
        wikipediaLink: this.state.wikipediaLink,
        gitLink: this.state.gitLink,
        forgejoLink: this.state.forgejoLink,
        giteaLink: this.state.giteaLink,
        radicleLink: this.state.radicleLink,
        gitlabLink: this.state.gitlabLink,
        codebergLink: this.state.codebergLink,
        bitbucketLink: this.state.bitbucketLink,
        githubLink: this.state.githubLink,
        nostrNpub: this.state.nostrNpub,
        sessionName: this.state.sessionName,
        matrixName: this.state.matrixName,
        lensName: this.state.lensName,
        farcasterName: this.state.farcasterName,
        blueskyName: this.state.blueskyName,
        hiveName: this.state.hiveName,
        pushName: this.state.pushName,
        mirrorName: this.state.mirrorName,
        telegramName: this.state.telegramName,
        twitterName: this.state.twitterName,
        redditName: this.state.redditName,
        signalNumber: this.state.signalNumber,
        whatsappNumber: this.state.whatsappNumber,
        xmppName: this.state.xmppName,
        uniswapLink: this.state.uniswapLink,
        sushiswapLink: this.state.sushiswapLink,
        etherscanLink: this.state.etherscanLink,
        ethvmLink: this.state.ethvmLink,
        coingeckoLink: this.state.coingeckoLink,
        coinmarketcapLink: this.state.coinmarketcapLink,
        dextoolsLink: this.state.dextoolsLink,
        dexscreenerLink: this.state.dexscreenerLink,
        birdeyeLink: this.state.birdeyeLink,
        geckoterminalLink: this.state.geckoterminalLink,
        extraContactInfo: this.state.extraContactInfo,
        // RSS feed channel
        rssFeedChannelTitle: this.state.rssFeedChannelTitle,
        rssFeedChannelLink: this.state.rssFeedChannelLink,
        rssFeedChannelDescription: this.state.rssFeedChannelDescription,
        rssFeedChannelImageLink: this.state.rssFeedChannelImageLink,
      }
      return appConfig
  }

  async fetchAndUpdateAppConfig(
    ): Promise<void> {
      try {
        const apiUrl = this.getApiUrl
        if (!apiUrl) { return }

        const path = apiUrl + '/api/app-config'

        const appConfig = await fetch(path).then(r => r.json())
        if (!appConfig) { return }
        if (typeof(appConfig) !== "object") { return }

        this.updateAppConfig(appConfig)

        // Propagate config to the events store (client-side only;
        // doing this during SSR errored in the original).
        if (browser) {
          useEventsStore().updateStateAppConfig()
        }
      } catch (err) {
        console.error(err);
      }
  }

  updateAppConfig(
    config: AppConfig
  ): void {
      if (!config) { return }
      if (typeof(config) !== "object") { return }
      if (!this.state.enableAppConfigChanges) { return }

      // Booleans
      const updateBoolean = (key: AppConfigKeyBoolean) => {
        if (
          key in config && typeof(config[key]) === "boolean"
        ) { (this.state as Record<string, any>)[key] = config[key] }
      }
      updateBoolean("enableDefaultIntro")
      updateBoolean("enableDefaultContacts")
      updateBoolean("ifShowDevelopersInfo")
      updateBoolean("enableDefaultHeaderImage")
      updateBoolean("enableDefaultButtonPrimary")
      updateBoolean("enableDefaultButtonSecondary")
      updateBoolean("enableCustomIntro")
      updateBoolean("enableCustomContacts")
      updateBoolean("ifShowContactsInIntro")
      updateBoolean("ifShowIntroTutorial")
      updateBoolean("ifShowHomeLatestComments")
      updateBoolean("allowNewEventsWithoutSignature")
      updateBoolean("enableNewWeb3ActionsAll")
      updateBoolean("enableNewWeb3ActionsPost")
      updateBoolean("enableNewWeb3ActionsReact")
      updateBoolean("enableNewWeb3ActionsReply")
      updateBoolean("enableNewWeb3ActionsOther")
      updateBoolean("enableNewWeb3ActionsModerate")
      updateBoolean("enableMarkdownInPosts")
      updateBoolean("enableMarkdownInComments")
      updateBoolean("enableEmbedImageTagsForAllUsers")
      updateBoolean("enableEmbedImageTagsForFullLineImageLinks")
      updateBoolean("enableEmbedImageTagsInPosts")
      updateBoolean("enableEmbedImageTagsInComments")
      updateBoolean("enableEmbedVideoTagsForAllUsers")
      updateBoolean("enableEmbedVideoTagsForFullLineVideoLinks")
      updateBoolean("enableEmbedVideoTagsInPosts")
      updateBoolean("enableEmbedVideoTagsInComments")
      updateBoolean("enableEmbedAudioTagsForAllUsers")
      updateBoolean("enableEmbedAudioTagsForFullLineAudioLinks")
      updateBoolean("enableEmbedAudioTagsInPosts")
      updateBoolean("enableEmbedAudioTagsInComments")
      updateBoolean("ifShowCategoriesFilter")
      updateBoolean("ifAllowGuestLogin")
      updateBoolean("enableNewNostrActionsAll")
      updateBoolean("enableNewEthereumActionsAll")
      updateBoolean("enableModeration")
      updateBoolean("enableShortUrlsForWeb3Actions")
      updateBoolean("enableWhitelistForActionPost")
      updateBoolean("enableWhitelistForActionReply")
      updateBoolean("enableWhitelistForActionReact")
      updateBoolean("enableWhitelistForActionOther")
      updateBoolean("enableSpasmModule")
      updateBoolean("enableFederationDefaultLists")
      updateBoolean("enableFederationDefaultListOfficial")
      updateBoolean("enableFederationDefaultListCrypto")
      updateBoolean("enableFederationDefaultListPrivacy")
      updateBoolean("enableFederationDefaultListTech")
      updateBoolean("enableFederationDefaultListPolitics")
      updateBoolean("enableFederationCustomLinks")
      updateBoolean("enableFederationCustomSources")
      updateBoolean("enableSpasmSourcesUpdates")
      updateBoolean("enableRssModule")
      updateBoolean("enableRssSourcesUpdates")
      updateBoolean("ignoreWhitelistForActionPostInSpasmModule")
      updateBoolean("ignoreWhitelistForActionReactInSpasmModule")
      updateBoolean("ignoreWhitelistForActionReplyInSpasmModule")
      updateBoolean("ignoreWhitelistForActionOtherInSpasmModule")
      updateBoolean("enableRssFeedChannel")

      // Arrays
      const updateArray = (key: AppConfigKeyArray) => {
        if (key in config) {
          if (Array.isArray(config[key])) {
            (this.state as Record<string, any>)[key] = config[key]
          }
        }
      }
      updateArray("moderators")
      updateArray("whitelistedForActionPost")
      updateArray("whitelistedForActionReply")
      updateArray("whitelistedForActionReact")
      updateArray("pinnedIds")
      updateArray("envCategories")
      updateArray("federationCustomLinks")

      // Numbers
      const updateNumber = (key: AppConfigKeyNumber) => {
        if (key in config) {
          if (typeof(config[key]) === "number") {
            (this.state as Record<string, any>)[key] = config[key]
          } else if (Number(config[key])) {
            (this.state as Record<string, any>)[key] = Number(config[key])
          }
        }
      }
      updateNumber("shortUrlsLengthOfWeb3Ids")
      updateNumber("feedFiltersActivityHot")
      updateNumber("feedFiltersActivityRising")

      // Strings
      const updateString = (key: AppConfigKeyString) => {
        if (key in config) {
          if (typeof(config[key]) === "string") {
            (this.state as Record<string, any>)[key] = config[key]
          }
        }
      }
      // Strings-default-intro
      updateString("faviconTheme")
      updateString("faviconLink")
      updateString("defaultHeaderImageLink")
      updateString("introTitle")
      updateString("introTitleExtra")
      updateString("introAbout")
      updateString("postPlaceholder")
      updateString("commentPlaceholder")
      updateString("defaultButtonPrimaryText")
      updateString("defaultButtonPrimaryLink")
      updateString("defaultButtonSecondaryText")
      updateString("defaultButtonSecondaryLink")
      // Colors
      updateString("colorPrimaryLight")
      updateString("colorPrimaryDark")
      updateString("colorBaseLight")
      updateString("colorBaseDark")
      updateString("colorSecondaryLight")
      updateString("colorSecondaryDark")
      updateString("colorHoverLight")
      updateString("colorHoverDark")
      updateString("colorNotImportantLight")
      updateString("colorNotImportantDark")
      updateString("colorGreenLight")
      updateString("colorGreenDark")
      updateString("colorRedLight")
      updateString("colorRedDark")
      updateString("colorOrangeLight")
      updateString("colorOrangeDark")
      updateString("colorBlueLight")
      updateString("colorBlueDark")
      updateString("bgBaseLight")
      updateString("bgBaseDark")
      updateString("bgSecondaryLight")
      updateString("bgSecondaryDark")
      updateString("bgHoverLight")
      updateString("bgHoverDark")
      updateString("bgDarkLight")
      updateString("bgDarkDark")
      updateString("borderColorLight")
      updateString("borderColorDark")
      // Strings-socials
      updateString("anotherWebsiteLink")
      updateString("ipfsLink")
      updateString("torLink")
      updateString("ipfsHttpGatewayLink")
      updateString("nostrLink")
      updateString("sessionLink")
      updateString("simplexLink")
      updateString("statusLink")
      updateString("lensLink")
      updateString("farcasterLink")
      updateString("blueskyLink")
      updateString("hiveLink")
      updateString("pushLink")
      updateString("mirrorLink")
      updateString("mastodonLink")
      updateString("matrixLink")
      updateString("discordLink")
      updateString("telegramLink")
      updateString("twitterLink")
      updateString("redditLink")
      updateString("youtubeLink")
      updateString("instagramLink")
      updateString("facebookLink")
      updateString("linkedinLink")
      updateString("wikipediaLink")
      updateString("gitLink")
      updateString("forgejoLink")
      updateString("giteaLink")
      updateString("radicleLink")
      updateString("gitlabLink")
      updateString("codebergLink")
      updateString("bitbucketLink")
      updateString("githubLink")
      updateString("nostrNpub")
      updateString("sessionName")
      updateString("matrixName")
      updateString("lensName")
      updateString("farcasterName")
      updateString("blueskyName")
      updateString("hiveName")
      updateString("pushName")
      updateString("mirrorName")
      updateString("telegramName")
      updateString("twitterName")
      updateString("redditName")
      updateString("signalNumber")
      updateString("whatsappNumber")
      updateString("xmppName")
      updateString("uniswapLink")
      updateString("sushiswapLink")
      updateString("etherscanLink")
      updateString("ethvmLink")
      updateString("coingeckoLink")
      updateString("coinmarketcapLink")
      updateString("dextoolsLink")
      updateString("dexscreenerLink")
      updateString("birdeyeLink")
      updateString("geckoterminalLink")
      updateString("extraContactInfo")
      updateString("rssFeedChannelTitle")
      updateString("rssFeedChannelLink")
      updateString("rssFeedChannelDescription")
      updateString("rssFeedChannelImageLink")
    }
  }

export const appConfigStore = new AppConfigStore()
export const useAppConfigStore = () => appConfigStore

