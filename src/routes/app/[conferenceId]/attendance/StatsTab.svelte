<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import { SvelteMap, SvelteSet } from 'svelte/reactivity';
	import DownloadPresenceData from './DownloadPresenceData.svelte';
	import DelegatePresenceChart from '../statistics/DelegatePresenceChart.svelte';
	import NsaDistributionChart from '../statistics/NsaDistributionChart.svelte';
	import type { CommitteeBar } from '../statistics/DelegatePresenceChart.svelte';
	import type { NsaSlice } from '../statistics/NsaDistributionChart.svelte';

	interface Props {
		conferenceId: string;
		conferenceTitle?: string;
	}
	let { conferenceId, conferenceTitle }: Props = $props();

	const events = await client.liveQuery.presenceEvents({
		__args: {
			where: { committee: { conference: { id: conferenceId } } },
			orderBy: { timestamp: 'asc' }
		},
		id: true,
		present: true,
		committeeId: true,
		conferenceUserId: true,
		committee: { id: true, name: true, abbreviation: true }
	});

	// NSA distribution: distinct users per committee (check-in events only)
	let nsaStats = $derived.by(() => {
		const perCommittee = new SvelteMap<string, SvelteSet<string>>();
		for (const e of events ?? []) {
			if (e.present) {
				const s = perCommittee.get(e.committeeId) ?? new SvelteSet<string>();
				s.add(e.conferenceUserId);
				perCommittee.set(e.committeeId, s);
			}
		}
		const distribution: { committeeId: string; count: number }[] = [];
		for (const [cid, s] of perCommittee) {
			distribution.push({ committeeId: cid, count: s.size });
		}
		return distribution.sort((a, b) => b.count - a.count);
	});

	let committeeNamesById = $derived(
		new Map((events ?? []).map((e) => [e.committee?.id, e.committee]))
	);

	const delegateConference = await client.liveQuery.conference({
		__args: { id: conferenceId },
		id: true,
		committees: {
			id: true,
			name: true,
			abbreviation: true,
			totalPresent: true,
			members: {
				id: true,
				present: true,
				representation: { type: true }
			}
		}
	});

	type DelegateCommittee = NonNullable<
		NonNullable<typeof delegateConference>['committees']
	>[number];

	function committeeStats(c: DelegateCommittee): { present: number; total: number } {
		const total = (c.members ?? []).filter((m) => m.representation?.type === 'DELEGATION').length;
		return { present: c.totalPresent ?? 0, total };
	}

	// Per-committee rows for bar chart
	let committeeRows = $derived.by((): CommitteeBar[] =>
		(delegateConference?.committees ?? []).map((c) => {
			const { present, total } = committeeStats(c);
			return { id: c.id, name: c.name, abbreviation: c.abbreviation ?? null, present, total };
		})
	);

	// Aggregate totals for summary cards
	let totals = $derived.by(() => {
		let present = 0;
		let total = 0;
		for (const row of committeeRows) {
			present += row.present;
			total += row.total;
		}
		return { present, total };
	});

	let attendancePct = $derived(
		totals.total > 0 ? Math.round((totals.present / totals.total) * 100) : 0
	);

	let committeeCount = $derived(delegateConference?.committees?.length ?? 0);

	let totalNsas = $derived(
		new Set((events ?? []).filter((e) => e.present).map((e) => e.conferenceUserId)).size
	);

	// Shaped for chart components
	let nsaSlices = $derived.by((): NsaSlice[] =>
		nsaStats.map((d) => ({
			name:
				committeeNamesById.get(d.committeeId)?.abbreviation ??
				committeeNamesById.get(d.committeeId)?.name ??
				d.committeeId,
			count: d.count
		}))
	);
</script>

<!-- Download -->
<BasicCard title={m.downloadPresenceData()}>
	<p class="text-base-content/70 mb-3 text-sm">
		{m.downloadPresenceDataDescription()}
	</p>
	<DownloadPresenceData {conferenceId} {conferenceTitle} />
</BasicCard>

<!-- Summary cards -->
<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
	<div class="card bg-base-100">
		<div class="card-body gap-1 p-5">
			<div class="flex items-start justify-between">
				<p class="text-base-content/60 text-sm font-medium">{m.delegateStatistics()}</p>
				<div class="bg-primary/10 rounded-lg p-2">
					<i class="fa-duotone fa-users text-primary text-lg"></i>
				</div>
			</div>
			<p class="font-mono text-4xl font-bold tabular-nums">{totals.total}</p>
			<p class="text-base-content/50 text-xs">{m.delegatesPresentRightNow()}</p>
		</div>
	</div>

	<div class="card bg-base-100">
		<div class="card-body gap-1 p-5">
			<div class="flex items-start justify-between">
				<p class="text-base-content/60 text-sm font-medium">{m.delegatePresenceOverview()}</p>
				<div class="rounded-lg bg-success/10 p-2">
					<i class="fa-duotone fa-user-check text-success text-lg"></i>
				</div>
			</div>
			<p class="font-mono text-4xl font-bold tabular-nums">
				{totals.present}
				<span class="text-base-content/40 text-xl">/ {totals.total}</span>
			</p>
			<div class="flex items-center gap-2">
				<progress
					class="progress progress-success h-1.5 flex-1"
					value={totals.present}
					max={Math.max(1, totals.total)}
				></progress>
				<span class="text-base-content/50 text-xs tabular-nums">{attendancePct}%</span>
			</div>
		</div>
	</div>

	<div class="card bg-base-100">
		<div class="card-body gap-1 p-5">
			<div class="flex items-start justify-between">
				<p class="text-base-content/60 text-sm font-medium">{m.nsaStatistics()}</p>
				<div class="bg-secondary/10 rounded-lg p-2">
					<i class="fa-duotone fa-user-tag text-secondary text-lg"></i>
				</div>
			</div>
			<p class="font-mono text-4xl font-bold tabular-nums">{totalNsas}</p>
			<p class="text-base-content/50 text-xs">{m.nsaDistributionAcrossCommittees()}</p>
		</div>
	</div>

	<div class="card bg-base-100">
		<div class="card-body gap-1 p-5">
			<div class="flex items-start justify-between">
				<p class="text-base-content/60 text-sm font-medium">{m.statCommittees()}</p>
				<div class="bg-accent/10 rounded-lg p-2">
					<i class="fa-duotone fa-building-columns text-accent text-lg"></i>
				</div>
			</div>
			<p class="font-mono text-4xl font-bold tabular-nums">{committeeCount}</p>
			<p class="text-base-content/50 text-xs">{m.committeeOverview()}</p>
		</div>
	</div>
</div>

<!-- Charts -->
<div class="grid gap-4 lg:grid-cols-5">
	<div class="lg:col-span-3">
		<BasicCard title={m.perCommitteeDelegatePresence()}>
			{#if committeeRows.length === 0}
				<p class="text-base-content/50 py-8 text-center text-sm">{m.noEventsYet()}</p>
			{:else}
				<DelegatePresenceChart committees={committeeRows} />
			{/if}
		</BasicCard>
	</div>

	<div class="lg:col-span-2">
		<BasicCard title={m.nsaDistributionAcrossCommittees()}>
			<NsaDistributionChart distribution={nsaSlices} />
		</BasicCard>
	</div>
</div>
