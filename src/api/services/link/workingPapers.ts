import {
	ResolutionSchema,
	type Resolution
} from '@deutschemodelunitednations/munify-resolution-editor/schema';
import { committeeMemberId } from './mirror';

/**
 * Which DELEGATOR working papers CHASE keeps as drafts, and what the sync has to do about them
 * (`docs/plans/delegator-link.md`). Pure, so it is unit tested. A paper goes across with its
 * latest accepted version, written by its delegation's seat in its agenda item's committee; one
 * without an agenda item, a seat there or a readable text stays behind. A draft follows DELEGATOR's newer versions
 * until CHASE changed it (`detachedAt`), and goes when DELEGATOR no longer has the paper, unless
 * CHASE changed it.
 */

export interface DelegatorWorkingPaper {
	id: string;
	agendaItem?: { id: string; committeeId: string } | null;
	delegation: { assignedRoleId?: string | null };
	/** Only the accepted versions: the link reads no others. */
	versions: readonly { id: string; version: number }[];
}

export interface ExistingDraft {
	id: string;
	delegatorPaperId: string;
	delegatorVersion: number | null;
	detachedAt: Date | null;
}

/** A paper whose latest version goes across: a new draft, or the text of `draftId`. */
export interface PaperToTakeOver {
	delegatorPaperId: string;
	versionId: string;
	version: number;
	committeeId: string;
	agendaItemId: string;
	creatorCommitteeMemberId: string;
	draftId?: string;
}

export type LeftBehind = {
	paperId: string;
	reason: 'noAgendaItem' | 'noSeat' | 'noVersion' | 'unreadable';
};

function target({
	paper,
	seats
}: {
	paper: DelegatorWorkingPaper;
	seats: ReadonlySet<string>;
}): Omit<PaperToTakeOver, 'draftId'> | LeftBehind {
	const agendaItem = paper.agendaItem;
	if (!agendaItem) return { paperId: paper.id, reason: 'noAgendaItem' };
	const roleId = paper.delegation.assignedRoleId;
	const seat = roleId && committeeMemberId({ roleId, committeeId: agendaItem.committeeId });
	if (!seat || !seats.has(seat)) return { paperId: paper.id, reason: 'noSeat' };
	const latest = paper.versions.toSorted((a, b) => b.version - a.version)[0];
	if (!latest) return { paperId: paper.id, reason: 'noVersion' };
	return {
		delegatorPaperId: paper.id,
		versionId: latest.id,
		version: latest.version,
		committeeId: agendaItem.committeeId,
		agendaItemId: agendaItem.id,
		creatorCommitteeMemberId: seat
	};
}

/**
 * What the sync has to do, decided by version numbers alone: the texts are read only for the papers
 * that go across (`takeOver`), and checked then (`readableResolution`).
 */
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
	const results = papers.map((paper) => target({ paper, seats }));
	const targets = results.filter((result) => 'versionId' in result);
	const leftBehind = results.filter((result) => 'reason' in result);
	const drafts = new Map(existing.map((draft) => [draft.delegatorPaperId, draft]));
	const present = new Set(targets.map((paper) => paper.delegatorPaperId));

	return {
		takeOver: targets.flatMap((paper): PaperToTakeOver[] => {
			const draft = drafts.get(paper.delegatorPaperId);
			if (!draft) return [paper];
			if (draft.detachedAt || (draft.delegatorVersion ?? 0) >= paper.version) return [];
			return [{ ...paper, draftId: draft.id }];
		}),
		remove: existing
			.filter((draft) => !draft.detachedAt && !present.has(draft.delegatorPaperId))
			.map((draft) => draft.id),
		leftBehind
	};
}

/** A version's text, when it is a resolution this editor can hold. */
export function readableResolution(content: unknown): Resolution | undefined {
	const parsed = ResolutionSchema.safeParse(content);
	return parsed.success ? parsed.data : undefined;
}
