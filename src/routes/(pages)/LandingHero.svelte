<script lang="ts">
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages';
	import { LOCAL_CONFERENCE_ID } from '$lib/state/localDemo.svelte';
	import AccentStripe from '$lib/components/AccentStripe.svelte';

	import theWorldIsMine from '$assets/undraw/the_world_is_mine.svg';
	import world from '$assets/undraw/world.svg';
	import aroundTheWorld from '$assets/undraw/around_the_world.svg';
	import blob1 from '$assets/misc/blobs/blob_1.svg';
	import blob2 from '$assets/misc/blobs/blob_2.svg';
	import blob3 from '$assets/misc/blobs/blob_3.svg';
	import blob4 from '$assets/misc/blobs/blob_4.svg';
	import blob5 from '$assets/misc/blobs/blob_5.svg';

	interface Props {
		// Indices picked per request in +page.server.ts
		illustration: number;
		shape: number;
	}

	let { illustration, shape }: Props = $props();

	const illustrations = [theWorldIsMine, world, aroundTheWorld];
	const blobs = [blob1, blob2, blob3, blob4, blob5];

	const badges = $derived([m.homeBadgeFree(), m.homeBadgeOpenSource(), m.homeBadgeOffline()]);
</script>

<section
	class="mx-auto flex max-w-[1200px] flex-wrap-reverse items-center gap-x-16 gap-y-12 px-4 pt-10 pb-16 md:px-12 lg:pt-24 lg:pb-32"
>
	<div class="flex flex-[1_1_420px] flex-col items-start gap-7">
		<AccentStripe />
		<p class="text-xl leading-none font-bold">{m.homeHeroSubline()}</p>
		<h1 class="text-5xl leading-none font-extralight tracking-tight lg:text-[67px]">
			<span class="font-bold">MUN</span>
			{m.homeCaption()}
		</h1>
		<p class="max-w-[34ch] text-xl leading-[1.3] font-light">{m.homeHeroText()}</p>
		<div class="mt-1 flex flex-wrap gap-3">
			<a class="btn btn-primary btn-lg" href={resolve('/app')}>{m.login()}</a>
			<a
				class="btn btn-outline btn-lg"
				href={resolve('/app/[conferenceId]/mission-control', { conferenceId: LOCAL_CONFERENCE_ID })}
			>
				{m.tryOfflineDemo()}
			</a>
		</div>
		<div class="mt-2 flex flex-wrap gap-2">
			{#each badges as label (label)}
				<span class="badge border-0 bg-base-200 text-xs font-bold">{label}</span>
			{/each}
		</div>
	</div>
	<div class="relative flex min-w-0 flex-[1_1_380px] items-center justify-center py-6">
		<img
			src={blobs[shape % blobs.length]}
			alt=""
			aria-hidden="true"
			class="pointer-events-none absolute h-[124%] w-[116%] object-contain dark:opacity-20"
			style="inset: -12% -8%;"
		/>
		<img
			src={illustrations[illustration % illustrations.length]}
			alt=""
			class="relative block h-auto w-full max-w-[560px]"
		/>
	</div>
</section>
