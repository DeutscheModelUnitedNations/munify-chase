import { m } from '$lib/paraglide/messages';
import { parseClauseFragment } from '@deutschemodelunitednations/munify-resolution-editor/res-markup';
import type { AmendmentOverlay } from '@deutschemodelunitednations/munify-resolution-editor';

export type PaperStatus =
	| 'WORKING_PAPER'
	| 'SUBMITTED'
	| 'DRAFT_RESOLUTION'
	| 'AMENDMENT_PHASE'
	| 'VOTING_PHASE'
	| 'FINAL';

export type AmendmentType = 'DELETE' | 'ADD' | 'ALTER_TEXT' | 'ALTER_POSITION';
export type AmendmentStatus =
	| 'PENDING'
	| 'SUBMITTED'
	| 'CONSENSUS_ADOPTED'
	| 'ACCEPTED'
	| 'REJECTED'
	| 'WITHDRAWN';

export type ConferenceUserType = 'ADMIN' | 'TEAM' | 'DELEGATE' | 'NON_STATE_ACTOR' | 'SPECTATOR';

/** The acting user's identity within the conference, resolved once per page. */
export interface ResolutionViewer {
	userId: string;
	conferenceUserId: string;
	type: ConferenceUserType;
	committeeMemberId?: string | null;
}

export function isTeam(viewer: ResolutionViewer): boolean {
	return viewer.type === 'ADMIN' || viewer.type === 'TEAM';
}

/** Lifecycle order, used by the chair status stepper. */
export const PAPER_STATUS_ORDER: PaperStatus[] = [
	'WORKING_PAPER',
	'SUBMITTED',
	'DRAFT_RESOLUTION',
	'AMENDMENT_PHASE',
	'VOTING_PHASE',
	'FINAL'
];

export function statusLabel(status: PaperStatus): string {
	switch (status) {
		case 'WORKING_PAPER':
			return m.workingPaper();
		case 'SUBMITTED':
			return m.submittedPapers();
		case 'DRAFT_RESOLUTION':
			return m.draftResolutions();
		case 'AMENDMENT_PHASE':
			return m.amendmentPhase();
		case 'VOTING_PHASE':
			return m.voting();
		case 'FINAL':
			return m.final();
	}
}

export function statusBadgeClass(status: PaperStatus): string {
	switch (status) {
		case 'WORKING_PAPER':
			return 'badge-ghost';
		case 'SUBMITTED':
			return 'badge-info';
		case 'DRAFT_RESOLUTION':
			return 'badge-primary';
		case 'AMENDMENT_PHASE':
			return 'badge-warning';
		case 'VOTING_PHASE':
			return 'badge-secondary';
		case 'FINAL':
			return 'badge-success';
	}
}

export function amendmentTypeLabel(type: AmendmentType): string {
	switch (type) {
		case 'DELETE':
			return m.amendmentTypeDelete();
		case 'ADD':
			return m.amendmentTypeAdd();
		case 'ALTER_TEXT':
			return m.amendmentTypeAlterText();
		case 'ALTER_POSITION':
			return m.amendmentTypeAlterPosition();
	}
}

export function amendmentStatusLabel(status: AmendmentStatus): string {
	switch (status) {
		case 'PENDING':
			return m.amendmentStatusPending();
		case 'SUBMITTED':
			return m.amendmentStatusSubmitted();
		case 'CONSENSUS_ADOPTED':
			return m.amendmentStatusConsensusAdopted();
		case 'ACCEPTED':
			return m.amendmentStatusAccepted();
		case 'REJECTED':
			return m.amendmentStatusRejected();
		case 'WITHDRAWN':
			return m.amendmentStatusWithdrawn();
	}
}

export function amendmentStatusBadgeClass(status: AmendmentStatus): string {
	switch (status) {
		case 'PENDING':
			return 'badge-ghost';
		case 'SUBMITTED':
			return 'badge-info';
		case 'CONSENSUS_ADOPTED':
		case 'ACCEPTED':
			return 'badge-success';
		case 'REJECTED':
		case 'WITHDRAWN':
			return 'badge-error';
	}
}

/**
 * Whether the viewer may edit the paper body given its lifecycle status.
 * Mirrors the server ability rules closely enough to drive the UI; the
 * server stays authoritative.
 */
export function canEditPaper(
	status: PaperStatus,
	viewer: ResolutionViewer,
	opts: { isCreatorOrEditor: boolean }
): boolean {
	if (status === 'FINAL') return false;
	if (isTeam(viewer)) return true;
	// Delegates/NSAs may only edit a working paper they own or co-edit.
	return status === 'WORKING_PAPER' && opts.isCreatorOrEditor;
}

/** Shape of an amendment row as queried for overlay building (loose: the
 * generated client types enum columns as plain strings). */
export interface AmendmentRow {
	id: string;
	type: string;
	status: string;
	targetClauseId?: string | null;
	targetOperativeIndex?: number | null;
	targetPosition?: number | null;
	newContent?: string | null;
	proposer?: { representation?: { name?: string | null } | null } | null;
	sponsors?: { id: string }[];
}

/**
 * Map DB amendment rows to the editor library's AmendmentOverlay shape.
 * ADD / ALTER_TEXT carry RES-Markup which we parse into an OperativeClause;
 * rows that fail to parse are dropped from the overlay (the side panel still
 * lists them textually).
 */
export function toAmendmentOverlays(rows: readonly AmendmentRow[]): AmendmentOverlay[] {
	const overlays: AmendmentOverlay[] = [];
	for (const r of rows) {
		let newContent;
		if ((r.type === 'ADD' || r.type === 'ALTER_TEXT') && r.newContent) {
			const parsed = parseClauseFragment(r.newContent);
			if (!parsed.valid) continue;
			newContent = parsed.clause;
		}
		overlays.push({
			id: r.id,
			type: r.type as AmendmentOverlay['type'],
			status: r.status as AmendmentOverlay['status'],
			targetClauseId: r.targetClauseId ?? undefined,
			targetOperativeIndex: r.targetOperativeIndex ?? undefined,
			targetPosition: r.targetPosition ?? undefined,
			newContent,
			proposerName: r.proposer?.representation?.name ?? undefined,
			sponsorCount: r.sponsors?.length ?? 0
		});
	}
	return overlays;
}
