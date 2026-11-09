<script lang="ts">
	import type { Snippet } from 'svelte';
	import { latchedBallotSession, liveVoteWithBallots, type BallotSession } from './votingSession';
	import { presentationTally, type BallotPresentationProps } from './votingMath';

	interface Props extends BallotPresentationProps {
		/** The voting mode this presentation is for; it shows nothing during other votes. */
		mode: BallotSession['mode'];
		children: Snippet<[BallotSession, ReturnType<typeof presentationTally>]>;
	}

	let { committeeId, committee, mode, children }: Props = $props();

	const getSession = latchedBallotSession(await liveVoteWithBallots(committeeId));
	let session = $derived(getSession());

	let tally = $derived(presentationTally({ committee, session }));
</script>

{#if session?.mode === mode}
	{@render children(session, tally)}
{/if}
