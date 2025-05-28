<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { m } from '$lib/paraglide/messages';

	import theWorldIsMine from '$assets/undraw/the_world_is_mine.svg';
	import world from '$assets/undraw/world.svg';
	import aroundTheWorld from '$assets/undraw/around_the_world.svg';
	import blob1 from '$assets/misc/blobs/blob_1.svg';
	import blob2 from '$assets/misc/blobs/blob_2.svg';
	import blob3 from '$assets/misc/blobs/blob_3.svg';
	import blob4 from '$assets/misc/blobs/blob_4.svg';
	import blob5 from '$assets/misc/blobs/blob_5.svg';

	const availableIllustrations = [theWorldIsMine, world, aroundTheWorld];
	const availableBlobs = [blob1, blob2, blob3, blob4, blob5];

	let illustration = $state(Math.floor(Math.random() * availableIllustrations.length));
	let blob = $state(Math.floor(Math.random() * availableBlobs.length));
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
			class="absolute top-24 left-0 z-0 md:top-0 lg:top-0"
		/>
	</div>
	<div class="z-20 flex w-full flex-col items-center lg:w-1/2 lg:items-end">
		<div in:fly={{ y: 10, duration: 1000, delay: 700 }}>
			<h1
				class="mb-4 text-center font-serif text-5xl leading-tight font-bold text-slate-900 lg:text-right lg:text-6xl dark:text-white"
			>
				<span
					style="background: linear-gradient(to right, #3d7dd2, #0000d0); background-clip: text; -webkit-background-clip: text; color: transparent;"
				>
					MUN
				</span>
				{m.homeCaption()}
			</h1>
		</div>
		<div in:fade={{ duration: 1500, delay: 1000 }}>
			<h2
				class="text-center text-xl leading-normal text-slate-900 lg:text-right lg:text-2xl dark:text-white"
			>
				{m.homeHeroText()}
			</h2>
		</div>
	</div>
</div>
