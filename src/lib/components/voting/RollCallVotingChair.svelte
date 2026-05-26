<script lang="ts">
	import Kbd from '$lib/components/Kbd.svelte';
	import { untrack } from 'svelte';
	import { m } from '$lib/paraglide/messages';
	import Modal from '../Modal.svelte';
	import hotkeys from 'hotkeys-js';
	import toast from 'svelte-french-toast';
	import { client } from '$lib/api/rumbleClient/client';
	import { type VotingMajority, type VotingOptions } from './votingModal';
	import ScrollingCountryList from '../rollCall/ScrollingCountryList.svelte';
	import ResultChart from './ResultChart.svelte';
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

	let currentIndex = $state(0);
	let stage = $state<'ROLL_CALL' | 'EVALUATION'>('ROLL_CALL');
	let sessionId = $state<string | null>(null);
	let rollCallVotingPro = $state<string[]>([]);
	let rollCallVotingCon = $state<string[]>([]);
	let rollCallVotingAbstain = $state<string[]>([]);

	let members = committee?.members
		.filter((member) => member.present && member.representation?.type === 'DELEGATION')
		.sort((a, b) => sortTranslatedCountries(a.representation!, b.representation!));

	let majorityAmount = $derived.by(() => {
		switch (majority) {
			case 'SIMPLE':
				return calculateMajority(
					(committee?.totalPresent ?? 0) - (rollCallVotingAbstain?.length ?? 0),
					'simple'
				);
			case 'ABSOLUTE':
				return committee?.simpleMajority ?? 0;
			case 'TWO_THIRDS':
				return committee?.twoThirdsMajority ?? 0;
			default:
				return 0;
		}
	});

	let scrollingListIcons = $derived.by(() => {
		return members.map((member) => {
			let icon: string;
			let color: 'info' | 'success' | 'error';
			if (rollCallVotingAbstain?.includes(member.id)) {
				icon = 'fa-circle';
				color = 'info';
			} else if (rollCallVotingPro?.includes(member.id)) {
				icon = 'fa-circle-plus';
				color = 'success';
			} else if (rollCallVotingCon?.includes(member.id)) {
				icon = 'fa-circle-minus';
				color = 'error';
			} else {
				icon = 'fa-question';
				color = 'info';
			}
			return { id: member.id, icon, color };
		});
	});

	const changeVote = (member: (typeof members)[number], vote: VotingOptions) => {
		if (!sessionId) return;
		rollCallVotingPro = rollCallVotingPro.filter((id) => id !== member.id);
		rollCallVotingCon = rollCallVotingCon.filter((id) => id !== member.id);
		rollCallVotingAbstain = rollCallVotingAbstain.filter((id) => id !== member.id);
		switch (vote) {
			case 'PRO':
				rollCallVotingPro = [...rollCallVotingPro, member.id];
				break;
			case 'CON':
				rollCallVotingCon = [...rollCallVotingCon, member.id];
				break;
			case 'ABSTAIN':
				rollCallVotingAbstain = [...rollCallVotingAbstain, member.id];
				break;
		}
		client.mutate
			.setVoteForMember({
				__args: { sessionId, committeeMemberId: member.id, vote },
				id: true
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
		const nextIdx = (currentIndex + 1) % members.length;
		currentIndex = nextIdx;
		syncIndex(nextIdx);
	};

	const exit = (completed: boolean = false) => {
		const proCount = rollCallVotingPro.length;
		const outcome: 'ADOPTED' | 'REJECTED' | null = completed
			? proCount >= majorityAmount
				? 'ADOPTED'
				: 'REJECTED'
			: null;

		if (sessionId) {
			const id = sessionId;
			sessionId = null;
			client.mutate.completeVotingSession({ __args: { id, outcome } }).catch(() => {});
		}

		if (oncomplete) {
			if (completed) {
				oncomplete({
					outcome: outcome!,
					votesFor: rollCallVotingPro.length,
					votesAgainst: rollCallVotingCon.length,
					votesAbstain: rollCallVotingAbstain.length,
					cancelled: false
				});
			} else {
				oncomplete({ votesFor: 0, votesAgainst: 0, votesAbstain: 0, cancelled: true });
			}
		}

		rollCallVotingPro = [];
		rollCallVotingCon = [];
		rollCallVotingAbstain = [];
		active = false;
	};

	$effect(() => {
		if (active) {
			(document.activeElement as HTMLElement | null)?.blur();
			hotkeys('j, k, l, esc', 'rollCallVote', (event, handler) => {
				event.preventDefault();
				switch (handler.key) {
					case 'k':
						if (stage === 'ROLL_CALL' && withAbstentions) {
							setVote('ABSTAIN');
						}
						break;
					case 'l':
						if (stage === 'ROLL_CALL') {
							setVote('PRO');
						}
						break;
					case 'j':
						if (stage === 'ROLL_CALL') {
							setVote('CON');
						}
						break;
					case 'esc':
						exit(stage === 'EVALUATION');
						break;
				}
			});
			hotkeys.setScope('rollCallVote');

			untrack(() => {
				if (!committee) return;
				stage = 'ROLL_CALL';
				currentIndex = 0;
				rollCallVotingPro = [];
				rollCallVotingCon = [];
				rollCallVotingAbstain = [];

				client.mutate
					.startVotingSession({
						__args: {
							committeeId: committee.id,
							mode: 'ROLL_CALL',
							majority: majority ?? 'SIMPLE',
							majorityAmount: 0,
							withAbstentions: withAbstentions ?? false,
							voteName: voteName ?? null
						},
						id: true,
						currentMemberIndex: true,
						votes: { committeeMemberId: true, vote: true }
					})
					.then((result) => {
						if (!active) {
							client.mutate
								.completeVotingSession({ __args: { id: result.id, outcome: null } })
								.catch(() => {});
							return;
						}
						sessionId = result.id;
						currentIndex = result.currentMemberIndex;
						rollCallVotingPro = result.votes
							.filter((v: { vote: string }) => v.vote === 'PRO')
							.map((v: { committeeMemberId: string }) => v.committeeMemberId);
						rollCallVotingCon = result.votes
							.filter((v: { vote: string }) => v.vote === 'CON')
							.map((v: { committeeMemberId: string }) => v.committeeMemberId);
						rollCallVotingAbstain = result.votes
							.filter((v: { vote: string }) => v.vote === 'ABSTAIN')
							.map((v: { committeeMemberId: string }) => v.committeeMemberId);
					})
					.catch(() => {
						toast.error(m.rollCallError());
						active = false;
					});
			});

			return () => {
				hotkeys.deleteScope('rollCallVote');
			};
		} else {
			untrack(() => {
				if (sessionId) {
					const id = sessionId;
					sessionId = null;
					client.mutate.completeVotingSession({ __args: { id, outcome: null } }).catch(() => {});
				}
				rollCallVotingPro = [];
				rollCallVotingCon = [];
				rollCallVotingAbstain = [];
				currentIndex = 0;
				stage = 'ROLL_CALL';
			});
		}
	});
</script>

<Modal bind:open={active} closeOnEsc={false}>
	<h1 class="mb-4 text-2xl font-bold">{voteName || m.rollCallVoting()}</h1>

	<ResultChart
		{majorityAmount}
		votesAbstain={rollCallVotingAbstain?.length}
		votesCon={rollCallVotingCon?.length}
		votesPro={rollCallVotingPro?.length}
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
					onclick={() => {
						const newIdx = (currentIndex - 1 + members.length) % members.length;
						currentIndex = newIdx;
						syncIndex(newIdx);
					}}
				>
					<i class="fas fa-chevron-up"></i>
				</button>
			</div>
			<div class="flex flex-row justify-center gap-4">
				<button
					class="btn btn-error btn-lg flex gap-2"
					onclick={() => {
						setVote('CON');
					}}
				>
					<i class="fas fa-circle-minus"></i>
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
						<i class="fas fa-circle"></i>
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
					<i class="fas fa-circle-plus"></i>
					{m.pro()}
					<Kbd hotkey="L" />
				</button>
			</div>
		</div>
	{:else}
		<div class="modal-action">
			<button
				class="btn btn-lg flex gap-2"
				onclick={() => {
					exit(true);
				}}
			>
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
			onclick={() => {
				exit(stage === 'EVALUATION');
			}}
		>
			<i class="fa-duotone fa-xmark"></i>
		</button>
	</div>
</Modal>
