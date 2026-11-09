import { describe, expect, it } from 'vitest';
import {
	activeDrBlocker,
	clauseRejected,
	clauseVoteToLink,
	committeeNameToSeed,
	countByClause,
	debatableAmendmentCounts,
	docNumberToSave,
	formatModelId,
	hasClauseBadges,
	openReviews,
	rejectedClauseIdsOf,
	presenceMetaOf,
	presenceUserOf,
	setCurrentButtonState
} from './paperPageState';

describe('openReviews', () => {
	it('collects unresolved reviews per clause with their first trigger', () => {
		const { clauseIds, triggerByClause } = openReviews([
			{ phase: 'OBSOLESCENCE', triggerAmendment: { id: 't1', targetClauseId: 'c1' } },
			{ phase: 'REWRITE', triggerAmendment: { id: 't2', targetClauseId: 'c1' } },
			{ phase: 'RESOLVED', triggerAmendment: { id: 't3', targetClauseId: 'c2' } },
			{ phase: 'REWRITE', triggerAmendment: { targetClauseId: 'c3' } },
			{ phase: 'REWRITE', triggerAmendment: { id: 't4' } },
			{ phase: 'REWRITE', triggerAmendment: null }
		]);
		expect([...clauseIds]).toEqual(['c1', 'c3']);
		expect([...triggerByClause]).toEqual([['c1', 't1']]);
	});
});

describe('countByClause / debatableAmendmentCounts', () => {
	it('counts rows per clause, skipping rows without one', () => {
		expect([...countByClause(['a', 'b', 'a', null, undefined])]).toEqual([
			['a', 2],
			['b', 1]
		]);
	});

	it('counts only submitted amendments with enough sponsors', () => {
		const counts = debatableAmendmentCounts({
			minSponsors: 2,
			amendments: [
				{ status: 'SUBMITTED', targetClauseId: 'c1', sponsors: [1, 2] },
				{ status: 'SUBMITTED', targetClauseId: 'c1', sponsors: [1] },
				{ status: 'SUBMITTED', targetClauseId: 'c1' },
				{ status: 'PENDING', targetClauseId: 'c1', sponsors: [1, 2] },
				{ status: 'SUBMITTED', targetClauseId: null, sponsors: [1, 2] }
			]
		});
		expect([...counts]).toEqual([['c1', 1]]);
		expect(
			debatableAmendmentCounts({
				minSponsors: 0,
				amendments: [{ status: 'SUBMITTED', targetClauseId: 'c' }]
			}).get('c')
		).toBe(1);
	});
});

describe('presenceUserOf / presenceMetaOf', () => {
	it('names the user by full name, else email', () => {
		expect(presenceUserOf({ id: 'u', givenName: 'Jane', familyName: 'Doe' })).toEqual({
			id: 'u',
			name: 'Jane Doe',
			color: undefined
		});
		expect(presenceUserOf({ id: '', email: 'jane@dmun.de' }).name).toBe('jane@dmun.de');
		expect(presenceUserOf({})).toEqual({ id: 'anonymous', name: 'Anonymous', color: undefined });
	});

	it('broadcasts the user’s representation', () => {
		expect(
			presenceMetaOf({
				conferenceUserType: 'DELEGATE',
				committeeMember: {
					representation: { name: 'Germany', alpha2Code: 'DE', alpha3Code: 'DEU' }
				}
			})
		).toEqual({
			conferenceUserType: 'DELEGATE',
			nationName: 'Germany',
			alpha2Code: 'DE',
			alpha3Code: 'DEU'
		});
		expect(presenceMetaOf(undefined)).toEqual({
			conferenceUserType: 'SPECTATOR',
			nationName: null,
			alpha2Code: null,
			alpha3Code: null
		});
	});
});

describe('committeeNameToSeed', () => {
	const committee = { name: 'General Assembly', abbreviation: 'GA' };

	it('waits for the document and keeps an existing name', () => {
		expect(
			committeeNameToSeed({ persistenceLoaded: false, documentName: '', committee })
		).toBeNull();
		expect(
			committeeNameToSeed({ persistenceLoaded: true, documentName: 'X', committee })
		).toBeNull();
	});

	it('seeds the name, else the abbreviation', () => {
		expect(committeeNameToSeed({ persistenceLoaded: true, documentName: '', committee })).toBe(
			'General Assembly'
		);
		expect(
			committeeNameToSeed({
				persistenceLoaded: true,
				documentName: undefined,
				committee: { name: null, abbreviation: 'GA' }
			})
		).toBe('GA');
		expect(
			committeeNameToSeed({ persistenceLoaded: true, documentName: '', committee: undefined })
		).toBeNull();
	});
});

