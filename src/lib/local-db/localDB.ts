import type { PresentationLayoutPresetOptions } from '$lib/data/presentationLayoutPresets';
import Dexie, { type EntityTable } from 'dexie';

export type VotingStage = 'PRO' | 'CON' | 'ABSTAIN' | 'EVALUATION';
interface CommitteeSettings {
	committeeId: string;
	layout: PresentationLayoutPresetOptions;
	displayRegionalGroups: boolean;
	rollCall: number | null;

	showOfHandsVotingActive: boolean;
	showOfHandsVotingVoteName: string | null;
	showOfHandsVotingMajority: 'SIMPLE' | 'ABSOLUTE' | 'TWO_THIRDS' | null;
	showOfHandsVotingWithAbstentions: boolean | null;
	showOfHandsVotingStage: VotingStage | null;
	showOfHandsVotingVotesPro: number | null;
	showOfHandsVotingVotesCon: number | null;
	showOfHandsVotingVotesAbstain: number | null;
	showOfHandsVotingVotesTotal: number | null;
	showOfHandsVotingMajorityAmount: number | null;
}

const localDB = new Dexie('local-db') as Dexie & {
	committeeSettings: EntityTable<CommitteeSettings, 'committeeId'>;
};

localDB.version(1).stores({
	committeeSettings: `
	++committeeId,
	layout,
	displayRegionalGroups,
	rollCall,
	currentVoting,
	showOfHandsVotingActive,
	showOfHandsVotingVoteName,
	showOfHandsVotingMajority,
	showOfHandsVotingWithAbstentions,
	showOfHandsVotingVotesPro,
	showOfHandsVotingVotesCon,
	showOfHandsVotingVotesAbstain,
	showOfHandsVotingVotesTotal,
	showOfHandsVotingMajorityAmount
	`
});

export type { CommitteeSettings };
export { localDB };
