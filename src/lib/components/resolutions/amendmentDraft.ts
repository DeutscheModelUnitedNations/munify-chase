import { m } from '#lib/paraglide/messages';
import { parseClauseFragment } from '@deutschemodelunitednations/munify-resolution-editor/res-markup';
import type { AmendmentType } from './paperContext';

/** Which parts of the composer an amendment type asks for. */
export function amendmentNeeds(type: AmendmentType) {
	return {
		content: type === 'ADD' || type === 'ALTER_TEXT',
		position: type === 'ADD' || type === 'ALTER_POSITION',
		targetClause: type !== 'ADD'
	};
}

/** The RES-Markup error codes of a typed clause, or null while it is empty or valid. */
export function markupError(content: string): string | null {
	if (!content.trim()) return null;
	const parsed = parseClauseFragment(content);
	return parsed.valid ? null : parsed.errors.map((e) => e.code).join(', ');
}

export interface AmendmentDraft {
	type: AmendmentType;
	/** The chair proposes on behalf of a delegation, which they have to pick. */
	team: boolean;
	proposerId: string | null;
	targetClauseId: string | null;
	targetClauseIndex: number;
	newContent: string;
	contentError: string | null;
	/** -1 inserts at the beginning, n after the clause at index n. */
	targetPosition: number | null;
	/** The target clause's text, which an ALTER_TEXT has to differ from. */
	oldMarkup: string;
}

/** The first thing keeping the draft from being sent, as the message to show, or null. */
export function draftProblem(draft: AmendmentDraft): string | null {
	const needs = amendmentNeeds(draft.type);
	if (draft.team && !draft.proposerId) return m.selectProposerDelegation();
	if (needs.targetClause && !draft.targetClauseId) return m.selectClauseFirst();
	if (needs.content && (!draft.newContent.trim() || draft.contentError)) {
		return m.amendmentContentInvalid();
	}
	return null;
}

/** Whether the submit button is enabled: nothing missing and something actually changes. */
export function canSubmitDraft(draft: AmendmentDraft): boolean {
	if (draftProblem(draft) !== null) return false;
	if (amendmentNeeds(draft.type).position && draft.targetPosition === null) return false;
	return draft.type !== 'ALTER_TEXT' || draft.newContent !== draft.oldMarkup;
}

/** The `createAmendment` arguments for a draft, leaving out what its type does not use. */
export function createAmendmentArgs({
	id,
	paperId,
	draft
}: {
	id: string;
	paperId: string;
	draft: AmendmentDraft;
}) {
	const needs = amendmentNeeds(draft.type);
	return {
		id,
		paperId,
		type: draft.type,
		targetClauseId: needs.targetClause ? (draft.targetClauseId ?? undefined) : undefined,
		targetOperativeIndex:
			needs.targetClause && draft.targetClauseIndex >= 0 ? draft.targetClauseIndex : undefined,
		newContent: needs.content ? draft.newContent : undefined,
		targetPosition: needs.position ? (draft.targetPosition ?? -1) : undefined,
		proposerCommitteeMemberId: draft.team ? (draft.proposerId ?? undefined) : undefined
	};
}

/**
 * Whether a failed mutation was only queued for offline sync: its optimistic
 * update is already visible, so the composer treats it as sent.
 */
export function isQueuedOffline(err: unknown): boolean {
	return typeof err === 'object' && err !== null && 'networkError' in err && !!err.networkError;
}

/** The chosen insert position as a marker and a sentence, `preview` being the clause it follows. */
export function positionSummary({
	position,
	preview
}: {
	position: number;
	preview: string | null;
}): { marker: string; text: string } {
	if (position === -1) return { marker: '↑', text: m.insertAtBeginning() };
	const marker = `${position + 1}.`;
	if (preview === null) return { marker, text: m.insertAtBeginning() };
	return {
		marker,
		text: m.insertAfterPresentation({ index: String(position + 1) }) + ' — ' + preview
	};
}
