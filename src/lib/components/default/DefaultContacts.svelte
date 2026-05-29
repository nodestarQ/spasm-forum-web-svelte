<script lang="ts">
  // Marked converts markdown to HTML
  import { browser } from '$app/environment';
  import DOMPurify from 'dompurify';
  import { marked } from 'marked';
  import { useAppConfigStore } from '$lib/stores/useAppConfigStore.svelte';

  const appConfig = useAppConfigStore()?.getAppConfig;

  const anotherWebsiteLink = appConfig?.anotherWebsiteLink;
  const ipfsLink = appConfig?.ipfsLink;
  const torLink = appConfig?.torLink;
  const ipfsHttpGatewayLink = appConfig?.ipfsHttpGatewayLink;

  const nostrLink = appConfig?.nostrLink;
  const sessionLink = appConfig?.sessionLink;
  const simplexLink = appConfig?.simplexLink;
  const statusLink = appConfig?.statusLink;
  const lensLink = appConfig?.lensLink;
  const farcasterLink = appConfig?.farcasterLink;
  const blueskyLink = appConfig?.blueskyLink;
  const hiveLink = appConfig?.hiveLink;
  const pushLink = appConfig?.pushLink;
  const mirrorLink = appConfig?.mirrorLink;
  const mastodonLink = appConfig?.mastodonLink;
  const matrixLink = appConfig?.matrixLink;
  const discordLink = appConfig?.discordLink;
  const telegramLink = appConfig?.telegramLink;
  const twitterLink = appConfig?.twitterLink;
  const redditLink = appConfig?.redditLink;
  const youtubeLink = appConfig?.youtubeLink;
  const instagramLink = appConfig?.instagramLink;
  const facebookLink = appConfig?.facebookLink;
  const linkedinLink = appConfig?.linkedinLink;
  const wikipediaLink = appConfig?.wikipediaLink;
  const gitLink = appConfig?.gitLink;
  const forgejoLink = appConfig?.forgejoLink;
  const giteaLink = appConfig?.giteaLink;
  const radicleLink = appConfig?.radicleLink;
  const gitlabLink = appConfig?.gitlabLink;
  const codebergLink = appConfig?.codebergLink;
  const bitbucketLink = appConfig?.bitbucketLink;
  const githubLink = appConfig?.githubLink;

  const nostrNpub = appConfig?.nostrNpub;
  const sessionName = appConfig?.sessionName;
  const matrixName = appConfig?.matrixName;
  const lensName = appConfig?.lensName;
  const farcasterName = appConfig?.farcasterName;
  const blueskyName = appConfig?.blueskyName;
  const hiveName = appConfig?.hiveName;
  const pushName = appConfig?.pushName;
  const mirrorName = appConfig?.mirrorName;
  const telegramName = appConfig?.telegramName;
  const twitterName = appConfig?.twitterName;
  const redditName = appConfig?.redditName;
  const signalNumber = appConfig?.signalNumber;
  const whatsappNumber = appConfig?.whatsappNumber;
  const xmppName = appConfig?.xmppName;

  const uniswapLink = appConfig?.uniswapLink;
  const sushiswapLink = appConfig?.sushiswapLink;
  const etherscanLink = appConfig?.etherscanLink;
  const ethvmLink = appConfig?.ethvmLink;
  const coingeckoLink = appConfig?.coingeckoLink;
  const coinmarketcapLink = appConfig?.coinmarketcapLink;
  const dextoolsLink = appConfig?.dextoolsLink;
  const dexscreenerLink = appConfig?.dexscreenerLink;
  const birdeyeLink = appConfig?.birdeyeLink;
  const geckoterminalLink = appConfig?.geckoterminalLink;

  const extraContactInfo = appConfig?.extraContactInfo;

  const purify = (html: string): string =>
    browser ? DOMPurify.sanitize(html) : '';
  const extraContactHtml = extraContactInfo
    ? (marked(extraContactInfo, { breaks: true }) as string)
    : '';
</script>

