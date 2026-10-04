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

	const badges = $derived([
		m.homeBadgeFree(),
		m.homeBadgeOpenSource(),
		`${m.homeBadgeOffline()} (${m.betaTag()})`
	]);
</script>

<section
	class="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-16 gap-y-12 px-4 pt-10 pb-16 md:px-12 lg:pt-24 lg:pb-32"
>
	<div class="flex flex-[1_1_420px] flex-col items-start gap-7">
		<div class="enter-draw" style="--enter-delay: 150ms">
			<AccentStripe />
		</div>
		<p class="enter-up text-xl leading-none font-bold" style="--enter-delay: 250ms">
			{m.homeHeroSubline()}
		</p>
		<h1
			class="enter-up text-5xl leading-none font-extralight tracking-tight lg:text-[67px]"
			style="--enter-delay: 350ms"
		>
			<span class="font-bold">MUN</span>
			{m.homeCaption()}
		</h1>
		<p class="enter-up max-w-[34ch] text-xl leading-[1.3] font-light" style="--enter-delay: 450ms">
			{m.homeHeroText()}
		</p>
		<div class="enter-up mt-1 flex flex-wrap gap-3" style="--enter-delay: 550ms">
			<a class="btn btn-primary btn-lg" href={resolve('/app')}>{m.login()}</a>
			<a
				class="btn btn-outline btn-lg"
				href={resolve('/app/[conferenceId]/mission-control', { conferenceId: LOCAL_CONFERENCE_ID })}
			>
				{m.tryOfflineDemo()}
				<span class="badge badge-warning badge-xs font-bold uppercase">{m.betaTag()}</span>
			</a>
		</div>
		<div class="mt-2 flex flex-wrap gap-2">
			{#each badges as label, i (label)}
				<span
					class="enter-up badge border-0 bg-base-200 text-xs font-bold"
					style="--enter-delay: {650 + i * 70}ms"
				>
					{label}
				</span>
			{/each}
		</div>
	</div>
	<div class="relative flex min-w-0 flex-[1_1_380px] items-center justify-center py-2 sm:py-6">
		<img
			src={blobs[shape % blobs.length]}
			alt=""
			aria-hidden="true"
			class="enter-shape pointer-events-none absolute h-[124%] w-[116%] object-contain dark:opacity-20"
			style="inset: -12% -8%; --enter-delay: 100ms"
		/>
		<img
			src={illustrations[illustration % illustrations.length]}
			alt=""
			class="enter-up relative block h-auto w-full max-w-[320px] sm:max-w-[560px]"
			style="--enter-delay: 400ms"
		/>
	</div>
</section>
