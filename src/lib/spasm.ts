import { spasm as spasmOriginal } from 'spasm.js';

/**
 * Typed facade over spasm.js.
 *
 * The project keeps its own copy of the Spasm types in
 * $lib/types/interfaces, which intentionally diverges from the types
 * bundled inside spasm.js (for example it adds the "app-config-dr"
 * action). Because of that, locally-typed objects fail to type-check
 * as arguments to spasm.js methods even though they are correct at
 * runtime, which would otherwise force a cast at every call site.
 *
 * This facade relaxes every method's argument types to `any` while
 * keeping its return type, so callers still get typed results without
 * fighting the duplicate-declaration mismatch. Import spasm from here
 * ($lib/spasm) instead of directly from 'spasm.js'.
 */
type RelaxArgs<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer R
    ? (...args: any[]) => R
    : T[K];
};

export const spasm = spasmOriginal as RelaxArgs<typeof spasmOriginal>;
