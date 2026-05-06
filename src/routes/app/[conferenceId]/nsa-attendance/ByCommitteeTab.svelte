<script lang="ts">
	import { client } from '$lib/api/rumbleClient/client';
	import { m } from '$lib/paraglide/messages';
	import BasicCard from '$lib/components/BasicCard.svelte';

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
		committees: { id: true, name: true, abbreviation: true }
	});

	const latestEvents = await client.liveQuery.latestNsaPresenceEvents({
		__args: { conferenceId },
		id: true,
		type: true,
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

	let now = $state(Date.now());
	$effect(() => {
		const t = setInterval(() => (now = Date.now()), 60_000);
		return () => clearInterval(t);
	});

	let byCommittee = $derived.by(() => {
		const map = new Map<string, any[]>();
		for (const event of latestEvents ?? []) {
			if (event.type !== 'CHECK_IN') continue;
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
	{#each conference?.committees ?? [] as committee}
		{@const list = byCommittee.get(committee.id) ?? []}
		<BasicCard title={`${committee.name} (${committee.abbreviation ?? ''})`}>
			{#if list.length === 0}
				<p class="text-base-content/50 py-2 text-sm">{m.noNsasInCommittee()}</p>
			{:else}
				<ul class="flex flex-col gap-1">
					{#each list as event}
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