describe('setCurrentButtonState', () => {
	it('hides the button where it does not apply', () => {
		expect(
			setCurrentButtonState({
				showSetCurrentBtn: false,
				isCurrentClause: false,
				isNextClause: true
			})
		).toBe('hidden');
		expect(
			setCurrentButtonState({ showSetCurrentBtn: true, isCurrentClause: true, isNextClause: false })
		).toBe('hidden');
	});

	it('tells the next clause from out-of-order ones', () => {
		expect(
			setCurrentButtonState({ showSetCurrentBtn: true, isCurrentClause: false, isNextClause: true })
		).toBe('next');
		expect(
			setCurrentButtonState({
				showSetCurrentBtn: true,
				isCurrentClause: false,
				isNextClause: false
			})
		).toBe('other');
	});
});

describe('clauseVoteToLink / clauseRejected', () => {
	it('links only a new session to a pending clause', () => {
		expect(clauseVoteToLink({ sessionId: 's2', clauseId: 'c', ignoredSessionId: 's1' })).toEqual({
			sessionId: 's2',
			clauseId: 'c'
		});
		expect(clauseVoteToLink({ sessionId: 's1', clauseId: 'c', ignoredSessionId: 's1' })).toBeNull();
		expect(clauseVoteToLink({ sessionId: null, clauseId: 'c', ignoredSessionId: null })).toBeNull();
		expect(clauseVoteToLink({ sessionId: 's', clauseId: null, ignoredSessionId: null })).toBeNull();
	});

	it('suggests removal only after a finished rejection', () => {
		expect(clauseRejected({ cancelled: false, outcome: 'REJECTED' })).toBe(true);
		expect(clauseRejected({ cancelled: true, outcome: 'REJECTED' })).toBe(false);
		expect(clauseRejected({ cancelled: false, outcome: 'ADOPTED' })).toBe(false);
	});
});

describe('docNumberToSave', () => {
	it('stores a trimmed, changed number only', () => {
		expect(docNumberToSave({ draft: ' A/1 ', current: null })).toBe('A/1');
		expect(docNumberToSave({ draft: 'A/1', current: 'A/1' })).toBeNull();
		expect(docNumberToSave({ draft: '  ', current: 'A/1' })).toBeNull();
	});
});

describe('activeDrBlocker', () => {
	const base = {
		isActiveDr: false,
		paperStatus: 'DRAFT_RESOLUTION',
		paperAgendaItemId: 'a1',
		activeAgendaItemId: 'a1'
	};

	it('blocks nothing for the active or an eligible paper', () => {
		expect(
			activeDrBlocker({ ...base, isActiveDr: true, paperStatus: 'WORKING_PAPER' })
		).toBeUndefined();
		expect(activeDrBlocker(base)).toBeUndefined();
		expect(activeDrBlocker({ ...base, activeAgendaItemId: null })).toBeUndefined();
	});

	it('blocks working papers and papers of another agenda item', () => {
		expect(activeDrBlocker({ ...base, paperStatus: 'WORKING_PAPER' })).toBeTruthy();
		expect(activeDrBlocker({ ...base, paperAgendaItemId: 'a2' })).toBeTruthy();
	});
});

describe('hasClauseBadges', () => {
	const none = {
		current: false,
		amendmentCount: 0,
		commentCount: 0,
		outcome: null,
		hasReview: false
	};

	it('is false without anything to show', () => {
		expect(hasClauseBadges(none)).toBe(false);
	});

	it('is true with any badge', () => {
		expect(hasClauseBadges({ ...none, current: true })).toBe(true);
		expect(hasClauseBadges({ ...none, amendmentCount: 1 })).toBe(true);
		expect(hasClauseBadges({ ...none, commentCount: 1 })).toBe(true);
		expect(hasClauseBadges({ ...none, outcome: 'ADOPTED' })).toBe(true);
		expect(hasClauseBadges({ ...none, hasReview: true })).toBe(true);
	});
});

describe('formatModelId', () => {
	it('strips the quantisation suffix', () => {
		expect(formatModelId('Llama-3.2-1B-Instruct-q4f32_1-MLC')).toBe('Llama 3.2 1B Instruct');
	});
});

describe('rejectedClauseIdsOf', () => {
	it('lists the clauses whose vote rejected them', () => {
		expect(
			rejectedClauseIdsOf([
				{ clauseId: 'a', vote: { outcome: 'REJECTED' } },
				{ clauseId: 'b', vote: { outcome: 'ADOPTED' } },
				{ clauseId: 'c', vote: null }
			])
		).toEqual(['a']);
	});
});
