<script lang="ts">
	import BallotVotePresentation from './BallotVotePresentation.svelte';
	import DeviceBallotModal from './DeviceBallotModal.svelte';
	import type { BallotPresentationProps } from './votingMath';

	let props: BallotPresentationProps = $props();
</script>

<BallotVotePresentation {...props} mode="DEVICE_BASED">
	{#snippet children(session, tally)}
		<DeviceBallotModal {session} {tally} />
	{/snippet}
</BallotVotePresentation>
