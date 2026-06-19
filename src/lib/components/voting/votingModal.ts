import { writable } from 'svelte/store';

export type VotingStage = 'PRO' | 'CON' | 'ABSTAIN' | 'EVALUATION';
export type VotingOptions = 'PRO' | 'CON' | 'ABSTAIN';
export type VotingMajority = 'SIMPLE' | 'ABSOLUTE' | 'TWO_THIRDS';

export interface VotingConfig {
	voteName?: string;
	majority?: VotingMajority;
	voteType?: 'SHOW_OF_HANDS' | 'ROLL_CALL';
	withAbstentions?: boolean;
}

export interface VotingResult {
	outcome?: 'ADOPTED' | 'REJECTED';
	votesFor: number;
	votesAgainst: number;
	votesAbstain: number;
	cancelled: boolean;
}

interface VotingModalState {
	config: VotingConfig;
	onComplete: (result: VotingResult) => void;
	/** Skip the setup form and go straight to the executing phase (resume flow). */
	resume?: boolean;
}

export const votingModalStore = writable<VotingModalState | null>(null);

export function openVotingModal(config: VotingConfig = {}): Promise<VotingResult> {
	return new Promise((resolve) => {
		votingModalStore.set({
			config,
			onComplete: (result) => {
				votingModalStore.set(null);
				resolve(result);
			}
		});
	});
}

export function resumeVotingModal(config: VotingConfig = {}): Promise<VotingResult> {
	return new Promise((resolve) => {
		votingModalStore.set({
			config,
			resume: true,
			onComplete: (result) => {
				votingModalStore.set(null);
				resolve(result);
			}
		});
	});
}

export function closeVotingModal(): void {
	votingModalStore.update((state) => {
		if (state) {
			state.onComplete({
				votesFor: 0,
				votesAgainst: 0,
				votesAbstain: 0,
				cancelled: true
			});
		}
		return null;
	});
}
