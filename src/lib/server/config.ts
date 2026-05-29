import { env } from '$env/dynamic/private';

/**
 * Server-only config. Files under $lib/server can only be imported
 * into server-side code, so private values never reach the client.
 *
 * apiUrlDockerSsr is used for SSR requests inside Docker containers to
 * reach the backend via internal DNS (e.g. http://spasm-backend:5000),
 * because localhost would refer to the frontend container itself, not
 * the host. The appConfig store's getApiUrl() picks this during SSR.
 */
export const serverConfig = {
  apiUrlDockerSsr: env.API_URL_DOCKER_SSR || ''
};

export type ServerConfig = typeof serverConfig;
