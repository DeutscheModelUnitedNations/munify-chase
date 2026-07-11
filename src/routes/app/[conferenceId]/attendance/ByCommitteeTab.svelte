<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';
	import BasicCard from '$lib/components/BasicCard.svelte';
	import { SvelteMap, SvelteSet } from 'svelte/reactivity';
	import { getServerTime } from '$lib/state/serverTime.svelte';

	interface Props {
		conferenceId: string;
	}
	let { conferenceId }: Props = $props();

	// Default warning threshold: highlight check-ins older than 4 h. Surfaces
	// likely-forgotten checkouts without auto-acting on them.
	const WARNING_HOURS = 4;
	const WARNING_MS = WARNING_HOURS * 60 * 60 * 1000;

	const conference = await client.liveQuery.conference({
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

	type CommitteeForStat = NonNullable<NonNullable<typeof conference>['committees']>[number];

	function delegateStat(c: CommitteeForStat) {
		const total = (c.members ?? []).filter(
			(mem) => mem.representation?.type === 'DELEGATION'
		).length;
		const present = c.totalPresent ?? 0;
		return { present, total };
	}

	function badgeClass(present: number, total: number) {
		if (total === 0 || present === 0) return 'badge-ghost';
		if (present === total) return 'badge-success';
		return 'badge-warning';
	}

	let conferenceTotals = $derived.by(() => {
		let present = 0;
		let total = 0;
		for (const c of conference?.committees ?? []) {
			const s = delegateStat(c);
			present += s.present;
			total += s.total;
		}
		return { present, total };
	});

	const allEvents = await client.liveQuery.presenceEvents({
		__args: {
			where: { committee: { conference: { id: conferenceId } } },
			orderBy: { timestamp: 'desc' }
		},
		id: true,
		present: true,
		committeeId: true,
		timestamp: true,
		conferenceUser: {
			id: true,
			userEmail: true,
			name: true,
			conferenceMember: {
				representation: { name: true, faIcon: true }
			}
		}
	});

	let now = $derived(getServerTime().valueOf());

	type LatestEvent = NonNullable<typeof allEvents>[number];

	let byCommittee = $derived.by(() => {
		const map = new SvelteMap<string, LatestEvent[]>();
		const seen = new SvelteSet<string>();
		// allEvents is ordered timestamp DESC, so the first event per user is the latest.
		for (const event of allEvents ?? []) {
			const uid = event.conferenceUser?.id;
			if (!uid || seen.has(uid)) continue;
			seen.add(uid);
			if (!event.present) continue;
			const list = map.get(event.committeeId) ?? [];
			list.push(event);
			map.set(event.committeeId, list);
		}
		return map;
	});

	function durationLabel(ts: string | Date) {
		const start = ts instanceof Date ? ts.getTime() : new Date(ts).getTime();
		const minutes = Math.floor((now - start) / 60_000);
		if (minutes < 60) return m.minutesShort({ count: minutes });
		const hours = Math.floor(minutes / 60);
		const rem = minutes % 60;
		return m.hoursMinutesShort({ hours, minutes: rem });
	}

	function isStale(ts: string | Date) {
		const start = ts instanceof Date ? ts.getTime() : new Date(ts).getTime();
		return now - start > WARNING_MS;
	}
</script>

<div class="flex flex-col gap-4">
	{#if conferenceTotals.total > 0}
		<div class="text-base-content/70 flex items-center gap-2 px-1 text-sm">
			<i class="fa-duotone fa-users-line"></i>
			<span>{m.delegatePresence()}:</span>
			<span class="font-semibold tabular-nums"
				>{m.delegatesPresentOfTotal({
					present: conferenceTotals.present,
					total: conferenceTotals.total
				})}</span
			>
		</div>
	{/if}
	{#each conference?.committees ?? [] as committee (committee.id)}
		{@const list = byCommittee.get(committee.id) ?? []}
		{@const stat = delegateStat(committee)}
		<BasicCard title={`${committee.name} (${committee.abbreviation ?? ''})`}>
			<div class="-mt-3 mb-3 flex flex-wrap items-center gap-2">
				<span
					class="badge badge-sm {badgeClass(stat.present, stat.total)} tabular-nums"
					title={m.delegatePresence()}
				>
					{m.delegatesPresentOfTotal({ present: stat.present, total: stat.total })}
				</span>
			</div>
			{#if list.length === 0}
				<p class="text-base-content/50 py-2 text-sm">{m.noNsasInCommittee()}</p>
			{:else}
				<ul class="flex flex-col gap-1">
					{#each list as event (event.id)}
						{@const rep = event.conferenceUser?.conferenceMember?.representation}
						<li class="card hover:bg-base-200 flex flex-row items-center gap-3 p-2">
							{#if rep?.faIcon}
								<i class="fas {rep.faIcon} text-lg"></i>
							{:else}
								<i class="fas fa-user-tag text-lg"></i>
							{/if}
							<span class="flex-1">
								{event.conferenceUser?.name ?? event.conferenceUser?.userEmail ?? m.unknown()}
							</span>
							{#if rep?.name}
								<span class="text-base-content/60 text-sm">{rep.name}</span>
							{/if}
							<span class="text-base-content/60 text-sm">
								{durationLabel(event.timestamp)}
							</span>
							{#if isStale(event.timestamp)}
								<span
									class="badge badge-warning"
									title={m.forgottenCheckoutWarning({ hours: WARNING_HOURS })}
								>
									<i class="fas fa-triangle-exclamation"></i>
								</span>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		</BasicCard>
	{/each}
</div>
