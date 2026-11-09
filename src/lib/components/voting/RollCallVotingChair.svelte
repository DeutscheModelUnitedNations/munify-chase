<script lang="ts">
	import Kbd from '#lib/components/Kbd.svelte';
	import { untrack } from 'svelte';
	import { m } from '#lib/paraglide/messages';
	import Modal from '../Modal.svelte';
	import hotkeys from 'hotkeys-js';
	import toast from 'svelte-french-toast';
	import { client } from '#lib/api/rumbleClient/client';
	import { nanoid } from '#lib/helpers/nanoid';
	import { type VotingMajority, type VotingOptions } from './votingModal';
	import ScrollingCountryList from '../rollCall/ScrollingCountryList.svelte';
	import ResultChart from './ResultChart.svelte';
	import CloseCornerButton from './CloseCornerButton.svelte';
	import CloseVoteButton from './CloseVoteButton.svelte';
	import { completeVotingSession } from './votingSession';
	import {
		committeeMajorityAmount,
		finishVote,
		voteSetupArgs,
		idsByVote,
		presentDelegations,
		rollCallIcon,
		rollCallKeyVote,
		withVote,
		type VotingCommittee
	} from './votingMath';
	import type { VotingResult } from './votingModal';

	interface Props {
		active: boolean;
		committee: VotingCommittee;
		voteName?: string;
		majority?: VotingMajority;
		withAbstentions?: boolean;
		oncomplete?: (result: VotingResult) => void;
	}

	let {
		active = $bindable(),
		committee,
		voteName,
		majority,
		withAbstentions,
		oncomplete
	}: Props = $props();

	const noVotes = (): Record<VotingOptions, string[]> => ({ PRO: [], CON: [], ABSTAIN: [] });

	let currentIndex = $state(0);
	let stage = $state<'ROLL_CALL' | 'EVALUATION'>('ROLL_CALL');
	let sessionId = $state<string | null>(null);
	let votes = $state(noVotes());

	let members = $derived(presentDelegations(committee?.members ?? []));

	let majorityAmount = $derived(
		committeeMajorityAmount({ majority, committee, abstainCount: votes.ABSTAIN.length })
	);

	let scrollingListIcons = $derived(
		members.map((member) => ({ id: member.id, ...rollCallIcon({ memberId: member.id, votes }) }))
	);

	const changeVote = (member: (typeof members)[number], vote: VotingOptions) => {
		if (!sessionId) return;
		votes = withVote({ votes, memberId: member.id, vote });
		// Select committeeMemberId + vote so they persist in the cache offline (graphcache
		// only writes an optimistic mutation's selected fields). The presentation popup
		// categorises votes by these fields, so a bare `{ id }` selection would leave every
		// flag stuck in the "remaining" column offline.
		client.mutate
			.setVoteForMember({
				__args: { id: nanoid(), sessionId, committeeMemberId: member.id, vote },
				id: true,
				committeeMemberId: true,
				vote: true
			})
			.catch(() => toast.error(m.rollCallError()));
	};

	const syncIndex = (index: number) => {
		if (!sessionId) return;
		client.mutate
			.updateVotingSession({
				__args: { id: sessionId, currentMemberIndex: index },
				id: true
			})
			.catch(() => {});
	};

	const moveTo = (index: number) => {
		currentIndex = index;
		syncIndex(index);
	};

	const setVote = (vote: VotingOptions) => {
		const member = members[currentIndex];
		if (!member) {
			toast.error(m.rollCallError());
			return;
		}
		changeVote(member, vote);
		if (currentIndex === members.length - 1) {
			stage = 'EVALUATION';
		}
		moveTo((currentIndex + 1) % members.length);
	};

	const closeSession = (outcome: 'ADOPTED' | 'REJECTED' | null) => {
		completeVotingSession({ id: sessionId, outcome });
		sessionId = null;
	};

	const exit = (completed: boolean) => {
		const { outcome, result } = finishVote({
			completed,
			majorityAmount,
			votesFor: votes.PRO.length,
			votesAgainst: votes.CON.length,
			votesAbstain: votes.ABSTAIN.length
		});
		closeSession(outcome);
		oncomplete?.(result);
		votes = noVotes();
		active = false;
	};

	const reset = () => {
		stage = 'ROLL_CALL';
		currentIndex = 0;
		votes = noVotes();
	};

	const onHotkey = (key: string) => {
		if (key === 'esc') {
			exit(stage === 'EVALUATION');
			return;
		}
		const vote = rollCallKeyVote({ key, stage, withAbstentions });
		if (vote) setVote(vote);
	};

	const startSession = () => {
		if (!committee) return;
		reset();

		// Mint the session id client-side and adopt it synchronously so the chair can
		// drive (and complete) the vote without waiting for a server response — offline
		// the mutation promise never resolves, so relying on `.then()` to set
		// `sessionId` would leave every follow-up mutation a no-op. Passing the id
		// through also keeps the optimistic entity key identical in the chair and the
		// presentation popup, so the committee's activeVotingSession FK resolves to one
		// shared row. Mirrors the roll-call chair.
		const id = nanoid();
		sessionId = id;
		client.mutate
			.startVotingSession({
				__args: {
					id,
					committeeId: committee.id,
					mode: 'ROLL_CALL',
					...voteSetupArgs({ majority, withAbstentions, voteName })
				},
				id: true,
				currentMemberIndex: true,
				votes: { id: true, committeeMemberId: true, vote: true }
			})
			.then((result) => {
				if (!active) {
					completeVotingSession({ id: result.id });
					return;
				}
				// Server may resume an existing session under a different id; adopt it.
				sessionId = result.id;
				currentIndex = result.currentMemberIndex;
				votes = idsByVote(result.votes);
			})
			.catch(() => {
				toast.error(m.rollCallError());
				active = false;
			});
	};

	$effect(() => {
		if (active) {
			(document.activeElement as HTMLElement | null)?.blur();
			hotkeys('j, k, l, esc', 'rollCallVote', (event, handler) => {
				event.preventDefault();
				onHotkey(handler.key);
			});
			hotkeys.setScope('rollCallVote');

			untrack(startSession);

			return () => {
				hotkeys.deleteScope('rollCallVote');
			};
		} else {
			untrack(() => {
				closeSession(null);
				reset();
			});
		}
	});
