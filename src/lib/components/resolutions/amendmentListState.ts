import { m } from '#lib/paraglide/messages';
import {
	amendmentStatusBadgeClass,
	amendmentStatusLabel,
	amendmentTypeLabel,
	type AmendmentStatus,
	type AmendmentType
} from './paperContext';

interface ReviewItemRow {
	phase?: string | null;
	triggerAmendment?: { id: string; targetClauseId?: string | null } | null;
	subjectAmendment?: {
		status?: string | null;
		type?: string | null;
		targetClauseId?: string | null;
	} | null;
}

/** An unresolved review item still waiting on the chair: a submitted text change. */
function awaitsReview(item: ReviewItemRow): boolean {
	return (
		item.phase !== 'RESOLVED' &&
		item.subjectAmendment?.status === 'SUBMITTED' &&
		item.subjectAmendment?.type === 'ALTER_TEXT'
	);
}

/**
 * Whether both the trigger and the subject target `clauseId`: the banner shows
 * only on the clause the trigger changed, and a subject elsewhere is stale data.
 */
function onClause(item: ReviewItemRow, clauseId: string | null): boolean {
	return (
		(item.triggerAmendment?.targetClauseId ?? null) === clauseId &&
		(item.subjectAmendment?.targetClauseId ?? null) === clauseId
	);
}

/** Unresolved review items on the selected clause, grouped by the amendment that triggered them. */
export function groupPendingReviews<T extends ReviewItemRow>({
	items,
	clauseId
}: {
	items: readonly T[] | null | undefined;
	clauseId: string | null;
}): { triggerId: string; items: T[]; trigger: T['triggerAmendment'] }[] {
	const groups = new Map<string, T[]>();
	for (const item of items ?? []) {
		const key = item.triggerAmendment?.id;
		if (!key || !awaitsReview(item) || !onClause(item, clauseId)) continue;
		groups.set(key, [...(groups.get(key) ?? []), item]);
	}
	return [...groups.entries()].map(([triggerId, grouped]) => ({
		triggerId,
		items: grouped,
		trigger: grouped[0]?.triggerAmendment
	}));
}

const PROCESSED: readonly string[] = ['CONSENSUS_ADOPTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'];

/** Sort weight: 0 = active/submitted, 1 = processed, 2 = pending draft (not yet submitted). */
function sortTier(status: string | null | undefined): number {
	if (status === 'PENDING') return 2;
	return PROCESSED.includes(status ?? '') ? 1 : 0;
}

// DELETE first (renders others obsolete), then ALTER_TEXT, then ADD, then ALTER_POSITION.
const TYPE_PRIORITY: readonly string[] = ['DELETE', 'ALTER_TEXT', 'ADD', 'ALTER_POSITION'];

function typePriority(type: string | null | undefined): number {
	const index = TYPE_PRIORITY.indexOf(type ?? '');
	return index === -1 ? TYPE_PRIORITY.length : index;
}

interface ListedAmendment {
	id: string;
	type?: string | null;
	status?: string | null;
	targetClauseId?: string | null;
	createdAt: string | number | Date;
}

/** Within ALTER_TEXT: the AI impact rank, when there is one. */
function rankDifference({
	a,
	b,
	ranks
}: {
	a: ListedAmendment;
	b: ListedAmendment;
	ranks: ReadonlyMap<string, number>;
}): number {
	if (a.type !== 'ALTER_TEXT' || ranks.size === 0) return 0;
	const aRank = ranks.get(a.id) ?? Infinity;
	const bRank = ranks.get(b.id) ?? Infinity;
	return aRank === bRank ? 0 : aRank - bRank;
}

/**
 * The amendments shown for a selection: those on the selected clause, or the
 * document-level ones (ADD targets a position, not a clause) without one.
 * Active ones first by type, AI rank and age; processed and pending ones keep
 * their submission order below.
 */
