<script lang="ts">
	import { client } from '#lib/api/rumbleClient/client';
	import { m } from '#lib/paraglide/messages';
	import CommitteePresenceCard from './CommitteePresenceCard.svelte';
	import { delegateTotals, presentEventsByCommittee } from './attendance';

	interface Props {
		conferenceId: string;
	}
	let { conferenceId }: Props = $props();

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

	let conferenceTotals = $derived(delegateTotals(conference?.committees ?? []));

	const allEvents = await client.liveQuery.presenceEvents({
		__args: {
			where: { committee: { conference: { id: { eq: conferenceId } } } },
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
				representation: { name: true, icon: true }
			}
		}
	});

	let byCommittee = $derived(presentEventsByCommittee(allEvents));
</script>

<div class="flex flex-col gap-4">
	{#if conferenceTotals.total > 0}
		<div class="text-base-content/70 flex items-center gap-2 px-1 text-sm">
			<i aria-hidden="true" class="ph-duotone ph-users-three"></i>
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
		<CommitteePresenceCard
			{conferenceId}
			{committee}
			events={byCommittee.get(committee.id) ?? []}
		/>
	{/each}
</div>
