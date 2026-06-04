// Applies the admin-configured theme colors and favicon at
// runtime. The previous app did this server-side; here
// it runs client-side from the fetched app config (the static
// :root defaults in app.css cover the initial server render).

// [config key, CSS variable, default value]
const COLOR_VARS: Array<[string, string, string]> = [
  ['colorPrimaryLight', '--color-primary-light', '#f420af'],
  ['colorPrimaryDark', '--color-primary-dark', '#f420af'],
  ['colorBaseLight', '--color-base-light', '#000000'],
  ['colorBaseDark', '--color-base-dark', '#d8d8d8'],
  ['colorSecondaryLight', '--color-secondary-light', '#000000'],
  ['colorSecondaryDark', '--color-secondary-dark', '#ffffff'],
  ['colorHoverLight', '--color-hover-light', '#243746'],
  ['colorHoverDark', '--color-hover-dark', '#cbd4d1'],
  ['colorNotImportantLight', '--color-not-important-light', '#9b8bc6'],
  ['colorNotImportantDark', '--color-not-important-dark', '#706297'],
  ['colorGreenLight', '--color-green-light', '#089703'],
  ['colorGreenDark', '--color-green-dark', '#0ad203'],
  ['colorRedLight', '--color-red-light', '#ff0a0a'],
  ['colorRedDark', '--color-red-dark', '#ff0a0a'],
  ['colorOrangeLight', '--color-orange-light', '#f4af0c'],
  ['colorOrangeDark', '--color-orange-dark', '#f4af0c'],
  ['colorBlueLight', '--color-blue-light', '#3a3dff'],
  ['colorBlueDark', '--color-blue-dark', '#3a3dff'],
  ['bgBaseLight', '--bg-base-light', '#fafafa'],
  ['bgBaseDark', '--bg-base-dark', '#0F0F0F'],
  ['bgSecondaryLight', '--bg-secondary-light', '#f0f0f0'],
  ['bgSecondaryDark', '--bg-secondary-dark', '#181818'],
  ['bgHoverLight', '--bg-hover-light', '#e3e3e3'],
  ['bgHoverDark', '--bg-hover-dark', '#1f1f1f'],
  ['bgDarkLight', '--bg-dark-light', '#bbbbbb'],
  ['bgDarkDark', '--bg-dark-dark', '#000000'],
  ['borderColorLight', '--border-color-light', '#dddddd'],
  ['borderColorDark', '--border-color-dark', '#312d3e']
];

const FAVICON_MAP: Record<string, string> = {
  spasm: '/favicons/spasm.ico',
  monero: '/favicons/monero.ico',
  zcash: '/favicons/zcash.ico',
  ethereum: '/favicons/ethereum.ico',
  bitcoin: '/favicons/bitcoin.ico',
  solana: '/favicons/solana.ico',
  campfire: '/favicons/campfire.ico',
  chat: '/favicons/chat.ico',
  cube: '/favicons/cube.ico',
  research: '/favicons/research.ico',
  rocket: '/favicons/rocket.ico',
  roger: '/favicons/roger.ico',
  default: '/favicon.ico'
};

export const applyThemeColors = (c?: Record<string, any> | null): void => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  for (const [key, varName, def] of COLOR_VARS) {
    root.style.setProperty(varName, c?.[key] || def);
  }
};

export const resolveFaviconPath = (c?: Record<string, any> | null): string => {
  const theme = c?.faviconTheme;
  if (theme === 'custom-link') {
    return c?.faviconLink && typeof c.faviconLink === 'string'
      ? c.faviconLink
      : '/favicon.ico';
  }
  if (theme && typeof theme === 'string' && theme in FAVICON_MAP) {
    return FAVICON_MAP[theme];
  }
  return '/favicon.ico';
};

const ensureHtmlLink = (
  selector: string,
  createAttrs: Record<string, string>
): HTMLLinkElement => {
  let link = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement('link');
    for (const [k, v] of Object.entries(createAttrs)) link.setAttribute(k, v);
    document.head.appendChild(link);
  }
  return link;
};

export const applyFavicon = (c?: Record<string, any> | null): void => {
  if (typeof document === 'undefined') return;
  const href = resolveFaviconPath(c);
  const icon = ensureHtmlLink("link[rel='icon']", {
    rel: 'icon',
    type: 'image/x-icon'
  });
  icon.setAttribute('type', 'image/x-icon');
  icon.setAttribute('href', href);
  const shortcut = ensureHtmlLink("link[rel='shortcut icon']", {
    rel: 'shortcut icon'
  });
  shortcut.setAttribute('href', href);
  const apple = ensureHtmlLink("link[rel='apple-touch-icon'][sizes='512x512']", {
    rel: 'apple-touch-icon',
    sizes: '512x512'
  });
  apple.setAttribute('href', href);
};
