/**
 * Minimal replacement for Nuxt's useFetch, covering the usage in the
 * ported stores: GET a path (with an optional query object) and return
 * the parsed JSON shaped as { data: { value }, error: { value } } to
 * match the old `const { data, error } = await useFetch(path, { query })`
 * call sites (which read .value synchronously after the await).
 *
 * This is a plain fetch wrapper, not the SSR-aware Nuxt composable. The
 * stores fetch on the client, so that is sufficient; richer loading can
 * move to SvelteKit load() functions later if needed.
 */
export const useFetch = async (
  path: string,
  opts?: { query?: Record<string, any> }
): Promise<{ data: { value: any }; error: { value: any } }> => {
  let url = path
  if (opts?.query) {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(opts.query)) {
      // Include false (e.g. webType=false), skip only undefined/null,
      // matching how Nuxt serialized these query params.
      if (value !== undefined && value !== null) {
        params.append(key, String(value))
      }
    }
    const qs = params.toString()
    if (qs) url += (url.includes('?') ? '&' : '?') + qs
  }
  try {
    const res = await fetch(url)
    const data = await res.json()
    return { data: { value: data }, error: { value: null } }
  } catch (err) {
    return { data: { value: null }, error: { value: err } }
  }
}
