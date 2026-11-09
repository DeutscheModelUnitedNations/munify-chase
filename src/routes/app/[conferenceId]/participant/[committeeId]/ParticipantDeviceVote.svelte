<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import DeviceVoteModal from '#lib/components/voting/DeviceVoteModal.svelte';

	type ModalProps = ComponentProps<typeof DeviceVoteModal>;

	interface Props {
		/** The participant may vote on their device right now */
		show: boolean;
		session:
			| {
					id: string;
					voteName?: string | null;
					withAbstentions?: boolean | null;
					deviceVotingStartedAt?: ModalProps['deviceVotingStartedAt'] | null;
					deviceVotingWindowSeconds?: number | null;
			  }
			| null
			| undefined;
		myVote: ModalProps['myVote'];
		myCommitteeMemberId: string | null | undefined;
	}

	let { show, session, myVote, myCommitteeMemberId }: Props = $props();
</script>

{#if show && session?.deviceVotingStartedAt && session?.deviceVotingWindowSeconds && myCommitteeMemberId}
	<DeviceVoteModal
		active={show}
		sessionId={session.id}
		voteName={session.voteName}
		withAbstentions={session.withAbstentions}
		deviceVotingStartedAt={session.deviceVotingStartedAt}
		deviceVotingWindowSeconds={session.deviceVotingWindowSeconds}
		{myVote}
		{myCommitteeMemberId}
	/>
{/if}
