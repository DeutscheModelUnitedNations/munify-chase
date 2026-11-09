<script lang="ts">
	import { m } from '#lib/paraglide/messages';
	import BallotVotePresentation from './BallotVotePresentation.svelte';
	import PresentationVoteModal from './PresentationVoteModal.svelte';
	import VoteFlagRows from './VoteFlagRows.svelte';
	import type { BallotPresentationProps } from './votingMath';

	let props: BallotPresentationProps = $props();
</script>

<BallotVotePresentation {...props} mode="ROLL_CALL">
	{#snippet children(session, tally)}
		<PresentationVoteModal
			title={session.voteName || m.rollCallVoting()}
			class="flex h-full max-h-11/12 w-full max-w-11/12 flex-col gap-4"
		>
			<VoteFlagRows {...tally} withAbstentions={session.withAbstentions} />
		</PresentationVoteModal>
	{/snippet}
</BallotVotePresentation>
