<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import blob1 from '$lib/assets/misc/blobs/blob_1.svg';
  import blob2 from '$lib/assets/misc/blobs/blob_2.svg';
  import blob3 from '$lib/assets/misc/blobs/blob_3.svg';
  import blob4 from '$lib/assets/misc/blobs/blob_4.svg';
  import blob5 from '$lib/assets/misc/blobs/blob_5.svg';
  import aroundTheWorld from '$lib/assets/undraw/around_the_world.svg';
  import theWorldIsMine from '$lib/assets/undraw/the_world_is_mine.svg';
  import world from '$lib/assets/undraw/world.svg';
  import { m } from '$lib/paraglide/messages';

  const availableIllustrations = [theWorldIsMine, world, aroundTheWorld];
  const availableBlobs = [blob1, blob2, blob3, blob4, blob5];

  const illustration = $state(Math.floor(Math.random() * availableIllustrations.length));
  const blob = $state(Math.floor(Math.random() * availableBlobs.length));
</script>

<div
  class="relative flex flex-col items-center justify-center gap-5 p-4 pt-52 pb-20 lg:flex-row lg:pb-40"
>
  <div class="z-10" in:fly={{ y: 10, duration: 1000, delay: 200 }}>
    <img src={availableIllustrations[illustration]} alt="Logo" width="500" height="128" />
  </div>
  <div in:fade={{ duration: 500 }}>
    <img
      src={availableBlobs[blob]}
      alt="Blob"
      width="800"
      height="128"
      class="absolute top-24 left-0 z-0 md:top-0 lg:top-0 dark:opacity-20"
    />
  </div>
  <div class="z-20 flex w-full flex-col items-center lg:w-1/2 lg:items-end">
    <div in:fly={{ y: 10, duration: 1000, delay: 700 }}>
      <h1
        class="mb-4 text-center font-serif text-5xl leading-tight font-bold lg:text-right lg:text-6xl"
      >
        <span
          class="bg-gradient-to-r from-primary-500 to-primary-800 bg-clip-text text-transparent dark:to-primary-300"
        >
          MUN
        </span>
        {m.homeCaption()}
      </h1>
    </div>
    <div in:fade={{ duration: 1500, delay: 1000 }}>
      <h2
        class="text-center text-xl leading-normal lg:text-right lg:text-2xl dark:text-primary-100"
      >
        {m.homeHeroText()}
      </h2>
    </div>
  </div>
</div>
