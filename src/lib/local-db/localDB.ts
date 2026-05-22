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
	rollCall: number | null;
	/**
	 * Committee member IDs whose roll-call presence change is currently being
	 * saved (mutation in flight, not yet confirmed by the server). Shared across
	 * tabs so the presentation view can show a spinner instead of a misleading
	 * absent/present icon while a delegation is still syncing. Not indexed, so no
	 * Dexie schema/version change is required.
	 */
	rollCallPending: string[] | null;

	showOfHandsVotingActive: boolean;
	showOfHandsVotingStage: VotingStage | null;
	showOfHandsVotingVotesPro: number | null;
	showOfHandsVotingVotesCon: number | null;
	showOfHandsVotingVotesAbstain: number | null;
	showOfHandsVotingVotesTotal: number | null;

	rollCallVotingActive: boolean;
	rollCallVotingPro: string[] | null;
	rollCallVotingCon: string[] | null;
	rollCallVotingAbstain: string[] | null;

	votingVoteName: string | null;
	votingMajority: VotingMajority | null;
	votingWithAbstentions: boolean | null;
	votingMajorityAmount: number | null;
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
	rollCall,
	currentVoting,

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

export type { CommitteeSettings };
export { localDB };
