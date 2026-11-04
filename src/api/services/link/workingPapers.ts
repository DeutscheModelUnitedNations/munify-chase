import {
	ResolutionSchema,
	type Resolution
} from '@deutschemodelunitednations/munify-resolution-editor/schema';
import { committeeMemberId } from './mirror';

/**
 * Which DELEGATOR working papers CHASE keeps as drafts, and what the sync has to do about them
 * (`docs/plans/delegator-link.md`). Pure, so it is unit tested. A paper goes across with its
 * latest accepted version, written by its delegation's seat in its agenda item's committee; one
 * without an agenda item or a seat there stays behind. A draft follows DELEGATOR's newer versions
 * until CHASE changed it (`detachedAt`), and goes when DELEGATOR no longer has the paper, unless
 * CHASE changed it.
 */

export interface DelegatorWorkingPaper {
	id: string;
	agendaItem?: { id: string; committeeId: string } | null;
	delegation: { assignedRoleId?: string | null };
	/** Only the accepted versions: the link reads no others. */
	versions: readonly { version: number; content: unknown }[];
}

export interface ExistingDraft {
	id: string;
	delegatorPaperId: string;
	delegatorVersion: number | null;
	detachedAt: Date | null;
}

export interface TakenOverPaper {
	delegatorPaperId: string;
	version: number;
	content: Resolution;
	committeeId: string;
	agendaItemId: string;
	creatorCommitteeMemberId: string;
}

export type LeftBehind = { paperId: string; reason: 'noAgendaItem' | 'noSeat' | 'unreadable' };

function takeOver({
	paper,
	seats
}: {
	paper: DelegatorWorkingPaper;
	seats: ReadonlySet<string>;
}): TakenOverPaper | LeftBehind {
	const agendaItem = paper.agendaItem;
	if (!agendaItem) return { paperId: paper.id, reason: 'noAgendaItem' };
	const roleId = paper.delegation.assignedRoleId;
	const seat = roleId && committeeMemberId({ roleId, committeeId: agendaItem.committeeId });
	if (!seat || !seats.has(seat)) return { paperId: paper.id, reason: 'noSeat' };
	const latest = paper.versions.toSorted((a, b) => b.version - a.version)[0];
	const content = latest && ResolutionSchema.safeParse(latest.content);
	if (!latest || !content?.success) return { paperId: paper.id, reason: 'unreadable' };
	return {
		delegatorPaperId: paper.id,
		version: latest.version,
		content: content.data,
		committeeId: agendaItem.committeeId,
		agendaItemId: agendaItem.id,
		creatorCommitteeMemberId: seat
	};
}

export function workingPaperChanges({
	papers,
	existing,
	seats
}: {
	papers: readonly DelegatorWorkingPaper[];
	existing: readonly ExistingDraft[];
	/** The committee member ids of the conference's seats. */
	seats: ReadonlySet<string>;
}) {
	const results = papers.map((paper) => takeOver({ paper, seats }));
	const takenOver = results.filter((result): result is TakenOverPaper => 'content' in result);
	const leftBehind = results.filter((result): result is LeftBehind => 'reason' in result);
	const drafts = new Map(existing.map((draft) => [draft.delegatorPaperId, draft]));
	const present = new Set(takenOver.map((paper) => paper.delegatorPaperId));

	return {
		create: takenOver.filter((paper) => !drafts.has(paper.delegatorPaperId)),
		update: takenOver.flatMap((paper) => {
			const draft = drafts.get(paper.delegatorPaperId);
			if (!draft || draft.detachedAt || (draft.delegatorVersion ?? 0) >= paper.version) return [];
			return [{ ...paper, draftId: draft.id }];
		}),
		remove: existing
			.filter((draft) => !draft.detachedAt && !present.has(draft.delegatorPaperId))
			.map((draft) => draft.id),
		leftBehind
	};
}
