import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  compilerOptions: {
    // Accessibility is deferred during the Nuxt->Svelte migration (the
    // original app was not a11y-focused, e.g. clickable <div>s). Also
    // drop state_referenced_locally: ported components reference props
    // in script setup (the Vue pattern) and instances are keyed/stable,
    // so the "captures initial value" hint is noise here. Revisit both
    // (a11y + reactivity) later.
    warningFilter: (warning) =>
      !warning.code.startsWith('a11y') &&
      warning.code !== 'state_referenced_locally'
  },

  kit: {
    // adapter-node mirrors the previous Nuxt setup, which ran a
    // standalone Node server (node .output/server/index.mjs) under pm2.
    // After build, run with: node build
    adapter: adapter()
  }
};

export default config;
