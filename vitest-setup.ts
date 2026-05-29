import { vi } from 'vitest';

// $env/* are SvelteKit virtual modules backed by the dev/prod server
// runtime, which is not present under vitest. Mock them with empty env
// so modules that read config (src/lib/config.ts, src/lib/server/
// config.ts) can be imported in unit tests. config.ts still applies its
// own hardcoded fallbacks (colors, favicon, categories) on top.
vi.mock('$env/dynamic/public', () => ({ env: {} }));
vi.mock('$env/dynamic/private', () => ({ env: {} }));
