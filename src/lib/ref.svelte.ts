/**
 * Vue-ref-compatible reactive boxes backed by Svelte 5 runes.
 *
 * Several ported modules (useWeb3, the notification store, and the feed
 * filter composables) were written against Vue's ref()/readonly() and
 * access their state through `.value`. These shims keep that exact API
 * so the logic ports with its `.value` accesses intact, while the
 * underlying reactivity is Svelte's $state. A component that reads
 * `.value` tracks the $state and updates reactively, and mutating a
 * ref that holds an object (e.g. `box.value.show = true`) is reactive
 * too, because $state proxies objects deeply.
 */
export interface Ref<T> {
  value: T;
}

export interface ReadonlyRef<T> {
  readonly value: T;
}

export function ref<T>(initial: T): Ref<T> {
  let value = $state(initial);
  return {
    get value() {
      return value;
    },
    set value(v: T) {
      value = v;
    }
  };
}

export function readonly<T>(r: Ref<T>): ReadonlyRef<T> {
  return {
    get value() {
      return r.value;
    }
  };
}
