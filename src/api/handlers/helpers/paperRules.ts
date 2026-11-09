import { GraphQLError } from 'graphql';
import {
	toRoman,
	isClauseEmpty
} from '@deutschemodelunitednations/munify-resolution-editor/schema';
import type { Resolution } from '@deutschemodelunitednations/munify-resolution-editor/schema';
import type { schema } from '#api/db/db';

type PaperStatus = typeof schema.resolutionPaper.$inferSelect.status;
type ConferenceUserType = typeof schema.conferenceUser.$inferSelect.conferenceUserType;

const SPONSORING_OPEN: readonly PaperStatus[] = ['WORKING_PAPER', 'SUBMITTED', 'DRAFT_RESOLUTION'];

/** Refuses sponsoring changes once a paper is past the draft resolution stage. */
export function assertSponsoringOpen(status: PaperStatus) {
	if (!SPONSORING_OPEN.includes(status)) {
		throw new GraphQLError('Sponsoring is not open for this paper');
	}
}

/** Only the team may write comments only the team reads. */
export function assertMayCommentWith({
	visibility,
	authorType
}: {
	visibility: 'PUBLIC' | 'TEAM_ONLY';
	authorType: ConferenceUserType;
}) {
	if (visibility === 'TEAM_ONLY' && authorType !== 'ADMIN' && authorType !== 'TEAM') {
		throw new GraphQLError('Only chairs can create team-only comments');
	}
}

interface PaperUpdateArgs {
	title?: string | null;
	status?: PaperStatus | null;
	documentNumber?: string | null;
}

/** Whether the update asks for something only chairs may do. */
export function needsChairCheck(args: PaperUpdateArgs) {
	return args.documentNumber != null || (args.status != null && args.status !== 'SUBMITTED');
}

/** The plain metadata an update writes, or null when it writes none. */
export function paperMetaUpdate(args: PaperUpdateArgs) {
	const update: { title?: string; documentNumber?: string } = {};
	if (args.title != null) update.title = args.title;
	if (args.documentNumber != null) update.documentNumber = args.documentNumber;
	return Object.keys(update).length > 0 ? update : null;
}

/** Refuses a submission whose text has no preamble or no operative clause with content. */
export function assertSubmittable(resolution: Resolution) {
	if (!resolution.preamble.some((c) => c.content.trim().length > 0)) {
		throw new GraphQLError(
			'Paper must have at least one preamble clause with content before submitting'
		);
	}
	if (!resolution.operative.some((c) => !isClauseEmpty(c))) {
		throw new GraphQLError(
			'Paper must have at least one operative clause with content before submitting'
		);
	}
}

/**
 * The number of a new draft resolution: committee, agenda item (its position, first when it is
 * not found) and the count of drafts already on it, e.g. `GA/II/DR.3`.
 */
export function draftResolutionNumber({
	committeeAbbreviation,
	agendaItemIds,
	agendaItemId,
	existingDrafts
}: {
	committeeAbbreviation: string;
	agendaItemIds: string[];
	agendaItemId: string;
	existingDrafts: number;
}) {
	const index = agendaItemIds.indexOf(agendaItemId);
	const position = index >= 0 ? index + 1 : 1;
	return `${committeeAbbreviation}/${toRoman(position)}/DR.${existingDrafts + 1}`;
}

/** How many sponsors a committee asks for, as a share of the delegations present. */
export function requiredSponsors({
	presentDelegations,
	thresholdPercent
}: {
	presentDelegations: number;
	thresholdPercent: number;
}) {
	return Math.ceil(presentDelegations * (thresholdPercent / 100));
}

/** The committee member a chair names for a sponsorship, which they must name. */
export function chairNamedMember({
	committeeMemberId,
	missing
}: {
	committeeMemberId: string | null | undefined;
	missing: string;
}) {
	if (!committeeMemberId) throw new GraphQLError(missing);
	return committeeMemberId;
}
