<script lang="ts">
	import { getServerTime } from '#lib/state/serverTime.svelte';
	import { m } from '#lib/paraglide/messages';
	import PresentationVoteModal from './PresentationVoteModal.svelte';
	import type { BallotSession } from './votingSession';
	import DeviceVotingCountdown from './DeviceVotingCountdown.svelte';
	import VoteFlagRows from './VoteFlagRows.svelte';
	import { deviceVotingExpired, type presentationTally } from './votingMath';

	interface Props {
		session: BallotSession;
		tally: ReturnType<typeof presentationTally>;
	}

	let { session, tally }: Props = $props();

	// Delegates vote simultaneously and privately — revealing the running tally on the
	// big screen while the window is still open would let later voters follow the crowd.
	// Only the final breakdown, once the vote has ended, is shown here.
	//
	// Don't rely on `currentStage === 'EVALUATION'` alone: that field is only set by the
	// chair's own device-voting-chair component once ITS countdown expires, so if that
	// modal isn't open (chair looking elsewhere, e.g. at this very presentation screen)
	// the field never flips and results would never reveal. Compute expiry independently
	// from the same server-synced clock so this screen reveals on its own regardless of
	// what the chair's browser is doing.
	let timeExpired = $derived(
		deviceVotingExpired({
			startedAt: session.deviceVotingStartedAt,
			windowSeconds: session.deviceVotingWindowSeconds,
			now: getServerTime()
		})
	);
	let resultsRevealed = $derived(session.currentStage === 'EVALUATION' || timeExpired);
	let countdown = $derived(
		!resultsRevealed && session.deviceVotingStartedAt && session.deviceVotingWindowSeconds
			? {
					startTimestamp: session.deviceVotingStartedAt,
					windowSeconds: session.deviceVotingWindowSeconds
				}
			: null
	);
</script>

<PresentationVoteModal
	title={session.voteName || m.deviceBasedVoting()}
	class="flex flex-col gap-4 transition-all duration-500
			{resultsRevealed ? 'h-full max-h-11/12 w-full max-w-11/12' : 'w-full max-w-2xl'}"
>
	{#if countdown}
		<DeviceVotingCountdown {...countdown} />
	{/if}

	{#if resultsRevealed}
		<VoteFlagRows {...tally} withAbstentions={session.withAbstentions} />
	{:else}
		<div class="flex items-center justify-center py-6">
			<span class="text-2xl opacity-70">
				<i aria-hidden="true" class="ph-fill ph-lock mr-2"></i>
				{m.deviceVoteResultsPending()}
			</span>
		</div>
	{/if}
</PresentationVoteModal>
