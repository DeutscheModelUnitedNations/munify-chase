import { describe, expect, it } from 'vitest';
import {
	PAPER_STATUS_ORDER,
	amendmentStatusBadgeClass,
	amendmentStatusLabel,
	amendmentTypeLabel,
	canEditPaper,
	errorMessage,
	isTeam,
	statusBadgeClass,
	statusLabel,
	toAmendmentOverlays,
	type AmendmentStatus,
	type AmendmentType,
	type ResolutionViewer
} from './paperContext';

const viewer = (type: ResolutionViewer['type']): ResolutionViewer => ({
	userId: 'u',
	conferenceUserId: 'cu',
	type
});

describe('labels and badges', () => {
	it('names and colours every paper status', () => {
		for (const status of PAPER_STATUS_ORDER) {
			expect(statusLabel(status)).toBeTruthy();
			expect(statusBadgeClass(status)).toMatch(/^badge-/);
		}
		expect(statusBadgeClass('FINAL')).toBe('badge-success');
	});

	it('names every amendment type', () => {
		const types: AmendmentType[] = ['DELETE', 'ADD', 'ALTER_TEXT', 'ALTER_POSITION'];
		expect(new Set(types.map(amendmentTypeLabel)).size).toBe(4);
	});

	it('names and colours every amendment status', () => {
		const statuses: AmendmentStatus[] = [
			'PENDING',
			'SUBMITTED',
			'CONSENSUS_ADOPTED',
			'ACCEPTED',
			'REJECTED',
			'WITHDRAWN'
		];
		expect(new Set(statuses.map(amendmentStatusLabel)).size).toBe(6);
		expect(statuses.map(amendmentStatusBadgeClass)).toEqual([
			'badge-ghost',
			'badge-info',
			'badge-success',
			'badge-success',
			'badge-error',
			'badge-error'
		]);
	});
});

describe('isTeam / canEditPaper', () => {
	it('treats admins and team as team', () => {
		expect(isTeam(viewer('ADMIN'))).toBe(true);
		expect(isTeam(viewer('TEAM'))).toBe(true);
		expect(isTeam(viewer('DELEGATE'))).toBe(false);
	});

	it('locks final papers for everyone', () => {
		expect(canEditPaper('FINAL', viewer('ADMIN'), { isCreatorOrEditor: true })).toBe(false);
	});

	it('lets the team edit at any other stage', () => {
		expect(canEditPaper('VOTING_PHASE', viewer('TEAM'), { isCreatorOrEditor: false })).toBe(true);
	});

	it('lets delegates edit only their own working paper', () => {
		const delegate = viewer('DELEGATE');
		expect(canEditPaper('WORKING_PAPER', delegate, { isCreatorOrEditor: true })).toBe(true);
		expect(canEditPaper('WORKING_PAPER', delegate, { isCreatorOrEditor: false })).toBe(false);
		expect(canEditPaper('SUBMITTED', delegate, { isCreatorOrEditor: true })).toBe(false);
	});
});

describe('toAmendmentOverlays', () => {
	const markup = 'Decides to deploy observers;';

	it('parses the proposed clause of ADD and ALTER_TEXT rows', () => {
		const [overlay] = toAmendmentOverlays([
			{ id: 'a', type: 'ADD', status: 'SUBMITTED', newContent: markup, targetPosition: 2 }
		]);
		expect(overlay.newContent?.blocks.length).toBeGreaterThan(0);
		expect(overlay.targetPosition).toBe(2);
		expect(overlay.targetClauseId).toBeUndefined();
		expect(overlay.sponsorCount).toBe(0);
	});

	it('drops rows whose markup does not parse', () => {
		expect(
			toAmendmentOverlays([
				{ id: 'a', type: 'ALTER_TEXT', status: 'SUBMITTED', newContent: 'chapeau\n--> orphan;' }
			])
		).toEqual([]);
	});

	it('ignores content on DELETE rows and counts sponsors', () => {
		const [overlay] = toAmendmentOverlays([
			{
				id: 'd',
				type: 'DELETE',
				status: 'SUBMITTED',
				newContent: markup,
				targetClauseId: 'c1',
				sponsors: [{ id: 's1' }, { id: 's2' }]
			}
		]);
		expect(overlay.newContent).toBeUndefined();
		expect(overlay.targetClauseId).toBe('c1');
		expect(overlay.sponsorCount).toBe(2);
	});

	it('names the proposer with a flag when it has one', () => {
		const names = toAmendmentOverlays([
			{
				id: '1',
				type: 'DELETE',
				status: 'SUBMITTED',
				proposer: { representation: { name: 'Germany', alpha2Code: 'de' } }
			},
			{
				id: '2',
				type: 'DELETE',
				status: 'SUBMITTED',
				proposer: { representation: { name: 'WHO' } }
			},
			{ id: '3', type: 'DELETE', status: 'SUBMITTED', proposer: { representation: {} } }
		]).map((o) => o.proposerName);
		expect(names).toEqual(['🇩🇪 Germany', 'WHO', undefined]);
	});
});

describe('errorMessage', () => {
	it('prefers the error message', () => {
		expect(errorMessage(new Error('boom'), 'fallback')).toBe('boom');
		expect(errorMessage('nope', 'fallback')).toBe('fallback');
	});
});
