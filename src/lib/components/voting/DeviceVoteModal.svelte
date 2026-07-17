<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import Modal from '../Modal.svelte';
	import { client } from '$lib/api/rumbleClient/client';
	import { nanoid } from '$lib/helpers/nanoid';
	import DeviceVotingCountdown from './DeviceVotingCountdown.svelte';
	import toast from 'svelte-french-toast';

	interface Props {
		active: boolean;
		sessionId: string;
		voteName?: string | null;
		withAbstentions?: boolean | null;
		deviceVotingStartedAt: Date | string;
		deviceVotingWindowSeconds: number;
		myVote?: 'PRO' | 'CON' | 'ABSTAIN' | null;
		myCommitteeMemberId: string;
	}

	let {
		active,
		sessionId,
		voteName,
		withAbstentions,
		deviceVotingStartedAt,
		deviceVotingWindowSeconds,
		myVote = null,
		myCommitteeMemberId
	}: Props = $props();

	// Bridge into Modal.svelte's bindable `open` — closeOnEsc is false so Modal never
	// writes back to it, this component stays the single source of truth via `active`.
	// eslint-disable-next-line svelte/prefer-writable-derived -- must be $state to satisfy Modal's bind:open
	let open = $state(active);
	$effect(() => {
		open = active;
	});

	let expired = $state(false);

	// Instant local feedback on tap; resyncs from the server-confirmed vote whenever the
	// live query catches up (e.g. after a resume or a vote cast from another tab).
	// eslint-disable-next-line svelte/prefer-writable-derived -- writable locally on tap, also reactive to prop changes
	let selected = $state<'PRO' | 'CON' | 'ABSTAIN' | null>(myVote);
	$effect(() => {
		selected = myVote;
	});

	async function cast(vote: 'PRO' | 'CON' | 'ABSTAIN') {
		if (expired) return;
		selected = vote;
		try {
			await client.mutate.castDeviceVote({
				__args: { id: nanoid(), sessionId, vote, committeeMemberId: myCommitteeMemberId },
				id: true,
				committeeMemberId: true,
				vote: true
			});
		} catch {
			toast.error(m.deviceVoteError());
		}
	}
</script>

<Modal bind:open closeOnEsc={false}>
	<h1 class="mb-4 text-center text-2xl font-bold">{voteName || m.deviceBasedVoting()}</h1>

	<DeviceVotingCountdown
		startTimestamp={deviceVotingStartedAt}
		windowSeconds={deviceVotingWindowSeconds}
		bind:expired
	/>

	<!-- Buttons stay enabled-looking (not `disabled`) once expired so the locked-in
		selection keeps its color — daisyUI's disabled state greys out every button
		equally, which would hide which choice was actually cast. Sized well past
		btn-xl since this is a phone-first tap target, not a desktop control. -->
	<div class="mt-6 flex flex-col gap-4">
		<button
			class="btn h-28 text-3xl {selected === 'PRO' ? 'btn-success' : 'btn-outline btn-success'}
				{expired ? 'pointer-events-none' : ''}"
			onclick={() => cast('PRO')}
		>
			<i class="fas fa-circle-plus text-4xl"></i>
			{m.pro()}
		</button>
		<button
			class="btn h-28 text-3xl {selected === 'CON' ? 'btn-error' : 'btn-outline btn-error'}
				{expired ? 'pointer-events-none' : ''}"
			onclick={() => cast('CON')}
		>
			<i class="fas fa-circle-minus text-4xl"></i>
			{m.con()}
		</button>
		{#if withAbstentions}
			<button
				class="btn h-28 text-3xl {selected === 'ABSTAIN' ? 'btn-info' : 'btn-outline btn-info'}
					{expired ? 'pointer-events-none' : ''}"
				onclick={() => cast('ABSTAIN')}
			>
				<i class="fas fa-circle text-4xl"></i>
				{m.abstain()}
			</button>
		{/if}
	</div>

	{#if expired}
		<div class="alert alert-info mt-4">
			<i class="fas fa-lock"></i>
			<span>{selected ? m.deviceVoteLockedIn() : m.deviceVoteLockedNone()}</span>
		</div>
	{/if}
</Modal>
