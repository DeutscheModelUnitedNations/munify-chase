<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import { page } from '$app/state';
	import { client } from '#lib/api/rumbleClient/client';
	import BasicCard from '#lib/components/BasicCard.svelte';
	import ChairPage from '../ChairPage.svelte';
	import VotingSetup from '#lib/components/voting/VotingSetup.svelte';

	const committee = await client.liveQuery.committee({
		__args: { id: page.params.committeeId! },
		id: true,
		totalPresent: true,
		simpleMajority: true,
		twoThirdsMajority: true,
		status: true,
		statusHeadline: true,
		statusUntil: true,
		stateOfDebate: true,
		activeAgendaItem: { id: true, title: true },
		activeVotingSession: {
			id: true,
			mode: true,
			voteName: true,
			majority: true,
			withAbstentions: true,
			deviceVotingWindowSeconds: true
		},
		members: {
			id: true,
			present: true,
			representation: {
				id: true,
				name: true,
				alpha2Code: true,
				alpha3Code: true,
				icon: true,
				type: true
			}
		}
	});
</script>

<ChairPage {committee}>
	{#snippet children(committee)}
		<BasicCard title={m.voting()}>
			<VotingSetup {committee} activeVotingSession={committee.activeVotingSession ?? null} />
		</BasicCard>
	{/snippet}
</ChairPage>
