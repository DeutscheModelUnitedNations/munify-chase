import { describe, expect, it } from 'vitest';
import { delegationName, resolutionHeaderData } from './resolutionHeader';

describe('delegationName', () => {
	it('translates nations by their code', () => {
		expect(delegationName({ alpha3Code: 'DEU', name: 'Stored' })).not.toBe('Stored');
	});
});

describe('resolutionHeaderData', () => {
	it('is empty without committee and paper', () => {
		expect(resolutionHeaderData({ committee: undefined, paper: undefined })).toEqual({
			conferenceTitle: undefined,
			conferenceEmblem: undefined,
			committeeAbbreviation: undefined,
			committeeFullName: undefined,
			documentNumber: undefined,
			topic: undefined,
			authoringDelegation: 'N/A',
			sponsoringDelegations: [],
			lastEdited: undefined
		});
	});

	it('fills the header from committee and paper', () => {
		const updatedAt = new Date('2026-01-01');
		const header = resolutionHeaderData({
			committee: {
				name: 'General Assembly',
				abbreviation: 'GA',
				conference: { title: 'MUN-SH', logoSvg: '<svg/>' }
			},
			paper: {
				documentNumber: 'A/RES/1',
				updatedAt,
				agendaItem: { title: 'Peace' },
				creatorCommitteeMember: { representation: { alpha3Code: 'DEU' } },
				sponsors: [{ committeeMember: { representation: { alpha3Code: 'FRA' } } }]
			}
		});
		expect(header).toMatchObject({
			conferenceTitle: 'MUN-SH',
			committeeAbbreviation: 'GA',
			committeeFullName: 'General Assembly',
			documentNumber: 'A/RES/1',
			topic: 'Peace',
			lastEdited: updatedAt
		});
		expect(header.conferenceEmblem).toMatch(/^data:image\/svg\+xml,/);
		expect(header.sponsoringDelegations).toHaveLength(1);
	});
});
