import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  // Load all env vars (no prefix filter) so the PWA manifest can
  // read MANIFEST_* / INTRO_TITLE / their PUBLIC_ variants.
  const env = loadEnv(mode, process.cwd(), '');

  const manifestName =
    env.MANIFEST_NAME ||
    env.PUBLIC_MANIFEST_NAME ||
    env.INTRO_TITLE ||
    env.PUBLIC_INTRO_TITLE ||
    'Spasm';
  const manifestShortName =
    env.MANIFEST_SHORT_NAME ||
    env.PUBLIC_MANIFEST_SHORT_NAME ||
    env.INTRO_TITLE ||
    env.PUBLIC_INTRO_TITLE ||
    'Spasm';
  const manifestId =
    env.MANIFEST_ID ||
    env.PUBLIC_MANIFEST_ID ||
    env.INTRO_TITLE ||
    env.PUBLIC_INTRO_TITLE ||
    'Spasm';

  return {
    plugins: [
      tailwindcss(),
      sveltekit(),
      // Skip the PWA plugin under vitest to keep the test run clean.
      ...(mode === 'test'
        ? []
        : [
            SvelteKitPWA({
              registerType: 'autoUpdate',
              // The service worker is registered manually in
              // +layout.svelte (production only).
              injectRegister: false,
              manifest: {
                name: manifestName,
                short_name: manifestShortName,
                id: manifestId,
                background_color: '#000000',
                theme_color: '#000000',
                start_url: '.',
                display: 'standalone',
                lang: 'en',
                icons: [
                  { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
                  { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
                ]
              },
              devOptions: {
                enabled: false,
                type: 'module'
              }
            })
          ])
    ],
    server: {
      // Honor the FRONTEND_DEV_PORT env var (default 3000).
      port: Number(env.FRONTEND_DEV_PORT) || 3000
    },
    preview: {
      port: Number(env.FRONTEND_PROD_PORT) || 3000
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./vitest-setup.ts'],
      include: ['src/**/*.{test,spec}.{js,ts}']
    }
  };
});