<div>
  {#if anotherWebsiteLink}
    <div>
      Website:
      <a href={anotherWebsiteLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">{anotherWebsiteLink}</a>
    </div>
  {/if}
  {#if torLink}
    <div>
      Tor:
      <a href={torLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">{torLink}</a>
    </div>
  {/if}
  {#if ipfsLink}
    <div>
      IPFS (Brave browser):
      <a href={ipfsLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">{ipfsLink}</a>
    </div>
  {/if}
  {#if ipfsHttpGatewayLink}
    <div>
      IPFS (any browser):
      <a href={ipfsHttpGatewayLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">{ipfsHttpGatewayLink}</a>
    </div>
  {/if}

  {#if uniswapLink || sushiswapLink}
    <div>
      Trade:
      {#if uniswapLink}<span><a href={uniswapLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Uniswap</a></span>{/if}
      {#if sushiswapLink}<span><a href={sushiswapLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Sushi</a></span>{/if}
    </div>
  {/if}

  {#if etherscanLink || ethvmLink}
    <div>
      Contract:
      {#if etherscanLink}<span><a href={etherscanLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Etherscan</a></span>{/if}
      {#if ethvmLink}<span><a href={ethvmLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">EthVM</a></span>{/if}
    </div>
  {/if}

  {#if coingeckoLink || coinmarketcapLink || dextoolsLink}
    <div>
      Charts:
      {#if coingeckoLink}<span><a href={coingeckoLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Coingecko</a></span>{/if}
      {#if coinmarketcapLink}<span><a href={coinmarketcapLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Coinmarketcap</a></span>{/if}
      {#if dextoolsLink}<span><a href={dextoolsLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Dextools</a></span>{/if}
      {#if dexscreenerLink}<span><a href={dexscreenerLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Dexscreener</a></span>{/if}
      {#if birdeyeLink}<span><a href={birdeyeLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Birdeye</a></span>{/if}
      {#if geckoterminalLink}<span><a href={geckoterminalLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">GeckoTerminal</a></span>{/if}
    </div>
  {/if}

  {#if nostrNpub}
    <div>Nostr: <span>{nostrNpub}</span></div>
  {/if}

  {#if sessionName}
    <div>
      Session:
      <span><a href="https://getsession.org" target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">{sessionName}</a></span>
    </div>
  {/if}

  {#if matrixName}<div>Matrix: <span>{matrixName}</span></div>{/if}
  {#if lensName}<div>Lens: <span>{lensName}</span></div>{/if}
  {#if farcasterName}<div>Farcaster: <span>{farcasterName}</span></div>{/if}
  {#if blueskyName}<div>Bluesky: <span>{blueskyName}</span></div>{/if}
  {#if hiveName}<div>Hive: <span>{hiveName}</span></div>{/if}
  {#if pushName}<div>Push: <span>{pushName}</span></div>{/if}
  {#if mirrorName}<div>Mirror: <span>{mirrorName}</span></div>{/if}

  {#if telegramName}
    <div>
      Telegram:
      {#if telegramName && telegramLink}
        <span><a href={telegramLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">{telegramName}</a></span>
      {/if}
      {#if telegramName && !telegramLink}<span>{telegramName}</span>{/if}
    </div>
  {/if}

  {#if twitterName}<div>Twitter: <span>{twitterName}</span></div>{/if}
  {#if redditName}<div>Reddit: <span>{redditName}</span></div>{/if}
  {#if signalNumber}<div>Signal: <span>{signalNumber}</span></div>{/if}
  {#if whatsappNumber}<div>Whatsapp: <span>{whatsappNumber}</span></div>{/if}
  {#if xmppName}<div>XMPP: <span>{xmppName}</span></div>{/if}

  {#if nostrLink || sessionLink || simplexLink || statusLink || lensLink || farcasterLink || blueskyLink || hiveLink || pushLink || mirrorLink || mastodonLink || matrixLink || discordLink || telegramLink || twitterLink || redditLink || youtubeLink || instagramLink || facebookLink || linkedinLink || wikipediaLink}
    <div>
      Follow:
      {#if nostrLink}<span><a href={nostrLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Nostr</a></span>{/if}
      {#if sessionLink}<span><a href={sessionLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Session</a></span>{/if}
      {#if simplexLink}<span><a href={simplexLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">SimpleX</a></span>{/if}
      {#if statusLink}<span><a href={statusLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Status</a></span>{/if}
      {#if lensLink}<span><a href={lensLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Lens</a></span>{/if}
      {#if farcasterLink}<span><a href={farcasterLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Farcaster</a></span>{/if}
      {#if blueskyLink}<span><a href={blueskyLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Bluesky</a></span>{/if}
      {#if hiveLink}<span><a href={hiveLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Hive</a></span>{/if}
      {#if pushLink}<span><a href={pushLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Push</a></span>{/if}
      {#if mirrorLink}<span><a href={mirrorLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Mirror</a></span>{/if}
      {#if mastodonLink}<span><a href={mastodonLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Mastodon</a></span>{/if}
      {#if matrixLink}<span><a href={matrixLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Matrix</a></span>{/if}
      {#if discordLink}<span><a href={discordLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Discord</a></span>{/if}
      {#if telegramLink}<span><a href={telegramLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Telegram</a></span>{/if}
      {#if twitterLink}<span><a href={twitterLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Twitter</a></span>{/if}
      {#if redditLink}<span><a href={redditLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Reddit</a></span>{/if}
      {#if youtubeLink}<span><a href={youtubeLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Youtube</a></span>{/if}
      {#if instagramLink}<span><a href={instagramLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Instagram</a></span>{/if}
      {#if facebookLink}<span><a href={facebookLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Facebook</a></span>{/if}
      {#if linkedinLink}<span><a href={linkedinLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">LinkedIn</a></span>{/if}
      {#if wikipediaLink}<span><a href={wikipediaLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Wikipedia</a></span>{/if}
    </div>
  {/if}

  {#if gitLink || forgejoLink || giteaLink || radicleLink || gitlabLink || codebergLink || bitbucketLink || githubLink}
    <div>
      Code:
      {#if gitLink}<span><a href={gitLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Git</a></span>{/if}
      {#if forgejoLink}<span><a href={forgejoLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Forgejo</a></span>{/if}
      {#if giteaLink}<span><a href={giteaLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Gitea</a></span>{/if}
      {#if radicleLink}<span><a href={radicleLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Radicle</a></span>{/if}
      {#if gitlabLink}<span><a href={gitlabLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">GitLab</a></span>{/if}
      {#if codebergLink}<span><a href={codebergLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Codeberg</a></span>{/if}
      {#if bitbucketLink}<span><a href={bitbucketLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Bitbucket</a></span>{/if}
      {#if githubLink}<span><a href={githubLink} target="_blank" class="text-colorPrimary-light dark:text-colorPrimary-dark">Github</a></span>{/if}
    </div>
  {/if}

  {#if extraContactInfo}
    <div class="whitespace-pre-line">
      <div>{@html purify(extraContactHtml)}</div>
    </div>
  {/if}
</div>
