import { m } from '#lib/paraglide/messages';
import type { PresenceUser } from '@deutschemodelunitednations/munify-resolution-editor';
import type { PresenceUserMeta } from '#lib/api/yjs/createPaperYjs.svelte';
import type { VotingResult } from '#lib/components/voting/votingModal';

interface ReviewItem {
	phase?: string | null;
	triggerAmendment?: { id?: string | null; targetClauseId?: string | null } | null;
}

/**
 * The clauses with an unresolved amendment review, each with the first
 * trigger amendment to open it at.
 */
export function openReviews(items: readonly ReviewItem[]) {
	const clauseIds = new Set<string>();
	const triggerByClause = new Map<string, string>();
	for (const r of items) {
		const clauseId = r.triggerAmendment?.targetClauseId;
		if (r.phase === 'RESOLVED' || !clauseId) continue;
		clauseIds.add(clauseId);
		const triggerId = r.triggerAmendment?.id;
		if (triggerId && !triggerByClause.has(clauseId)) triggerByClause.set(clauseId, triggerId);
	}
	return { clauseIds, triggerByClause };
}

/** How many of the rows name each clause. */
export function countByClause(clauseIds: readonly (string | null | undefined)[]) {
	const counts = new Map<string, number>();
	for (const id of clauseIds) if (id) counts.set(id, (counts.get(id) ?? 0) + 1);
	return counts;
}

/** The submitted amendments with enough sponsors to be debated, counted per target clause. */
export function debatableAmendmentCounts({
	amendments,
	minSponsors
}: {
	amendments: readonly {
		status: string;
		targetClauseId?: string | null;
		sponsors?: readonly unknown[] | null;
	}[];
	minSponsors: number;
}) {
	return countByClause(
		amendments
			.filter((a) => a.status === 'SUBMITTED' && (a.sponsors?.length ?? 0) >= minSponsors)
			.map((a) => a.targetClauseId)
	);
}

/** Who the current user is to their co-editors. */
export function presenceUserOf(user: {
	id?: string | null;
	givenName?: string | null;
	familyName?: string | null;
	email?: string | null;
}): PresenceUser {
	const fullName = [user.givenName, user.familyName].filter(Boolean).join(' ').trim();
	return {
		id: user.id || 'anonymous',
		name: fullName || user.email || 'Anonymous',
		color: undefined
	};
}

/** The identity the current user broadcasts with their presence. */
export function presenceMetaOf(
	conferenceUser:
		| {
				conferenceUserType?: string | null;
				committeeMember?: {
					representation?: {
						name?: string | null;
						alpha2Code?: string | null;
						alpha3Code?: string | null;
					} | null;
				} | null;
		  }
		| undefined
): PresenceUserMeta {
	const representation = conferenceUser?.committeeMember?.representation;
	return {
		conferenceUserType: (conferenceUser?.conferenceUserType ??
			'SPECTATOR') as PresenceUserMeta['conferenceUserType'],
		nationName: representation?.name ?? null,
		alpha2Code: representation?.alpha2Code ?? null,
		alpha3Code: representation?.alpha3Code ?? null
	};
}

/** The committee name to write into a loaded document that has none yet. */
export function committeeNameToSeed({
	persistenceLoaded,
	documentName,
	committee
}: {
	persistenceLoaded: boolean;
	documentName: string | undefined;
	committee: { name?: string | null; abbreviation?: string | null } | undefined;
}): string | null {
	if (!persistenceLoaded || documentName) return null;
	const name = committee?.name ?? committee?.abbreviation;
	return name || null;
}

/** What the "set as current clause" button on a clause shows. */
export function setCurrentButtonState(p: {
	showSetCurrentBtn: boolean;
	isCurrentClause: boolean;
	isNextClause: boolean;
}): 'hidden' | 'next' | 'other' {
	if (!p.showSetCurrentBtn || p.isCurrentClause) return 'hidden';
	return p.isNextClause ? 'next' : 'other';
}

/** The clause vote to link once a new voting session appears; null while there is nothing new. */
export function clauseVoteToLink({
	sessionId,
	clauseId,
	ignoredSessionId
}: {
	sessionId: string | null | undefined;
	clauseId: string | null;
	ignoredSessionId: string | null;
}) {
	if (!sessionId || !clauseId || sessionId === ignoredSessionId) return null;
	return { sessionId, clauseId };
}

/** Whether a finished clause vote rejected the clause, so removing it is suggested. */
export function clauseRejected(result: Pick<VotingResult, 'cancelled' | 'outcome'>) {
	return !result.cancelled && result.outcome === 'REJECTED';
}

/** The edited document number to store, or null when nothing changed. */
export function docNumberToSave({
	draft,
	current
}: {
	draft: string;
	current: string | null | undefined;
}): string | null {
	const trimmed = draft.trim();
	return trimmed && trimmed !== current ? trimmed : null;
}

/**
 * Why the paper cannot become the active draft resolution; mirrors the server
 * rules of setActiveDraftResolution so the chair sees the reason up front.
 */
export function activeDrBlocker({
	isActiveDr,
	paperStatus,
	paperAgendaItemId,
	activeAgendaItemId
}: {
	isActiveDr: boolean;
	paperStatus: string | undefined;
	paperAgendaItemId: string | undefined;
	activeAgendaItemId: string | null | undefined;
}): string | undefined {
	if (isActiveDr) return undefined;
	if (paperStatus === 'WORKING_PAPER') return m.setActiveDrWorkingPaper();
	if (activeAgendaItemId && paperAgendaItemId !== activeAgendaItemId) {
		return m.setActiveDrOtherAgendaItem();
	}
	return undefined;
}

/** Whether a clause has anything to show in its badge row. */
export function hasClauseBadges(c: {
	current: boolean;
	amendmentCount: number;
	commentCount: number;
	outcome: string | null | undefined;
	hasReview: boolean;
}) {
	return c.current || c.amendmentCount > 0 || c.commentCount > 0 || !!c.outcome || c.hasReview;
}

/** A WebLLM model id without its quantisation suffix (e.g. -q4f32_1-MLC), dashes as spaces. */
export function formatModelId(id: string): string {
	return id.replace(/-q\d+f\d+.*$/, '').replaceAll('-', ' ');
}

/** The clauses a clause vote rejected. */
export function rejectedClauseIdsOf(
	votes: readonly { clauseId: string; vote?: { outcome?: string | null } | null }[]
): string[] {
	return votes.filter((v) => v.vote?.outcome === 'REJECTED').map((v) => v.clauseId);
}
