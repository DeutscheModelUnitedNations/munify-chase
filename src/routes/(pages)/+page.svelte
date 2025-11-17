<script lang="ts">
import { onMount } from "svelte";
import { m } from "$lib/paraglide/messages";

import { media } from "$lib/utils/media.svelte";
import CardSection from "./CardSection.svelte";
import LandingHero from "./LandingHero.svelte";
import TextSection from "./TextSection.svelte";

// Modal state
const versionModalVisible = false;

let loading = $state(true);

onMount(() => (loading = false));
</script>

<div class="flex min-h-screen flex-col items-center">
	{#if loading}
		<div class="absolute bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center">
			<div class="loading loading-dots"></div>
		</div>
	{:else}
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
			</div>
		</div>
	{/if}
</div>
