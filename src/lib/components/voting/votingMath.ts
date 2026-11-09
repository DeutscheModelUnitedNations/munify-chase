import dayjs from 'dayjs';
import { calculateMajority } from '#lib/utils/majorities';
import { sortTranslatedCountries } from '#lib/utils/nationTranslationHelper.svelte';
import type {
	VotingConfig,
	VotingMajority,
	VotingOptions,
	VotingResult,
	VotingStage
} from './votingModal';

export type VoteType = NonNullable<VotingConfig['voteType']>;

/** The committee a chair runs a vote in. */
export interface VotingCommittee {
	id: string;
	totalPresent: number;
	simpleMajority: number;
	twoThirdsMajority: number;
	members: Array<VotingMember>;
}

export interface VotingMember {
	id: string;
	present: boolean;
	representation?: {
		name?: string | null;
		alpha2Code?: string | null;
		alpha3Code?: string | null;
		icon?: string | null;
		type?: string | null;
		regionalGroup?: string | null;
	} | null;
}

interface CastVote {
	committeeMemberId: string;
	vote: string;
}

/** The present delegations, which are the ones that vote, sorted by their translated name. */
export function presentDelegations<M extends VotingMember>(members: M[]): M[] {
	return members
		.filter((member) => member.present && member.representation?.type === 'DELEGATION')
		.sort((a, b) => sortTranslatedCountries(a.representation!, b.representation!));
}

/** Votes needed in a vote where every present delegation is counted (roll call, device based). */
export function committeeMajorityAmount({
	majority,
	committee,
	abstainCount
}: {
	majority?: string | null;
	committee?: Pick<VotingCommittee, 'totalPresent' | 'simpleMajority' | 'twoThirdsMajority'> | null;
	abstainCount: number;
}): number {
	if (!committee) return 0;
	switch (majority) {
		case 'SIMPLE':
			return calculateMajority(committee.totalPresent - abstainCount, 'simple');
		case 'ABSOLUTE':
			return committee.simpleMajority;
		case 'TWO_THIRDS':
			return committee.twoThirdsMajority;
		default:
			return 0;
	}
}

/** The votes a show of hands majority is measured against. */
export function showOfHandsTotal({
	majority,
	pro,
	con,
	abstain
}: {
	majority?: string | null;
	pro?: number | null;
	con?: number | null;
	abstain?: number | null;
}): number {
	const counted = (pro ?? 0) + (con ?? 0);
	switch (majority) {
		case 'SIMPLE':
		case 'TWO_THIRDS':
			return counted;
		case 'ABSOLUTE':
			return counted + (abstain ?? 0);
		default:
			return 0;
	}
}

/** Votes needed in a show of hands, out of the counted votes. */
export function showOfHandsMajority({
	majority,
	total
}: {
	majority?: string | null;
	total: number;
}): number {
	switch (majority) {
		case 'SIMPLE':
		case 'ABSOLUTE':
			return calculateMajority(total, 'simple');
		case 'TWO_THIRDS':
			return calculateMajority(total, 'twoThirds');
		default:
			return 0;
	}
}

/**
 * What ending a vote reports: the outcome stored on the session and the result handed to
 * whoever opened the vote. A vote closed before it was evaluated is cancelled.
 */
export function finishVote({
	completed,
	majorityAmount,
	votesFor,
	votesAgainst,
	votesAbstain
}: {
	completed: boolean;
	majorityAmount: number;
	votesFor: number;
	votesAgainst: number;
	votesAbstain: number;
}): { outcome: 'ADOPTED' | 'REJECTED' | null; result: VotingResult } {
	if (!completed) {
		return {
			outcome: null,
			result: { votesFor: 0, votesAgainst: 0, votesAbstain: 0, cancelled: true }
		};
	}
	const outcome = votesFor >= majorityAmount ? 'ADOPTED' : 'REJECTED';
	return {
		outcome,
		result: { outcome, votesFor, votesAgainst, votesAbstain, cancelled: false }
	};
}

/** The member ids that voted each way. */
export function idsByVote(votes: CastVote[]): Record<VotingOptions, string[]> {
	const idsFor = (choice: VotingOptions) =>
		votes.filter((v) => v.vote === choice).map((v) => v.committeeMemberId);
	return { PRO: idsFor('PRO'), CON: idsFor('CON'), ABSTAIN: idsFor('ABSTAIN') };
}

/** The members that voted each way, and those that have not voted yet, in member order. */
export function membersByVote<M extends { id: string }>({
	members,
	votes
}: {
	members: M[];
	votes: CastVote[];
}): Record<VotingOptions | 'REMAINING', M[]> {
	const choiceOf = (member: M) => votes.find((v) => v.committeeMemberId === member.id)?.vote;
	const withChoice = (choice: string | undefined) =>
		members.filter((member) => choiceOf(member) === choice);
	return {
		REMAINING: withChoice(undefined),
		PRO: withChoice('PRO'),
		CON: withChoice('CON'),
		ABSTAIN: withChoice('ABSTAIN')
	};
}

