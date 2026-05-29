/// <reference types="vite-plugin-pwa/info" />
/// <reference types="vite-plugin-pwa/vanillajs" />

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
  // Injected by browser extensions: MetaMask/Rabby expose window.ethereum,
  // nos2x/Flamingo expose window.nostr. Typed loosely because the web3
  // layer feature-detects and guards every use.
  interface Window {
    ethereum?: any;
    nostr?: any;
  }
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

export {};
