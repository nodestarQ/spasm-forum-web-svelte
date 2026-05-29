import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-node mirrors the previous Nuxt setup, which ran a
    // standalone Node server (node .output/server/index.mjs) under pm2.
    // After build, run with: node build
    adapter: adapter()
  }
};

export default config;