export function scopeAmendments<T extends ListedAmendment>({
	amendments,
	clauseId,
	ranks
}: {
	amendments: readonly T[] | null | undefined;
	clauseId: string | null;
	ranks: ReadonlyMap<string, number>;
}): T[] {
	const list = amendments ?? [];
	const filtered = clauseId
		? list.filter((a) => a.targetClauseId === clauseId)
		: list.filter((a) => !a.targetClauseId);
	return filtered.slice().sort((a, b) => {
		const tierDiff = sortTier(a.status) - sortTier(b.status);
		if (tierDiff !== 0 || sortTier(a.status) !== 0) return tierDiff;
		const typeDiff = typePriority(a.type) - typePriority(b.type);
		if (typeDiff !== 0) return typeDiff;
		const rankDiff = rankDifference({ a, b, ranks });
		if (rankDiff !== 0) return rankDiff;
		return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
	});
}

/** Ranks by position in the list the AI returned. */
export function rankMap(rankedIds: readonly string[]): Map<string, number> {
	return new Map(rankedIds.map((id, i) => [id, i]));
}

/** Whether sorting by impact can start: idle, at least two text changes, and AI not switched off. */
export function canRankByImpact({
	busy,
	candidates,
	preference
}: {
	busy: boolean;
	candidates: number;
	preference: string;
}): boolean {
	return !busy && candidates >= 2 && preference !== 'off';
}

interface SummarizedAmendment {
	type?: string | null;
	targetOperativeIndex?: number | null;
	targetPosition?: number | null;
	newContent?: string | null;
}

/** A short, human-readable summary of what applying the amendment will do. */
export function changeSummary(a: SummarizedAmendment): { headline: string; body?: string | null } {
	const clauseRef =
		a.targetOperativeIndex != null
			? ` – ${m.operativeClausePresentation()} ${a.targetOperativeIndex + 1}`
			: '';
	const position = (a.targetPosition ?? 0) + 1;
	switch (a.type) {
		case 'DELETE':
			return { headline: `${m.deleteClausePresentation()}${clauseRef}` };
		case 'ALTER_TEXT':
			return { headline: `${m.alterClausePresentation()}${clauseRef}`, body: a.newContent };
		case 'ADD':
			return {
				headline: `${m.addClausePresentation()} – ${m.insertAfterPresentation({ index: position })}`,
				body: a.newContent
			};
		case 'ALTER_POSITION':
			return {
				headline: `${m.moveClausePresentation()} – ${m.moveToPositionPresentation({ position })}`
			};
		default:
			return { headline: typeLabel(a.type) };
	}
}

/** The vote's name: the document number and the type, or the type alone. */
export function amendmentVoteName(a: { type?: string | null; documentNumber?: string | null }) {
	const label = typeLabel(a.type);
	return a.documentNumber ? `${a.documentNumber} – ${label}` : label;
}

export type DecisionKind = 'accept' | 'consensus' | 'reject';

export function decisionMessage(kind: DecisionKind): string {
	if (kind === 'accept') return m.confirmAcceptAmendment();
	if (kind === 'consensus') return m.confirmAdoptByConsensus();
	return m.confirmRejectAmendment();
}

const TYPE_ICONS: Record<string, string> = {
	ADD: 'plus',
	DELETE: 'trash',
	ALTER_TEXT: 'pen',
	ALTER_POSITION: 'arrows-down-up'
};

/** The Phosphor icon of an amendment type, or null for an unknown one. */
export function amendmentTypeIcon(type: string | null | undefined): string | null {
	return TYPE_ICONS[type ?? ''] ?? null;
}

const STATUSES: readonly string[] = ['PENDING', 'SUBMITTED', ...PROCESSED];

function isAmendmentStatus(status: string | null | undefined): status is AmendmentStatus {
	return STATUSES.includes(status ?? '');
}

function isAmendmentType(type: string | null | undefined): type is AmendmentType {
	return TYPE_PRIORITY.includes(type ?? '');
}

/** The translated label of an amendment type as the API types it (a plain string). */
export function typeLabel(type: string | null | undefined): string {
	return isAmendmentType(type) ? amendmentTypeLabel(type) : (type ?? '');
}

/** Label and badge class of an amendment status as the API types it (a plain string). */
export function statusBadge(status: string | null | undefined): { label: string; cls: string } {
	if (!isAmendmentStatus(status)) return { label: status ?? '', cls: '' };
	return { label: amendmentStatusLabel(status), cls: amendmentStatusBadgeClass(status) };
}
