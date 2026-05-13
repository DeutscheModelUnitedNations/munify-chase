<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import { SvelteMap, SvelteSet } from 'svelte/reactivity';

	interface Props {
		conferenceId: string;
	}
	let { conferenceId }: Props = $props();

	// Compute stats client-side: fine for typical conference sizes (a few thousand
	// events). If the event log grows past ~10k, move this into a server-side
	// window-function query (see plan §6).
	const events = await client.liveQuery.nsaPresenceEvents({
		__args: {
			where: { conference: { id: conferenceId } },
			orderBy: { timestamp: 'asc' }
		},
		id: true,
		type: true,
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
		const grouped = new SvelteMap<string, any[]>();
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

			let openCheckIn: any | null = null;
			for (const e of userEvents) {
				if (e.type === 'CHECK_IN') {
					entry.switches += 1;
					openCheckIn = e;
					const set = perCommitteeUserSet.get(e.committeeId) ?? new SvelteSet<string>();
					set.add(userId);
					perCommitteeUserSet.set(e.committeeId, set);
				} else if (e.type === 'CHECK_OUT' && openCheckIn) {
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
		new Map((events ?? []).map((e: any) => [e.committee?.id, e.committee]))
	);

	function fmt(seconds: number) {
		const h = Math.floor(seconds / 3600);
		const m = Math.floor((seconds % 3600) / 60);
		if (h > 0) return `${h}h ${m}m`;
		return `${m}m`;
	}
</script>

<div class="grid gap-4 lg:grid-cols-2">
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
</div>
