import { describe, expect, test } from 'vitest';
import type { Resolution } from '@deutschemodelunitednations/munify-resolution-editor/schema';
import {
	assertMayCommentWith,
	chairNamedMember,
	assertSponsoringOpen,
	assertSubmittable,
	draftResolutionNumber,
	needsChairCheck,
	paperMetaUpdate,
	requiredSponsors
} from './paperRules';

describe('assertSponsoringOpen', () => {
	test('lets sponsors change up to the draft resolution', () => {
		for (const status of ['WORKING_PAPER', 'SUBMITTED', 'DRAFT_RESOLUTION'] as const) {
			expect(() => assertSponsoringOpen(status)).not.toThrow();
		}
	});

	test('refuses once amendments or the vote started', () => {
		for (const status of ['AMENDMENT_PHASE', 'VOTING_PHASE', 'FINAL'] as const) {
			expect(() => assertSponsoringOpen(status)).toThrow('Sponsoring is not open');
		}
	});
});

describe('assertMayCommentWith', () => {
	test('anyone may comment publicly', () => {
		expect(() =>
			assertMayCommentWith({ visibility: 'PUBLIC', authorType: 'DELEGATE' })
		).not.toThrow();
	});

	test('only the team comments for the team', () => {
		expect(() =>
			assertMayCommentWith({ visibility: 'TEAM_ONLY', authorType: 'TEAM' })
		).not.toThrow();
		expect(() =>
			assertMayCommentWith({ visibility: 'TEAM_ONLY', authorType: 'ADMIN' })
		).not.toThrow();
		expect(() => assertMayCommentWith({ visibility: 'TEAM_ONLY', authorType: 'DELEGATE' })).toThrow(
			'Only chairs'
		);
	});
});

describe('needsChairCheck', () => {
	test('a title or a submission is anybody’s', () => {
		expect(needsChairCheck({ title: 'x' })).toBe(false);
		expect(needsChairCheck({ status: 'SUBMITTED' })).toBe(false);
	});

	test('a document number or any other status is the chair’s', () => {
		expect(needsChairCheck({ documentNumber: 'GA/I/DR.1' })).toBe(true);
		expect(needsChairCheck({ status: 'FINAL' })).toBe(true);
	});
});

describe('paperMetaUpdate', () => {
	test('writes only what is given', () => {
		expect(paperMetaUpdate({ title: 'T' })).toEqual({ title: 'T' });
		expect(paperMetaUpdate({ title: 'T', documentNumber: 'N' })).toEqual({
			title: 'T',
			documentNumber: 'N'
		});
	});

	test('answers null when nothing is given', () => {
		expect(paperMetaUpdate({ title: null, status: 'FINAL' })).toBeNull();
	});
});

describe('assertSubmittable', () => {
	const preamble: Resolution['preamble'] = [{ id: 'p', content: 'Recalling' }];
	const operative: Resolution['operative'] = [
		{ id: 'o', blocks: [{ type: 'text', id: 't', content: 'Decides' }] }
	];

	test('accepts a paper with both parts', () => {
		expect(() => assertSubmittable({ committeeName: '', preamble, operative })).not.toThrow();
	});

	test('asks for a preamble clause with content', () => {
		expect(() =>
			assertSubmittable({ committeeName: '', preamble: [{ id: 'p', content: '  ' }], operative })
		).toThrow('preamble');
	});

	test('asks for an operative clause with content', () => {
		expect(() => assertSubmittable({ committeeName: '', preamble, operative: [] })).toThrow(
			'operative'
		);
	});
});

describe('draftResolutionNumber', () => {
	test('numbers by agenda item position and drafts so far', () => {
		expect(
			draftResolutionNumber({
				committeeAbbreviation: 'GA',
				agendaItemIds: ['a', 'b'],
				agendaItemId: 'b',
				existingDrafts: 2
			})
		).toBe('GA/II/DR.3');
	});

	test('counts an unknown agenda item as the first', () => {
		expect(
			draftResolutionNumber({
				committeeAbbreviation: 'SC',
				agendaItemIds: [],
				agendaItemId: 'x',
				existingDrafts: 0
			})
		).toBe('SC/I/DR.1');
	});
});

describe('requiredSponsors', () => {
	test('rounds the share of present delegations up', () => {
		expect(requiredSponsors({ presentDelegations: 10, thresholdPercent: 25 })).toBe(3);
		expect(requiredSponsors({ presentDelegations: 0, thresholdPercent: 25 })).toBe(0);
	});
});

describe('chairNamedMember', () => {
	test('answers the named member', () => {
		expect(chairNamedMember({ committeeMemberId: 'm', missing: 'name one' })).toBe('m');
	});

	test('refuses without one', () => {
		expect(() => chairNamedMember({ committeeMemberId: null, missing: 'name one' })).toThrow(
			'name one'
		);
	});
});
