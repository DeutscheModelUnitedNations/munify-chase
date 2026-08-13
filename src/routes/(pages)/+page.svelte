<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import LandingHero from './LandingHero.svelte';
	import CardSection from './CardSection.svelte';
	import TextSection from './TextSection.svelte';
	import ContactSection from './ContactSection.svelte';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { LOCAL_CONFERENCE_ID } from '$lib/state/localDemo.svelte';

	let loading = $state(true);

	onMount(() => (loading = false));

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

<div class="flex min-h-screen flex-col items-center">
	{#if loading}
		<div class="absolute top-0 right-0 bottom-0 left-0 z-50 flex items-center justify-center">
			<div class="loading loading-dots"></div>
		</div>
	{:else}
		<div class="max-w-7xl">
			<LandingHero />

			<!-- {#if $media.isTabletOrMobile}
				<div class="flex h-40 w-full items-center justify-center bg-base-100">
					<img
						src="/logo/svg/chase_logo_blue_text.svg"
						style="object-fit:contain"
						width="300"
						height="100"
						alt="Chase Logo"
					/>
				</div>
			{/if} -->

			<CardSection />

			<div
				class="align-items-start flex flex-col gap-2 p-4 lg:grid lg:flex-none lg:gap-10 lg:p-20"
				style="grid-template-columns: auto 1fr;"
			>
				<TextSection title={m.homeAboutTitle()} text={m.homeAboutText()} />
				<TextSection title={m.homeMissionTitle()} text={m.homeMissionText()}>
					<a class="btn btn-primary mt-3" href="https://dmun.de" target="_blank">
						<i class="fas fa-external-link mr-2"></i>
						{m.homeMissionButtonLabel()}
					</a>
				</TextSection>
				<TextSection title={m.homeContributeTitle()} text={m.homeContributeText()}>
					<a
						class="btn btn-primary mt-3"
						href="https://github.com/DeutscheModelUnitedNations/munify-chase"
						target="_blank"
					>
						<i class="fas fa-code-branch mr-2"></i>
						{m.homeContributeButtonLabel()}
					</a>
				</TextSection>
				<TextSection title={m.homeOfflineTitle()} text={m.homeOfflineText()}>
					<a
						class="btn btn-primary mt-3"
						href={resolve('/app/[conferenceId]/mission-control', {
							conferenceId: LOCAL_CONFERENCE_ID
						})}
					>
						<i class="fa-duotone fa-cloud-slash mr-2"></i>
						{m.homeOfflineButtonLabel()}
					</a>
				</TextSection>
				<TextSection title={m.homeDocsTitle()} text={m.homeDocsText()}>
					<a class="btn btn-primary mt-3" href="https://munify.cloud/chase" target="_blank">
						<i class="fas fa-book mr-2"></i>
						{m.homeDocsButtonLabel()}
					</a>
					<div class="mt-2 flex flex-wrap justify-center gap-2 lg:justify-start">
						<a
							class="btn btn-outline btn-sm"
							href="https://munify.cloud/chase/user-manual/chair/getting-started"
							target="_blank"
						>
							{m.homeDocsChairLabel()}
						</a>
						<a
							class="btn btn-outline btn-sm"
							href="https://munify.cloud/chase/user-manual/delegate/getting-started"
							target="_blank"
						>
							{m.homeDocsDelegateLabel()}
						</a>
						<a
							class="btn btn-outline btn-sm"
							href="https://munify.cloud/chase/user-manual/admin/getting-started"
							target="_blank"
						>
							{m.homeDocsAdminLabel()}
						</a>
					</div>
				</TextSection>
				<TextSection title={m.homeHostingTitle()} text={m.homeHostingText()}>
					<a class="btn btn-primary mt-3" href="mailto:vorstand@dmun.de">
						<i class="fas fa-envelope mr-2"></i>
						{m.homeHostingButtonLabel()}
					</a>
				</TextSection>
			</div>

			<ContactSection />
		</div>
	{/if}
</div>
