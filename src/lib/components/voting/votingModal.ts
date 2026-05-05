import { writable } from 'svelte/store';
import type { VotingMajority } from '$lib/local-db/localDB';

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
