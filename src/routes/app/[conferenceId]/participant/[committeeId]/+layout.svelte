<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import type { LayoutData } from './$houdini';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import type { Snippet } from 'svelte';

	let { data, children }: { data: LayoutData; children: Snippet } = $props();

	let layoutQuery = $derived(data?.ParticipantCommitteeLayoutQuery);
	let identityQuery = $derived(data?.ParticipantIdentityQuery);
	let committee = $derived($layoutQuery.data?.findFirstCommittee);
	let conferenceUser = $derived($identityQuery.data?.findManyConferenceUser?.[0]);
	let role = $derived(conferenceUser?.conferenceUserType);
	let showBack = $derived(role !== 'DELEGATE');

	let isPapersRoute = $derived(page.route.id?.includes('/papers') ?? false);
</script>

{#if committee}
	<!-- Top navbar -->
	<div class="navbar bg-base-100 shadow-sm">
		{#if showBack}
			<div class="flex-none">
				<a
					class="btn btn-ghost btn-sm"
					href="/app/{page.params.conferenceId}/participant"
					aria-label={m.back()}
				>
					<i class="fa-duotone fa-arrow-left"></i>
				</a>
			</div>
		{/if}
		<h1 class="ml-2 flex-1 text-lg font-bold">{committee.abbreviation} — {committee.name}</h1>
		<div class="flex-none">
			<ThemeSwitcher />
		</div>
	</div>

	<!-- Main content with bottom padding for nav -->
	<div class="pb-16">
		{@render children()}
	</div>

	<!-- Bottom dock navigation -->
	<div class="dock dock-md lg:dock-lg md:justify-center md:gap-4">
		<a
			href="/app/{page.params.conferenceId}/participant/{page.params.committeeId}"
			class={!isPapersRoute ? 'dock-active' : ''}
		>
			<i class="fa-duotone fa-users size-[1.2em]"></i>
			<span class="dock-label">{m.committee()}</span>
		</a>
		{#if committee.conference?.resolutionFeatureEnabled !== false}
			<a
				href="/app/{page.params.conferenceId}/participant/{page.params.committeeId}/papers"
				class={isPapersRoute ? 'dock-active' : ''}
			>
				<i class="fa-duotone fa-scroll size-[1.2em]"></i>
				<span class="dock-label">{m.papers()}</span>
			</a>
		{/if}
	</div>
{/if}