/** Whether a device based voting window has run out on the given clock. */
export function deviceVotingExpired({
	startedAt,
	windowSeconds,
	now
}: {
	startedAt?: Date | string | null;
	windowSeconds?: number | null;
	now: dayjs.ConfigType;
}): boolean {
	if (!startedAt || !windowSeconds) return false;
	return dayjs(startedAt).add(windowSeconds, 'seconds').diff(now) <= 0;
}

/** The stage a show of hands moves to next; `DONE` closes the vote. */
export function nextShowOfHandsStage({
	stage,
	withAbstentions
}: {
	stage: VotingStage;
	withAbstentions: boolean;
}): VotingStage | 'DONE' {
	switch (stage) {
		case 'PRO':
			return 'CON';
		case 'CON':
			return withAbstentions ? 'ABSTAIN' : 'EVALUATION';
		case 'ABSTAIN':
			return 'EVALUATION';
		default:
			return 'DONE';
	}
}

/** The stage a show of hands goes back to. */
export function previousShowOfHandsStage({
	stage,
	withAbstentions
}: {
	stage: VotingStage;
	withAbstentions: boolean;
}): VotingStage {
	switch (stage) {
		case 'CON':
			return 'PRO';
		case 'ABSTAIN':
			return 'CON';
		case 'EVALUATION':
			return withAbstentions ? 'ABSTAIN' : 'CON';
		default:
			return stage;
	}
}

/** What the forward button of a show of hands does from this stage. */
export function showOfHandsForwardAction({
	stage,
	withAbstentions
}: {
	stage: VotingStage;
	withAbstentions: boolean;
}): 'close' | 'publish' | 'forward' {
	const next = nextShowOfHandsStage({ stage, withAbstentions });
	if (next === 'DONE') return 'close';
	return next === 'EVALUATION' ? 'publish' : 'forward';
}

/** How the counted hands compare to the present delegations. */
export function handsCountState({
	votesCast,
	votesTotal,
	presentDelegations
}: {
	votesCast: number;
	votesTotal: number;
	presentDelegations: number;
}): 'over' | 'matching' | 'open' {
	if (presentDelegations > 0 && votesCast > presentDelegations) return 'over';
	return votesTotal === presentDelegations ? 'matching' : 'open';
}

/** Percentage of the present delegations whose hands were counted, capped at 100. */
export function handsProgress({
	votesCast,
	presentDelegations
}: {
	votesCast: number;
	presentDelegations: number;
}): number {
	return presentDelegations > 0 ? Math.min((votesCast / presentDelegations) * 100, 100) : 0;
}

/** The stage and tallies of a show of hands the server resumed. */
export function resumedShowOfHands(session: {
	currentStage?: VotingStage | null;
	votesPro?: number | null;
	votesCon?: number | null;
	votesAbstain?: number | null;
}): { stage: VotingStage | null; pro: number; con: number; abstain: number } {
	return {
		stage: session.currentStage ?? null,
		pro: session.votesPro ?? 0,
		con: session.votesCon ?? 0,
		abstain: session.votesAbstain ?? 0
	};
}

/** The final tally boxes on the show of hands presentation, abstentions only when allowed. */
export function showOfHandsResultBoxes(
	session: {
		votesPro?: number | null;
		votesCon?: number | null;
		votesAbstain?: number | null;
		withAbstentions?: boolean | null;
	} | null
): { icon: string; value: number; classes: string }[] {
	if (!session) return [];
	const boxes = [
		{
			icon: 'plus-circle',
			value: session.votesPro ?? 0,
			classes: 'bg-success text-success-content'
		},
		{ icon: 'circle', value: session.votesAbstain ?? 0, classes: 'bg-info text-info-content' },
		{ icon: 'minus-circle', value: session.votesCon ?? 0, classes: 'bg-error text-error-content' }
	];
	return session.withAbstentions ? boxes : boxes.filter((box) => box.icon !== 'circle');
}

/** The vote a roll call key casts, or null when the key does nothing right now. */
export function rollCallKeyVote({
	key,
	stage,
	withAbstentions
}: {
	key: string;
	stage: 'ROLL_CALL' | 'EVALUATION';
	withAbstentions?: boolean;
}): VotingOptions | null {
	if (stage !== 'ROLL_CALL') return null;
	const votes: Record<string, VotingOptions | null> = {
		j: 'CON',
		l: 'PRO',
		k: withAbstentions ? 'ABSTAIN' : null
	};
	return votes[key] ?? null;
}

