<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { configPublic } from '$config/public';
	import LandingHero from './LandingHero.svelte';
	import CardSection from './CardSection.svelte';
	import TextSection from './TextSection.svelte';
	import ContactSection from './ContactSection.svelte';
	import SplitSection from './SplitSection.svelte';
	import { resolve } from '$app/paths';
	import { LOCAL_CONFERENCE_ID } from '$lib/state/localDemo.svelte';

	let { data } = $props();

	const jsonLd = $derived(
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'SoftwareApplication',
			name: 'MUNify CHASE',
			applicationCategory: 'BusinessApplication',
			operatingSystem: 'Web',
			url: 'https://chase.munify.cloud/',
			description: m.seoDescription(),
			offers: {
				'@type': 'Offer',
				price: '0',
				priceCurrency: 'EUR'
			},
			author: {
				'@type': 'Organization',
				name: 'Deutsche Model United Nations (DMUN) e.V.',
				url: 'https://dmun.de'
			}
		})
	);
</script>

<svelte:head>
	<title>{m.seoTitle()}</title>
	<meta name="description" content={m.seoDescription()} />
	<link rel="canonical" href="https://chase.munify.cloud/" />

	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://chase.munify.cloud/" />
	<meta property="og:title" content={m.seoTitle()} />
	<meta property="og:description" content={m.seoDescription()} />
	<meta property="og:site_name" content="MUNify CHASE" />
	<meta property="og:image" content="https://chase.munify.cloud/favicon-96x96.png" />

	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={m.seoTitle()} />
	<meta name="twitter:description" content={m.seoDescription()} />
	<meta name="twitter:image" content="https://chase.munify.cloud/favicon-96x96.png" />

	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html `<${'script'} type="application/ld+json">${jsonLd}</${'script'}>`}
</svelte:head>

<LandingHero illustration={data.hero.illustration} shape={data.hero.shape} />

<CardSection />

<SplitSection inverse title={m.homeOfflineTitle()} text={m.homeOfflineText()}>
	<a
		class="btn border-neutral-content bg-neutral-content text-neutral w-full sm:w-auto"
		href={resolve('/app/[conferenceId]/mission-control', { conferenceId: LOCAL_CONFERENCE_ID })}
	>
		{m.homeOfflineButtonLabel()}
		<span class="badge badge-warning badge-xs font-bold uppercase">{m.betaTag()}</span>
	</a>
	<p class="max-w-[66ch] text-sm italic opacity-80">{m.homeOfflineBetaNote()}</p>
</SplitSection>

<SplitSection title={m.homeDocsTitle()} text={m.homeDocsText()}>
	<div class="flex flex-wrap gap-3">
		<a class="btn btn-primary w-full sm:w-auto" href="https://munify.cloud/chase" target="_blank">
			{m.homeDocsButtonLabel()}
		</a>
		<a
			class="btn btn-outline w-full sm:w-auto"
			href="https://munify.cloud/chase/user-manual/chair/getting-started"
			target="_blank"
		>
			{m.homeDocsChairLabel()}
		</a>
		<a
			class="btn btn-outline w-full sm:w-auto"
			href="https://munify.cloud/chase/user-manual/participant/getting-started"
			target="_blank"
		>
			{m.homeDocsParticipantLabel()}
		</a>
		<a
			class="btn btn-outline w-full sm:w-auto"
			href="https://munify.cloud/chase/user-manual/admin/getting-started"
			target="_blank"
		>
			{m.homeDocsAdminLabel()}
		</a>
	</div>
</SplitSection>

<section class="mx-auto max-w-[1200px] px-4 pb-16 md:px-12 lg:pb-32">
	<div class="border-base-content grid grid-cols-1 gap-x-16 gap-y-14 border-t pt-14 md:grid-cols-2">
		<TextSection title={m.homeAboutTitle()} text={m.homeAboutText()} />
		<TextSection title={m.homeMissionTitle()} text={m.homeMissionText()}>
			<a class="link link-primary font-bold" href="https://dmun.de" target="_blank">
				{m.homeMissionButtonLabel()}
			</a>
		</TextSection>
		<TextSection title={m.homeContributeTitle()} text={m.homeContributeText()}>
			<a
				class="link link-primary font-bold"
				href="https://github.com/DeutscheModelUnitedNations/munify-chase"
				target="_blank"
			>
				{m.homeContributeButtonLabel()}
			</a>
		</TextSection>
		<TextSection title={m.homeHostingTitle()} text={m.homeHostingText()}>
			{#if configPublic.PUBLIC_CONTACT_EMAIL}
				<a class="link link-primary font-bold" href="mailto:{configPublic.PUBLIC_CONTACT_EMAIL}">
					{m.homeHostingButtonLabel()}
				</a>
			{/if}
		</TextSection>
	</div>
</section>

<ContactSection />
