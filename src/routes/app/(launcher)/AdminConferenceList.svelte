<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import EmptyLauncher from '#lib/components/launcher/EmptyLauncher.svelte';
	import type { LauncherConference } from '#lib/components/launcher/types';
	import AdminConferenceSection from './AdminConferenceSection.svelte';
	import { groupByStatus, searchConferences } from './launcherConferences';

	interface Props {
		conferences: LauncherConference[];
		searchQuery: string;
		onDelete: (target: { id: string; title: string }) => void;
	}

	let { conferences, searchQuery, onDelete }: Props = $props();

	const filtered = $derived(searchConferences(conferences, searchQuery));
	const grouped = $derived(groupByStatus(filtered, new Date()));
	const sections = $derived(
		[
			{ key: 'active' as const, items: grouped.active, label: m.launcherStatusActive() },
			{ key: 'upcoming' as const, items: grouped.upcoming, label: m.launcherStatusUpcoming() },
			{ key: 'past' as const, items: grouped.past, label: m.launcherStatusPast() }
		].filter((section) => section.items.length > 0)
	);
</script>

{#if conferences.length === 0}
	<EmptyLauncher />
{:else if filtered.length === 0}
	<div class="flex flex-col items-center gap-2 px-4 py-12 text-center">
		<h2 class="m-0 text-xl font-bold">{m.launcherNoSearchResultsHeadline()}</h2>
		<p class="text-base-content/70 m-0 text-sm">{m.launcherNoSearchResultsBody()}</p>
	</div>
{:else}
	<div class="flex flex-col gap-6">
		{#each sections as section (section.key)}
			<AdminConferenceSection
				label={section.label}
				conferences={section.items}
				muted={section.key === 'past'}
				{onDelete}
			/>
		{/each}
	</div>
{/if}
