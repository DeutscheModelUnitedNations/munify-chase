<script lang="ts">
	import Kbd from '$lib/components/Kbd.svelte';
	import { untrack } from 'svelte';
	import { m } from '$lib/paraglide/messages';
	import Modal from '../Modal.svelte';
	import hotkeys from 'hotkeys-js';
	import toast from 'svelte-french-toast';
	import { localDB, type VotingMajority, type VotingOptions } from '$lib/local-db/localDB';
	import ScrollingCountryList from '../rollCall/ScrollingCountryList.svelte';
	import { liveQuery } from 'dexie';
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

	const exitVote = (completed: boolean = false) => {
		if (oncomplete) {
			if (completed) {
				const votesFor = rollCallVotingPro?.length ?? 0;
				const votesAgainst = rollCallVotingCon?.length ?? 0;
				const votesAbstain = rollCallVotingAbstain?.length ?? 0;
				oncomplete({
					outcome: votesFor >= majorityAmount ? 'ADOPTED' : 'REJECTED',
					votesFor,
					votesAgainst,
					votesAbstain,
					cancelled: false
				});
			} else {
				oncomplete({
					votesFor: 0,
					votesAgainst: 0,
					votesAbstain: 0,
					cancelled: true
				});
			}
		}
		active = false;
	};

	let members = committee?.members
		.filter((member) => member.present && member.representation?.type === 'DELEGATION')
		.sort((a, b) => sortTranslatedCountries(a.representation!, b.representation!));

	let chairSettings = liveQuery(() => localDB.committeeSettings.get(committee.id));
	let rollCallVotingAbstain = $derived($chairSettings?.rollCallVotingAbstain ?? []);
	let rollCallVotingPro = $derived($chairSettings?.rollCallVotingPro ?? []);
	let rollCallVotingCon = $derived($chairSettings?.rollCallVotingCon ?? []);

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
			return {
				id: member.id,
				icon,
				color
			};
		});
	});

	const changeVote = async (member: (typeof members)[number], vote: VotingOptions) => {
		if (!committee) return;
		if (
			[...rollCallVotingPro, ...rollCallVotingCon, ...rollCallVotingAbstain].includes(member.id)
		) {
			await localDB.committeeSettings.update(committee.id, {
				rollCallVotingPro: rollCallVotingPro?.filter((id) => id !== member.id),
				rollCallVotingCon: rollCallVotingCon?.filter((id) => id !== member.id),
				rollCallVotingAbstain: rollCallVotingAbstain?.filter((id) => id !== member.id)
			});
		}
		switch (vote) {
			case 'PRO': {
				const updatedPro = rollCallVotingPro?.includes(member.id)
					? rollCallVotingPro
					: [...(rollCallVotingPro ?? []), member.id];
				await localDB.committeeSettings.update(committee.id, {
					rollCallVotingPro: updatedPro
				});
				break;
			}
			case 'CON': {
				const updatedCon = rollCallVotingCon?.includes(member.id)
					? rollCallVotingCon
					: [...(rollCallVotingCon ?? []), member.id];
				await localDB.committeeSettings.update(committee.id, {
					rollCallVotingCon: updatedCon
				});
				break;
			}
			case 'ABSTAIN': {
				const updatedAbstain = rollCallVotingAbstain?.includes(member.id)
					? rollCallVotingAbstain
					: [...(rollCallVotingAbstain ?? []), member.id];
				await localDB.committeeSettings.update(committee.id, {
					rollCallVotingAbstain: updatedAbstain
				});
				break;
			}
		}
	};

	const setVote = async (vote: VotingOptions) => {
		const member = members[currentIndex];
		if (member) {
			await changeVote(member, vote);

			if (currentIndex === members.length - 1) {
				stage = 'EVALUATION';
			}
			currentIndex = (currentIndex + 1) % members.length;
		} else {
			toast.error(m.rollCallError());
		}
	};

	$effect(() => {
		if (active) {
			localDB.committeeSettings.update(committee.id, {
				votingMajorityAmount: majorityAmount
			});
		}
	});

	$effect(() => {
		if (active) {
			// hotkeys-js's default filter suppresses every shortcut while a text
			// input/textarea/select is focused. If a vote is started while focus is
			// still in an input (e.g. the vote-name field, or any field behind the
			// modal), the first J/K/L/esc presses get swallowed. Blur so the keys
			// register immediately.
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
						exitVote(stage === 'EVALUATION');
						break;
				}
			});
			hotkeys.setScope('rollCallVote');
		} else {
			hotkeys.deleteScope('rollCallVote');
		}
	});

	// Only the `active` transition (vote start / end) should reset this state.
	// Everything else is read inside `untrack` so reading `committee.id` does not
	// subscribe this effect to the committee liveQuery proxy — otherwise any
	// unrelated committee update (timers, presence, speakers list, other tabs)
	// re-runs the effect mid-call and wipes the in-progress tally back to empty.
	$effect(() => {
		if (active) {
			untrack(() => {
				if (!committee) return;
				stage = 'ROLL_CALL';
				currentIndex = 0;
				localDB.committeeSettings.update(committee.id, {
					rollCallVotingActive: true,
					votingVoteName: voteName,
					votingMajority: majority,
					rollCallVotingPro: [],
					rollCallVotingCon: [],
					rollCallVotingAbstain: [],
					votingWithAbstentions: withAbstentions
				});
			});
		} else {
			untrack(() => {
				if (!committee) return;
				localDB.committeeSettings.update(committee.id, {
					rollCallVotingActive: false,
					rollCallVotingPro: [],
					rollCallVotingCon: [],
					rollCallVotingAbstain: [],
					votingVoteName: null,
					votingMajority: null,
					votingWithAbstentions: false,
					votingMajorityAmount: null
				});
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
						currentIndex = (currentIndex - 1 + members.length) % members.length;
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
					exitVote(true);
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
				exitVote(stage === 'EVALUATION');
			}}
		>
			<i class="fa-duotone fa-xmark"></i>
		</button>
	</div>
</Modal>
