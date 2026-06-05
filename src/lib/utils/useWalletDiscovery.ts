/**
 * EIP-6963 (Multi Injected Provider Discovery).
 *
 * Instead of reading the single, race-prone window.ethereum slot,
 * the page asks every installed wallet to announce itself and
 * collects them into a reactive list. Each entry carries the
 * wallet's own name/icon plus its dedicated EIP-1193 provider, so
 * the UI can show the real wallets a user has and connect to the
 * exact one they click (see ExtraWeb3Modal). The discovered
 * provider is handed straight to ethers.BrowserProvider in
 * useWeb3, so this stays library-agnostic.
 */
import { ref, readonly } from '$lib/ref.svelte'

export interface Eip6963ProviderInfo {
  uuid: string   // random per page load, not stable across reloads
  name: string   // human label, e.g. "MetaMask", "Rabby"
  icon: string   // data: URI, safe to use directly in <img src>
  rdns: string   // reverse-DNS id, e.g. "io.metamask" (stable)
}

export interface Eip6963ProviderDetail {
  info: Eip6963ProviderInfo
  // EIP-1193 provider for this specific wallet. Typed loosely to
  // match window.ethereum (see app.d.ts); every use is guarded.
  provider: any
}

const wallets = ref<Eip6963ProviderDetail[]>([])
let listening = false

const onAnnounce = (event: Event): void => {
  const detail = (event as CustomEvent<Eip6963ProviderDetail>).detail
  if (!detail?.info?.rdns || !detail?.provider) return
  // A wallet can announce more than once (e.g. repeated requests),
  // so de-dupe by its stable rdns.
  if (wallets.value.some(w => w.info.rdns === detail.info.rdns)) {
    return
  }
  wallets.value = [...wallets.value, detail]
}

export const useWalletDiscovery = () => {
  // Attach the announce listener once, then (re)ask wallets to
  // announce. Safe to call on every modal mount: the listener is
  // only added once and duplicates are filtered out by rdns.
  const discover = (): void => {
    if (typeof window === 'undefined') return // SSR: no window
    if (!listening) {
      listening = true
      window.addEventListener('eip6963:announceProvider', onAnnounce)
    }
    window.dispatchEvent(new Event('eip6963:requestProvider'))
  }

  return { wallets: readonly(wallets), discover }
}
