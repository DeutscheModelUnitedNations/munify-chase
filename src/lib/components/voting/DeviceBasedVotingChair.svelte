<script lang="ts">
	import Kbd from '$lib/components/Kbd.svelte';
	import { untrack } from 'svelte';
	import { m } from '$lib/paraglide/messages';
	import Modal from '../Modal.svelte';
	import hotkeys from 'hotkeys-js';
	import { client } from '$lib/api/rumbleClient/client';
	import { nanoid } from '$lib/helpers/nanoid';
	import { type VotingMajority } from './votingModal';
	import ResultChart from './ResultChart.svelte';
	import DeviceVotingCountdown from './DeviceVotingCountdown.svelte';
	import Flag from '$lib/components/Flag.svelte';
	import { sortTranslatedCountries } from '$lib/utils/nationTranslationHelper.svelte';
	import { calculateMajority } from '$lib/utils/majorities';
	import type { VotingResult } from './votingModal';

	interface Props {
		active: boolean;
		committee: {
			id: string;
			totalPresent: number;
			simpleMajority: number;
			twoThirdsMajority: number;
			members: Array<{
				id: string;
				present: boolean;
				representation?: {
					name?: string | null;
					alpha2Code?: string | null;
					alpha3Code?: string | null;
					faIcon?: string | null;
					type?: string | null;
				} | null;
			}>;
		};
		voteName?: string;
		majority?: VotingMajority;
		withAbstentions?: boolean;
		deviceVotingWindowSeconds?: number;
		oncomplete?: (result: VotingResult) => void;
	}

	let {
		active = $bindable(),
		committee,
		voteName,
		majority,
		withAbstentions,
		deviceVotingWindowSeconds = 20,
		oncomplete
	}: Props = $props();

	// Only used as the `id` arg for the initial startVotingSession call (insert-or-resume).
	// Everything this component reads or acts on afterwards goes through `liveSession`,
	// never this — comparing a locally-tracked id against the live-queried session was a
	// real bug: if they ever diverged (e.g. this chair resuming while another chair-side
	// control already had the vote open) the vote list would show every delegate as
	// "not voted" forever, since the mismatch never resolves on its own.
	let mintedSessionId = $state<string | null>(null);
	let timerExpired = $state(false);
	let evaluationRequested = $state(false);

	// Unlike the roll-call/show-of-hands chairs, THIS chair never casts votes itself —
	// delegates do, from their own devices, via castDeviceVote. So local mutation-response
	// state alone would go stale the moment another device votes. Live-query the committee
	// (same pattern as DeviceBasedVotingPresentation.svelte) so tallies/non-voters update in
	// real time regardless of who cast the vote.
	const committeeWithVote = await client.liveQuery.committee({
		__args: { id: committee.id },
		id: true,
		activeVotingSession: {
			id: true,
			currentStage: true,
			deviceVotingStartedAt: true,
			deviceVotingWindowSeconds: true,
			votes: { id: true, committeeMemberId: true, vote: true }
		}
	});

	// The committee's activeVotingSession is the single source of truth for "what's
	// running right now" — trust it directly, exactly like the presentation view does.
	let liveSession = $derived(committeeWithVote?.activeVotingSession ?? null);
	let sessionId = $derived(liveSession?.id ?? mintedSessionId);
	let serverEvaluationStage = $derived(liveSession?.currentStage === 'EVALUATION');
	// Reveal results the moment THIS client's own timer expires, without waiting on the
	// updateVotingSession round trip below — otherwise, if that mutation never lands
	// (dropped connection, or nobody else's client bothers to try), this chair's own
	// countdown would sit stuck at 0s forever instead of showing the final tally.
	let evaluationStage = $derived(serverEvaluationStage || timerExpired);
	let deviceVotingStartedAt = $derived(liveSession?.deviceVotingStartedAt ?? null);
	let windowSeconds = $derived(liveSession?.deviceVotingWindowSeconds ?? deviceVotingWindowSeconds);
	let votes = $derived(liveSession?.votes ?? []);

	let members = $derived(
		committee?.members
			.filter((member) => member.present && member.representation?.type === 'DELEGATION')
			.sort((a, b) => sortTranslatedCountries(a.representation!, b.representation!)) ?? []
	);

	let votedIds = $derived(votes.map((v) => v.committeeMemberId));
	let nonVoters = $derived(members.filter((member) => !votedIds.includes(member.id)));
	let votesPro = $derived(votes.filter((v) => v.vote === 'PRO').length);
	let votesCon = $derived(votes.filter((v) => v.vote === 'CON').length);
	let votesAbstain = $derived(votes.filter((v) => v.vote === 'ABSTAIN').length);

	let majorityAmount = $derived.by(() => {
		switch (majority) {
			case 'SIMPLE':
				return calculateMajority((committee?.totalPresent ?? 0) - votesAbstain, 'simple');
			case 'ABSOLUTE':
				return committee?.simpleMajority ?? 0;
			case 'TWO_THIRDS':
				return committee?.twoThirdsMajority ?? 0;
			default:
				return 0;
		}
	});

	// The only trigger for ending the voting window is the timer — no manual override,
	// so every delegate keeps the full window they were promised. Owned by this
	// component (not the countdown child) so the mutation call site can't race with
	// the child unmounting itself.
	$effect(() => {
		if (timerExpired && sessionId && !serverEvaluationStage && !evaluationRequested) {
			evaluationRequested = true;
			client.mutate
				.updateVotingSession({ __args: { id: sessionId, currentStage: 'EVALUATION' }, id: true })
				.catch(() => {
					evaluationRequested = false;
				});
		}
	});

	const exit = (completed: boolean = false) => {
		const outcome: 'ADOPTED' | 'REJECTED' | null = completed
			? votesPro >= majorityAmount
				? 'ADOPTED'
				: 'REJECTED'
			: null;

		if (sessionId) {
			const id = sessionId;
			mintedSessionId = null;
			client.mutate.completeVotingSession({ __args: { id, outcome } }).catch(() => {});
		}

		if (oncomplete) {
			if (completed) {
				oncomplete({
					outcome: outcome!,
					votesFor: votesPro,
					votesAgainst: votesCon,
					votesAbstain: votesAbstain,
					cancelled: false
				});
			} else {
				oncomplete({ votesFor: 0, votesAgainst: 0, votesAbstain: 0, cancelled: true });
			}
		}

		active = false;
	};

	$effect(() => {
		if (active) {
			(document.activeElement as HTMLElement | null)?.blur();
			hotkeys('esc', 'deviceBasedVote', (event) => {
				event.preventDefault();
				exit(evaluationStage);
			});
			hotkeys.setScope('deviceBasedVote');

			untrack(() => {
				if (!committee) return;

				// Mint the session id client-side and adopt it synchronously, same rationale
				// as the roll-call/show-of-hands chairs: offline the mutation promise never
				// resolves, so an id must be usable immediately for follow-up mutations and
				// for the shared entity key with the presentation popup. Once the live query
				// picks up the real (possibly resumed) session, `sessionId` reads from that
				// instead — this is only the fallback before the first live update arrives.
				const id = nanoid();
				mintedSessionId = id;
				timerExpired = false;
				evaluationRequested = false;
				client.mutate
					.startVotingSession({
						__args: {
							id,
							committeeId: committee.id,
							mode: 'DEVICE_BASED',
							majority: majority ?? 'SIMPLE',
							majorityAmount: 0,
							withAbstentions: withAbstentions ?? false,
							voteName: voteName ?? null,
							deviceVotingWindowSeconds
						},
						id: true,
						currentStage: true,
						deviceVotingStartedAt: true,
						deviceVotingWindowSeconds: true,
						votes: { id: true, committeeMemberId: true, vote: true }
					})
					.then((result) => {
						if (!active) {
							client.mutate
								.completeVotingSession({ __args: { id: result.id, outcome: null } })
								.catch(() => {});
							return;
						}
						// Server may resume an existing session under a different id; adopt it.
						// The live query above takes over from here for tallies/stage.
						mintedSessionId = result.id;
					})
					.catch(() => {
						active = false;
					});
			});

			return () => {
				hotkeys.deleteScope('deviceBasedVote');
			};
		} else {
			untrack(() => {
				if (sessionId) {
					const id = sessionId;
					mintedSessionId = null;
					client.mutate.completeVotingSession({ __args: { id, outcome: null } }).catch(() => {});
				}
			});
		}
	});