/** The icon a member shows in the roll call list for their vote so far. */
export function rollCallIcon({
	memberId,
	votes
}: {
	memberId: string;
	votes: Record<VotingOptions, string[]>;
}): { icon: string; color: 'info' | 'success' | 'error' } {
	if (votes.ABSTAIN.includes(memberId)) return { icon: 'circle', color: 'info' };
	if (votes.PRO.includes(memberId)) return { icon: 'plus-circle', color: 'success' };
	if (votes.CON.includes(memberId)) return { icon: 'minus-circle', color: 'error' };
	return { icon: 'question', color: 'info' };
}

/** `votes` with the member's vote replaced by `vote`. */
export function withVote({
	votes,
	memberId,
	vote
}: {
	votes: Record<VotingOptions, string[]>;
	memberId: string;
	vote: VotingOptions;
}): Record<VotingOptions, string[]> {
	const without = (ids: string[]) => ids.filter((id) => id !== memberId);
	const next = {
		PRO: without(votes.PRO),
		CON: without(votes.CON),
		ABSTAIN: without(votes.ABSTAIN)
	};
	next[vote] = [...next[vote], memberId];
	return next;
}

const VOTE_TYPES: VoteType[] = ['SHOW_OF_HANDS', 'ROLL_CALL', 'DEVICE_BASED'];
const MAJORITIES: VotingMajority[] = ['SIMPLE', 'ABSOLUTE', 'TWO_THIRDS'];

function isVoteType(value: string): value is VoteType {
	return VOTE_TYPES.some((type) => type === value);
}

function isMajority(value: string): value is VotingMajority {
	return MAJORITIES.some((majority) => majority === value);
}

/** A voting config with every field filled in, defaults where it leaves one out. */
export function votingConfigWithDefaults(config: VotingConfig): Required<VotingConfig> {
	return {
		voteType: config.voteType ?? 'SHOW_OF_HANDS',
		voteName: config.voteName ?? '',
		majority: config.majority ?? 'SIMPLE',
		withAbstentions: config.withAbstentions ?? false,
		deviceVotingWindowSeconds: config.deviceVotingWindowSeconds ?? 20
	};
}

/** The setup of a vote in progress, to resume it with. */
export function resumeVotingConfig(session: {
	mode: string;
	voteName?: string | null;
	majority?: string | null;
	withAbstentions?: boolean | null;
	deviceVotingWindowSeconds?: number | null;
}): Required<VotingConfig> {
	return votingConfigWithDefaults({
		voteType: isVoteType(session.mode) ? session.mode : 'DEVICE_BASED',
		voteName: session.voteName ?? undefined,
		majority: session.majority && isMajority(session.majority) ? session.majority : undefined,
		withAbstentions: session.withAbstentions ?? undefined,
		deviceVotingWindowSeconds: session.deviceVotingWindowSeconds ?? undefined
	});
}

/** Width of a part of the result chart, as a CSS percentage. */
export function chartPercentage({
	value,
	total
}: {
	value: number | undefined | null;
	total: number | undefined | null;
}): string | 0 {
	if (value === null || value === undefined || total === 0) return 0;
	return `${(value / (total ?? 1)) * 100}%`;
}

/** The setup a chair starts a voting session with, defaults where the vote leaves one out. */
export function voteSetupArgs({
	majority,
	withAbstentions,
	voteName
}: {
	majority?: VotingMajority;
	withAbstentions?: boolean;
	voteName?: string;
}): {
	majority: VotingMajority;
	majorityAmount: 0;
	withAbstentions: boolean;
	voteName: string | null;
} {
	return {
		majority: majority ?? 'SIMPLE',
		majorityAmount: 0,
		withAbstentions: withAbstentions ?? false,
		voteName: voteName ?? null
	};
}

/** What a presentation shows of a vote: who votes, the votes cast and the majority needed. */
export function presentationTally<M extends VotingMember>({
	committee,
	session
}: {
	committee?: (Omit<VotingCommittee, 'members'> & { members: M[] }) | null;
	session?: { majority?: string | null; votes: CastVote[] } | null;
}): { members: M[]; votes: CastVote[]; majorityAmount: number } {
	const votes = session?.votes ?? [];
	return {
		members: presentDelegations(committee?.members ?? []),
		votes,
		majorityAmount: committeeMajorityAmount({
			majority: session?.majority,
			committee,
			abstainCount: votes.filter((v) => v.vote === 'ABSTAIN').length
		})
	};
}

/** Props of the presentations that show who voted how. */
export interface BallotPresentationProps {
	committeeId: string;
	committee?: VotingCommittee | null;
}
