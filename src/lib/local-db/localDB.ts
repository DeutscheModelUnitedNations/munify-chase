import type { PresentationLayoutPresetOptions } from '$lib/data/presentationLayoutPresets';
import Dexie, { type EntityTable } from 'dexie';

export type VotingStage = 'PRO' | 'CON' | 'ABSTAIN' | 'EVALUATION';
export type VotingOptions = 'PRO' | 'CON' | 'ABSTAIN';
export type VotingMajority = 'SIMPLE' | 'ABSOLUTE' | 'TWO_THIRDS';

interface CommitteeSettings {
	committeeId: string;
	layout: PresentationLayoutPresetOptions;
	presentationRootFontSize: number;
	presentationResolutionFontSize: number;
	displayRegionalGroups: boolean;
}

const localDB = new Dexie('local-db') as Dexie & {
	committeeSettings: EntityTable<CommitteeSettings, 'committeeId'>;
};

localDB.version(1).stores({
	committeeSettings: `
	++committeeId,
	layout,
	presentationRootFontSize,
	presentationResolutionFontSize,
	displayRegionalGroups,
	rollCall
	`
});

localDB.version(2).stores({
	committeeSettings: `
	++committeeId,
	layout,
	presentationRootFontSize,
	presentationResolutionFontSize,
	displayRegionalGroups,
	rollCall,

	showOfHandsVotingActive,
	showOfHandsVotingStage,
	showOfHandsVotingVotesPro,
	showOfHandsVotingVotesCon,
	showOfHandsVotingVotesAbstain,
	showOfHandsVotingVotesTotal,

	rollCallVotingActive,
	rollCallVotingPro,
	rollCallVotingCon,
	rollCallVotingAbstain,

	votingVoteName,
	votingMajority,
	votingWithAbstentions,
	votingMajorityAmount
	`
});

// Version 3: roll call state moved to server-side (rollCallSession table)
localDB.version(3).stores({
	committeeSettings: `
	++committeeId,
	layout,
	presentationRootFontSize,
	presentationResolutionFontSize,
	displayRegionalGroups,

	showOfHandsVotingActive,
	showOfHandsVotingStage,
	showOfHandsVotingVotesPro,
	showOfHandsVotingVotesCon,
	showOfHandsVotingVotesAbstain,
	showOfHandsVotingVotesTotal,

	rollCallVotingActive,
	rollCallVotingPro,
	rollCallVotingCon,
	rollCallVotingAbstain,

	votingVoteName,
	votingMajority,
	votingWithAbstentions,
	votingMajorityAmount
	`
});

// Version 4: voting state moved to server-side (votingSession/votingVote tables)
localDB.version(4).stores({
	committeeSettings: `
	++committeeId,
	layout,
	presentationRootFontSize,
	presentationResolutionFontSize,
	displayRegionalGroups
	`
});

export type { CommitteeSettings };
export { localDB };