</script>

<Modal bind:open={active} closeOnEsc={false}>
	<h1 class="mb-4 text-2xl font-bold">{voteName || m.rollCallVoting()}</h1>

	<ResultChart
		{majorityAmount}
		votesAbstain={votes.ABSTAIN.length}
		votesCon={votes.CON.length}
		votesPro={votes.PRO.length}
		total={members.length}
		showNumbers
	/>

	{#if stage === 'ROLL_CALL'}
		<div class="h-2"></div>

		<ScrollingCountryList {members} {currentIndex} icons={scrollingListIcons} height="50vh" />

		<div class="modal-action flex-col justify-around">
			<div class="flex flex-row justify-center gap-4">
				<button
					class="btn btn-outline btn-lg join-item"
					aria-label="Move up"
					onclick={() => moveTo((currentIndex - 1 + members.length) % members.length)}
				>
					<i aria-hidden="true" class="ph-fill ph-caret-up"></i>
				</button>
			</div>
			<div class="flex flex-row justify-center gap-4">
				<button
					class="btn btn-error btn-lg flex gap-2"
					onclick={() => {
						setVote('CON');
					}}
				>
					<i aria-hidden="true" class="ph-fill ph-minus-circle"></i>
					{m.con()}
					<Kbd hotkey="J" />
				</button>
				{#if withAbstentions}
					<button
						class="btn btn-info btn-lg flex gap-2"
						onclick={() => {
							setVote('ABSTAIN');
						}}
					>
						<i aria-hidden="true" class="ph-fill ph-circle"></i>
						{m.abstain()}
						<Kbd hotkey="K" />
					</button>
				{/if}
				<button
					class="btn btn-success btn-lg flex gap-2"
					onclick={() => {
						setVote('PRO');
					}}
				>
					<i aria-hidden="true" class="ph-fill ph-plus-circle"></i>
					{m.pro()}
					<Kbd hotkey="L" />
				</button>
			</div>
		</div>
	{:else}
		<CloseVoteButton onclick={() => exit(true)} />
	{/if}

	<CloseCornerButton onclick={() => exit(stage === 'EVALUATION')} />
</Modal>