</script>

<Modal bind:open={active} closeOnEsc={false}>
	<h1 class="mb-4 text-2xl font-bold">{voteName || m.deviceBasedVoting()}</h1>

	{#if deviceVotingStartedAt && !evaluationStage}
		<DeviceVotingCountdown
			startTimestamp={deviceVotingStartedAt}
			{windowSeconds}
			bind:expired={timerExpired}
		/>
	{/if}

	<div class="h-2"></div>

	<ResultChart
		{majorityAmount}
		{votesAbstain}
		{votesCon}
		{votesPro}
		total={members.length}
		showNumbers
	/>

	{#if nonVoters.length > 0}
		<div class="alert alert-warning mt-4 flex-col items-start gap-2 p-3">
			<span class="font-semibold">
				<i class="fas fa-triangle-exclamation mr-1"></i>
				{m.didNotVoteYet({ count: String(nonVoters.length) })}
			</span>
			<div class="max-h-48 w-full overflow-y-auto">
				<div class="flex flex-wrap gap-1.5">
					{#each nonVoters as member (member.id)}
						<span class="badge badge-outline gap-1">
							<Flag representation={member.representation} size="xs" />
							{member.representation?.name || member.representation?.alpha2Code}
						</span>
					{/each}
				</div>
			</div>
		</div>
	{/if}

	{#if evaluationStage}
		<div class="modal-action justify-around">
			<button class="btn btn-lg flex gap-2" onclick={() => exit(true)}>
				<i class="fas fa-xmark"></i>
				{m.close()}
				<Kbd hotkey="esc" />
			</button>
		</div>
	{/if}

	<div class="absolute top-3 right-3">
		<button
			aria-label="Close modal"
			class="btn btn-ghost btn-circle btn-sm"
			onclick={() => exit(evaluationStage)}
		>
			<i class="fa-duotone fa-xmark"></i>
		</button>
	</div>
</Modal>
