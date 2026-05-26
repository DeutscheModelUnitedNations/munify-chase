<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import { SvelteMap, SvelteSet } from 'svelte/reactivity';
	import DownloadPresenceData from './DownloadPresenceData.svelte';

	interface Props {
		conferenceId: string;
		conferenceTitle?: string;
	}
	let { conferenceId, conferenceTitle }: Props = $props();

	// Compute stats client-side: fine for typical conference sizes (a few thousand
	// events). If the event log grows past ~10k, move this into a server-side
	// window-function query (see plan §6).
	const events = await client.liveQuery.presenceEvents({
		__args: {
			where: { committee: { conference: { id: conferenceId } } },
			orderBy: { timestamp: 'asc' }
		},
		id: true,
		present: true,
		timestamp: true,
		committeeId: true,
		conferenceUserId: true,
		conferenceUser: {
			id: true,
			userEmail: true,
			name: true,
			conferenceMember: { representation: { name: true } }
		},
		committee: { id: true, name: true, abbreviation: true }
	});

	let now = $state(Date.now());
	$effect(() => {
		const t = setInterval(() => (now = Date.now()), 60_000);
		return () => clearInterval(t);
	});

	type PresenceEvent = NonNullable<typeof events>[number];
	type PerUser = {
		userId: string;
		label: string;
		switches: number;
		totalSeconds: number;
		perCommitteeSeconds: Map<string, number>;
	};

	let stats = $derived.by(() => {
		const perUser = new SvelteMap<string, PerUser>();
		const perCommitteeUserSet = new SvelteMap<string, SvelteSet<string>>();

		// Group events by user, then walk in chronological order. CHECK_IN starts
		// an interval; CHECK_OUT (or end-of-data → now) closes it. Auto-switch
		// already inserts both events, so each pair lines up cleanly.
		const grouped = new SvelteMap<string, PresenceEvent[]>();
		for (const e of events ?? []) {
			const list = grouped.get(e.conferenceUserId) ?? [];
			list.push(e);
			grouped.set(e.conferenceUserId, list);
		}

		for (const [userId, userEvents] of grouped) {
			const sample = userEvents[0];
			const label =
				sample.conferenceUser?.name ??
				sample.conferenceUser?.conferenceMember?.representation?.name ??
				sample.conferenceUser?.userEmail ??
				userId;
			const entry: PerUser = {
				userId,
				label,
				switches: 0,
				totalSeconds: 0,
				perCommitteeSeconds: new Map()
			};

			let openCheckIn: PresenceEvent | null = null;
			for (const e of userEvents) {
				if (e.present) {
					entry.switches += 1;
					openCheckIn = e;
					const set = perCommitteeUserSet.get(e.committeeId) ?? new SvelteSet<string>();
					set.add(userId);
					perCommitteeUserSet.set(e.committeeId, set);
				} else if (!e.present && openCheckIn) {
					const start = new Date(openCheckIn.timestamp).getTime();
					const end = new Date(e.timestamp).getTime();
					const seconds = Math.max(0, Math.floor((end - start) / 1000));
					entry.totalSeconds += seconds;
					entry.perCommitteeSeconds.set(
						openCheckIn.committeeId,
						(entry.perCommitteeSeconds.get(openCheckIn.committeeId) ?? 0) + seconds
					);
					openCheckIn = null;
				}
			}

			// Open interval — count up to "now".
			if (openCheckIn) {
				const start = new Date(openCheckIn.timestamp).getTime();
				const seconds = Math.max(0, Math.floor((now - start) / 1000));
				entry.totalSeconds += seconds;
				entry.perCommitteeSeconds.set(
					openCheckIn.committeeId,
					(entry.perCommitteeSeconds.get(openCheckIn.committeeId) ?? 0) + seconds
				);
			}

			perUser.set(userId, entry);
		}

		const distribution: { committeeId: string; count: number }[] = [];
		for (const [cid, set] of perCommitteeUserSet) {
			distribution.push({ committeeId: cid, count: set.size });
		}

		return {
			users: [...perUser.values()].sort((a, b) => b.totalSeconds - a.totalSeconds),
			distribution: distribution.sort((a, b) => b.count - a.count)
		};
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

	type CommitteeAttendanceCounts = {
		present: number;
		total: number;
	};

	type CommitteeAttendanceRow = CommitteeAttendanceCounts & {
		id: DelegateCommittee['id'];
		name: DelegateCommittee['name'];
		abbreviation: string;
		absent: number;
	};

	function getCommitteeAttendanceCounts(committee: DelegateCommittee): CommitteeAttendanceCounts {
		const total = (committee.members ?? []).filter(
			(mem) => mem.representation?.type === 'DELEGATION'
		).length;
		const present = committee.totalPresent ?? 0;
		return { present, total };
	}

	function buildCommitteeAttendanceRows(
		committees: DelegateCommittee[] | null | undefined
	): CommitteeAttendanceRow[] {
		const rows = (committees ?? []).map((committee) => {
			const { present, total } = getCommitteeAttendanceCounts(committee);
			return {
				id: committee.id,
				name: committee.name,
				abbreviation: committee.abbreviation ?? '',
				present,
				total,
				absent: Math.max(0, total - present)
			};
		});

		rows.sort((a, b) => {
			if (b.absent !== a.absent) return b.absent - a.absent;
			return (a.name ?? '').localeCompare(b.name ?? '');
		});

		return rows;
	}

	function sumCommitteeAttendanceRows(
		rows: CommitteeAttendanceCounts[]
	): CommitteeAttendanceCounts {
		let present = 0;
		let total = 0;

		for (const row of rows) {
			present += row.present;
			total += row.total;
		}

		return { present, total };
	}

	let delegateRows = $derived.by(() =>
		buildCommitteeAttendanceRows(delegateConference?.committees)
	);

	let delegateTotals = $derived.by(() => sumCommitteeAttendanceRows(delegateRows));

	function fmt(seconds: number) {
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		if (h > 0) return `${h}h ${m}m`;
		return `${m}m`;
	}
</script>

<div class="grid gap-4 lg:grid-cols-2">
	<div class="lg:col-span-2">
		<BasicCard title={m.downloadPresenceData()}>
			<p class="text-base-content/70 mb-3 text-sm">
				{m.downloadPresenceDataDescription()}
			</p>
			<DownloadPresenceData {conferenceId} {conferenceTitle} />
		</BasicCard>
	</div>

	<div class="text-base-content/70 mt-2 flex items-center gap-2 lg:col-span-2">
		<i class="fa-duotone fa-user-tag"></i>
		<h3 class="text-sm font-semibold tracking-wide uppercase">{m.nsaStatistics()}</h3>
	</div>

	<BasicCard title={m.totalAttendanceDuration()}>
		{#if stats.users.length === 0}
			<p class="text-base-content/50 text-sm">{m.noEventsYet()}</p>
		{:else}
			<ul class="flex flex-col gap-1">
				{#each stats.users as u (u.userId)}
					<li class="card hover:bg-base-200 flex flex-row items-center gap-3 p-2">
						<span class="flex-1">{u.label}</span>
						<span class="font-mono text-sm">{fmt(u.totalSeconds)}</span>
					</li>
				{/each}
			</ul>
		{/if}
	</BasicCard>

	<BasicCard title={m.nsaDistributionAcrossCommittees()}>
		{#if stats.distribution.length === 0}
			<p class="text-base-content/50 text-sm">{m.noEventsYet()}</p>
		{:else}
			<ul class="flex flex-col gap-1">
				{#each stats.distribution as d}
					{@const c = committeeNamesById.get(d.committeeId)}
					<li class="card hover:bg-base-200 flex flex-row items-center gap-3 p-2">
						<span class="flex-1">{c?.name ?? d.committeeId}</span>
						<span class="badge badge-primary">{d.count}</span>
					</li>
				{/each}
			</ul>
		{/if}
	</BasicCard>

	<BasicCard title={m.committeeSwitches()}>
		{#if stats.users.length === 0}
			<p class="text-base-content/50 text-sm">{m.noEventsYet()}</p>
		{:else}
			<ul class="flex flex-col gap-1">
				{#each stats.users as u (u.userId)}
					<li class="card hover:bg-base-200 flex flex-row items-center gap-3 p-2">
						<span class="flex-1">{u.label}</span>
						<span class="font-mono text-sm">{u.switches}</span>
					</li>
				{/each}
			</ul>
		{/if}
	</BasicCard>

	<div class="text-base-content/70 mt-4 flex items-center gap-2 lg:col-span-2">
		<i class="fa-duotone fa-users"></i>
		<h3 class="text-sm font-semibold tracking-wide uppercase">{m.delegateStatistics()}</h3>
	</div>

	<BasicCard title={m.delegatePresenceOverview()}>
		{#if delegateTotals.total === 0}
			<p class="text-base-content/50 text-sm">{m.noEventsYet()}</p>
		{:else}
			{@const pct = Math.round((delegateTotals.present / delegateTotals.total) * 100)}
			<div class="flex flex-col gap-3">
				<div class="flex items-baseline gap-3">
					<span class="font-mono text-4xl font-bold tabular-nums">
						{delegateTotals.present}<span class="text-base-content/40">
							/ {delegateTotals.total}</span
						>
					</span>
					<span class="text-base-content/60 text-sm">{pct}%</span>
				</div>
				<progress
					class="progress {pct === 100 ? 'progress-success' : 'progress-primary'} w-full"
					value={delegateTotals.present}
					max={delegateTotals.total}
				></progress>
				<p class="text-base-content/60 text-sm">{m.delegatesPresentRightNow()}</p>
			</div>
		{/if}
	</BasicCard>

	<BasicCard title={m.perCommitteeDelegatePresence()}>
		{#if delegateRows.length === 0}
			<p class="text-base-content/50 text-sm">{m.noEventsYet()}</p>
		{:else}
			<ul class="flex flex-col gap-1">
				{#each delegateRows as row (row.id)}
					<li
						class="hover:bg-base-200 grid grid-cols-[1fr_auto_6rem] items-center gap-3 rounded p-2"
					>
						<span class="truncate">
							{row.name}{#if row.abbreviation}
								<span class="text-base-content/50 text-sm"> ({row.abbreviation})</span>
							{/if}
						</span>
						<span class="font-mono text-sm tabular-nums">
							{row.present} / {row.total}
						</span>
						<progress
							class="progress {row.total > 0 && row.present === row.total
								? 'progress-success'
								: row.present === 0
									? 'progress-error'
									: 'progress-warning'} h-2 w-full"
							value={row.present}
							max={Math.max(1, row.total)}
						></progress>
					</li>
				{/each}
			</ul>
		{/if}
	</BasicCard>
</div>
