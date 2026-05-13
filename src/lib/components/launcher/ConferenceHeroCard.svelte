<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { resolve } from '$app/paths';
	import { getLocale } from '$lib/paraglide/runtime';
	import { deriveStatus, formatDateRange } from '$lib/helpers/launcher';
	import LauncherFlag from './LauncherFlag.svelte';
	import StatusDot from './StatusDot.svelte';
	import RoleBadge from './RoleBadge.svelte';
	import CommitteeStack from './CommitteeStack.svelte';
	import type { LauncherConference } from './types';

	interface Props {
		conference: LauncherConference;
	}

	let { conference }: Props = $props();

	const status = $derived(deriveStatus(conference));
	const dateRange = $derived(formatDateRange(conference, getLocale()));
	const href = $derived.by(() => {
		if (conference.role === 'ADMIN' || conference.role === 'CHAIR') {
			return resolve('/app/[conferenceId]/mission-control', { conferenceId: conference.id });
		}
		if (conference.role === 'DELEGATE' && conference.committeeId) {
			return resolve('/app/[conferenceId]/participant/[committeeId]', {
				conferenceId: conference.id,
				committeeId: conference.committeeId
			});
		}
		return resolve('/app/[conferenceId]/participant', { conferenceId: conference.id });
	});
</script>

<article
	class="card bg-base-100 border-primary/15 relative flex flex-col gap-5 overflow-hidden border p-6 shadow-md"
>
	<div
		class="from-accent pointer-events-none absolute top-0 right-0 h-full w-1 bg-gradient-to-b to-transparent"
		aria-hidden="true"
	></div>

	<header class="flex flex-wrap items-start justify-between gap-3">
		<div class="flex items-center gap-3">
			<LauncherFlag representation={conference.representation} size={44} />
			<StatusDot {status} />
		</div>
		<RoleBadge role={conference.role} detail={conference.roleDetail} />
	</header>

	<div>
		<h2 class="m-0 text-3xl font-bold leading-tight tracking-tight">{conference.title}</h2>
	</div>

	{#if dateRange || conference.location}
		<div class="text-base-content/75 flex flex-wrap gap-x-4 gap-y-2 text-sm">
			{#if dateRange}
				<span class="inline-flex items-center gap-2 whitespace-nowrap">
					<i class="fa-duotone fa-calendar"></i>
					{dateRange}
				</span>
			{/if}
			{#if conference.location}
				<span class="inline-flex items-center gap-2 whitespace-nowrap">
					<i class="fa-duotone fa-location-dot"></i>
					{conference.location}
				</span>
			{/if}
		</div>
	{/if}

	{#if conference.committees.length > 0}
		<div class="flex flex-col gap-2">
			<div class="text-base-content/55 text-xs font-semibold uppercase tracking-wider">
				{m.launcherCommitteesEyebrow()}
			</div>
			<CommitteeStack committees={conference.committees} max={6} size="md" />
		</div>
	{/if}

	<a class="btn btn-primary btn-lg mt-1 w-full" {href}>
		<i class="fa-duotone fa-arrow-right-to-bracket"></i>
		{m.launcherOpen()}
	</a>
</article>
