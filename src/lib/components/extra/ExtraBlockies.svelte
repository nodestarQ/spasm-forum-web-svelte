<script lang="ts">
  // Source: https://github.com/afa7789/BlockiesVue (ported to Svelte 5)
  let {
    seed = '',
    color = undefined,
    bgcolor = undefined,
    size = undefined,
    scale = undefined,
    spotcolor = undefined
  }: {
    seed?: string;
    color?: string;
    bgcolor?: string;
    size?: number;
    scale?: number;
    spotcolor?: string;
  } = $props();

  let canvas = $state<HTMLCanvasElement | undefined>();
  const randseed = new Array(4);

  const seedrand = (s: string) => {
    for (let i = 0; i < randseed.length; i++) randseed[i] = 0;
    for (let i = 0; i < s.length; i++) {
      randseed[i % 4] =
        (randseed[i % 4] << 5) - randseed[i % 4] + s.charCodeAt(i);
    }
  };

  const rand = () => {
    // based on Java's String.hashCode(), expanded to 4 32bit values
    const t = randseed[0] ^ (randseed[0] << 11);
    randseed[0] = randseed[1];
    randseed[1] = randseed[2];
    randseed[2] = randseed[3];
    randseed[3] = randseed[3] ^ (randseed[3] >> 19) ^ t ^ (t >> 8);
    return (randseed[3] >>> 0) / ((1 << 31) >>> 0);
  };

  const createColor = () => {
    const h = Math.floor(rand() * 360);
    const s = rand() * 60 + 40 + '%';
    const l = (rand() + rand() + rand() + rand()) * 25 + '%';
    return 'hsl(' + h + ',' + s + ',' + l + ')';
  };

  const createImageData = (sz: number) => {
    const width = sz;
    const height = sz;
    const dataWidth = Math.ceil(width / 2);
    const mirrorWidth = width - dataWidth;
    const data: number[] = [];
    for (let y = 0; y < height; y++) {
      let row: number[] = [];
      for (let x = 0; x < dataWidth; x++) {
        row[x] = Math.floor(rand() * 2.3);
      }
      const r = row.slice(0, mirrorWidth);
      r.reverse();
      row = row.concat(r);
      for (let i = 0; i < row.length; i++) data.push(row[i]);
    }
    return data;
  };

  const buildOpts = () => {
    const newOpts: any = {};
    newOpts.seed =
      seed || Math.floor(Math.random() * Math.pow(10, 16)).toString(16);
    seedrand(newOpts.seed);
    newOpts.size = size || 8;
    newOpts.scale = scale || 4;
    newOpts.color = color || createColor();
    newOpts.bgcolor = bgcolor || createColor();
    newOpts.spotcolor = spotcolor || createColor();
    return newOpts;
  };

  const renderIcon = (cv: HTMLCanvasElement) => {
    const opts = buildOpts();
    const imageData = createImageData(opts.size);
    const width = Math.sqrt(imageData.length);
    cv.width = cv.height = opts.size * opts.scale;
    const cc = cv.getContext('2d');
    if (!cc) return;
    cc.fillStyle = opts.bgcolor;
    cc.fillRect(0, 0, cv.width, cv.height);
    cc.fillStyle = opts.color;
    for (let i = 0; i < imageData.length; i++) {
      if (imageData[i]) {
        const row = Math.floor(i / width);
        const col = i % width;
        cc.fillStyle = imageData[i] === 1 ? opts.color : opts.spotcolor;
        cc.fillRect(col * opts.scale, row * opts.scale, opts.scale, opts.scale);
      }
    }
  };

  // Re-render whenever the seed/scale change (replaces the Vue :key trick).
  $effect(() => {
    void seed;
    void scale;
    if (canvas) renderIcon(canvas);
  });
</script>

<span>
  <canvas bind:this={canvas} class="Blockies max-w-[82px]"></canvas>
</span>
