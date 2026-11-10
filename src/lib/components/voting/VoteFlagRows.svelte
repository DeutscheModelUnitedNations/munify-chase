<script lang="ts">
	import Flag from '#lib/components/Flag.svelte';
	import { cubicInOut } from 'svelte/easing';
	import { flip } from 'svelte/animate';
	import { crossfade } from 'svelte/transition';
	import ResultChart from './ResultChart.svelte';
	import FlagRow from './FlagRow.svelte';
	import { membersByVote, type VotingMember } from './votingMath';

	interface Props {
		/** The voting members, in the order they are shown. */
		members: VotingMember[];
		votes: Array<{ committeeMemberId: string; vote: string }>;
		withAbstentions: boolean;
		majorityAmount: number;
	}

	let { members, votes, withAbstentions, majorityAmount }: Props = $props();

	const [send, receive] = crossfade({
		duration: 1000,
		easing: cubicInOut
	});

	const flipOptions = {
		duration: 500,
		delay: 250,
		easing: cubicInOut
	};

	let byVote = $derived(membersByVote({ members, votes }));
</script>

{#snippet FlagCards(rowMembers: VotingMember[])}
	{#each rowMembers as member (member.id)}
		<div animate:flip={flipOptions} in:receive={{ key: member.id }} out:send={{ key: member.id }}>
			<div class="card card-bordered bg-base-200 items-center gap-1 p-2 shadow-sm">
				<Flag representation={member.representation} size="sm" />
				<h3 class="font-mono text-lg font-bold uppercase">
					{member.representation?.name || member.representation?.alpha2Code}
				</h3>
			</div>
		</div>
	{/each}
{/snippet}

<ResultChart
	{majorityAmount}
	votesAbstain={byVote.ABSTAIN.length}
	votesCon={byVote.CON.length}
	votesPro={byVote.PRO.length}
	total={members.length}
/>

<FlagRow icon="arrow-right" countValue={byVote.REMAINING.length}>
	{@render FlagCards(byVote.REMAINING)}
</FlagRow>

<FlagRow color="success" icon="plus-circle" countValue={byVote.PRO.length}>
	{@render FlagCards(byVote.PRO.toReversed())}
</FlagRow>

{#if withAbstentions}
	<FlagRow color="info" icon="circle" countValue={byVote.ABSTAIN.length}>
		{@render FlagCards(byVote.ABSTAIN.toReversed())}
	</FlagRow>
{/if}

<FlagRow color="error" icon="minus-circle" countValue={byVote.CON.length}>
	{@render FlagCards(byVote.CON.toReversed())}
</FlagRow>
