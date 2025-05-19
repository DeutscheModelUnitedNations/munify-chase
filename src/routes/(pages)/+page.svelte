<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { setLocale } from '$lib/paraglide/runtime';
	import type { PageData } from './$houdini';
	import { getContext } from 'svelte';
	import LandingHero from './LandingHero.svelte';
	import CardSection from './CardSection.svelte';
	import TextSection from './TextSection.svelte';
	import { media } from '$lib/utils/media.svelte';

	let { data }: { data: PageData } = $props();

	// Modal state
	let versionModalVisible = false;
</script>

<div class="flex flex-col items-center">
	<div class="max-w-7xl">
		<LandingHero />

		{#if $media.isTabletOrMobile}
			<div class="flex h-40 w-full items-center justify-center bg-white">
				<img
					src="/logo/svg/chase_logo_blue_text.svg"
					style="object-fit:contain"
					width="300"
					height="100"
					alt="Chase Logo"
				/>
			</div>
		{/if}

		<CardSection />

		<div
			class="align-items-start flex flex-col gap-2 p-4 lg:grid lg:flex-none lg:gap-10 lg:p-20"
			style="grid-template-columns: auto 1fr;"
		>
			<TextSection title={m.homeAboutTitle()} text={m.homeAboutText()} />
			<TextSection title={m.homeMissionTitle()} text={m.homeMissionText()}>
				<a class="btn btn-primary" href="https://dmun.de" target="_blank">
					<i class="fas fa-external-link mr-2"></i>
					{m.homeMissionButtonLabel()}
				</a>
			</TextSection>
			<TextSection title={m.homeContributeTitle()} text={m.homeContributeText()}>
				<a
					class="btn btn-primary"
					href="https://github.com/DeutscheModelUnitedNations/munify-chase"
					target="_blank"
				>
					<i class="fas fa-code-branch mr-2"></i>
					{m.homeContributeButtonLabel()}
				</a>
			</TextSection>
		</div>
	</div>
</div>
