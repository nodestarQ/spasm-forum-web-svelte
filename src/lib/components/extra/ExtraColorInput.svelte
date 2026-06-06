<script lang="ts">
  // Cross-browser color control: a uniformly styled swatch (the native
  // picker chrome differs a lot between browsers) plus a hex text field
  // you can type or paste into. Both edit the same value.
  let {
    value = $bindable(null),
    ariaLabel = ''
  }: {
    value?: string | null;
    ariaLabel?: string;
  } = $props();

  let hex = $state(value ?? '');
  let focused = $state(false);

  // Reflect external changes (theme buttons, reset, delete-all) into the
  // text field, but never while the user is mid-edit.
  $effect(() => {
    if (!focused) hex = value ?? '';
  });

  // Accept #rgb or #rrggbb, with or without the leading #. Returns the
  // canonical #rrggbb, or null when the input isn't a complete color.
  const normalize = (s: string): string | null => {
    let v = s.trim();
    if (!v) return null;
    if (v[0] !== '#') v = '#' + v;
    if (/^#[0-9a-fA-F]{3}$/.test(v)) {
      v = '#' + v.slice(1).split('').map((c) => c + c).join('');
    }
    return /^#[0-9a-fA-F]{6}$/.test(v) ? v.toLowerCase() : null;
  };

  const swatchValue = $derived(normalize(value ?? '') ?? '#000000');
  const isValid = $derived(hex.trim() === '' || normalize(hex) !== null);

  const onSwatch = (e: Event) => {
    const v = (e.currentTarget as HTMLInputElement).value;
    value = v;
    hex = v;
  };

  const onHexInput = (e: Event) => {
    hex = (e.currentTarget as HTMLInputElement).value;
    const norm = normalize(hex);
    if (norm) value = norm; // live preview only on a complete color
  };

  const onHexBlur = () => {
    focused = false;
    if (hex.trim() === '') {
      value = null;
    } else {
      const norm = normalize(hex);
      if (norm) {
        value = norm;
        hex = norm; // canonicalize the display
      } else {
        hex = value ?? ''; // discard an incomplete/invalid entry
      }
    }
  };
</script>

<span class="inline-flex items-center gap-2">
  <input
    type="color"
    class="color-swatch h-7 w-7 shrink-0 cursor-pointer rounded-md border border-borderColor-light dark:border-borderColor-dark"
    aria-label={ariaLabel}
    value={swatchValue}
    oninput={onSwatch}
  />
  <input
    type="text"
    spellcheck="false"
    autocomplete="off"
    placeholder="#rrggbb"
    aria-label={ariaLabel ? `${ariaLabel} hex` : 'hex color'}
    value={hex}
    oninput={onHexInput}
    onfocus={() => (focused = true)}
    onblur={onHexBlur}
    class="w-24 rounded-md border bg-bgBase-light dark:bg-bgBase-dark px-2 py-1 font-mono text-sm text-colorBase-light dark:text-colorBase-dark focus:outline-none
      {isValid
        ? 'border-borderColor-light dark:border-borderColor-dark focus:border-colorPrimary-light dark:focus:border-colorPrimary-dark'
        : 'border-colorRed-light dark:border-colorRed-dark'}"
  />
</span>

<style>
  /* Strip the native chrome so the swatch looks identical everywhere.
     Size, border and radius come from Tailwind classes above. */
  .color-swatch {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    padding: 0;
    background: transparent;
  }
  .color-swatch::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  .color-swatch::-webkit-color-swatch {
    border: none;
    border-radius: 0.3125rem;
  }
  .color-swatch::-moz-color-swatch {
    border: none;
    border-radius: 0.3125rem;
  }
</style>
