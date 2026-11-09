import { describe, expect, it } from 'vitest';
import { importRows, speakersListsOf } from './importRows';

const base = {
	id: 'conf',
	title: 'Conf',
	committees: [{ id: 'c', name: 'General Assembly', abbreviation: 'GA' }],
	representations: [
		{ id: 'r', representationType: 'DELEGATION' as const, alpha2Code: 'de', alpha3Code: 'deu' }
	],
	conferenceMembers: [{ id: 'cm', representationId: 'r' }],
	committeeMembers: [{ id: 'm', representationId: 'r', committeeId: 'c' }],
	agendaItems: [{ committeeId: 'c', title: 'Climate' }]
};

describe('importRows', () => {
	it('anchors every row in the conference', () => {
		const rows = importRows({ data: base, creatorEmail: 'a@x' });
		expect(rows.conference).toMatchObject({ id: 'conf', title: 'Conf' });
		expect(rows.committees).toEqual([
			{ id: 'c', name: 'General Assembly', abbreviation: 'GA', conferenceId: 'conf' }
		]);
		expect(rows.representations[0]).toMatchObject({ type: 'DELEGATION', conferenceId: 'conf' });
		expect(rows.conferenceMembers).toEqual([
			{ id: 'cm', conferenceId: 'conf', representationId: 'r' }
		]);
		expect(rows.committeeMembers).toEqual([{ id: 'm', committeeId: 'c', representationId: 'r' }]);
		expect(rows.agendaItems).toEqual([
			{ id: undefined, committeeId: 'c', title: 'Climate', conferenceId: 'conf' }
		]);
		expect(rows.requestTypes).toEqual([]);
	});

	it('makes the importing person an admin unless listed', () => {
		expect(importRows({ data: base, creatorEmail: 'a@x' }).creatorAdmin).toEqual([
			{ conferenceId: 'conf', conferenceUserType: 'ADMIN', userEmail: 'a@x' }
		]);
		const listed = {
			...base,
			conferenceUsers: [
				{ id: 'u', conferenceUserType: 'TEAM' as const, userEmail: 'a@x', name: '  Ada ' }
			]
		};
		const rows = importRows({ data: listed, creatorEmail: 'a@x' });
		expect(rows.creatorAdmin).toEqual([]);
		expect(rows.conferenceUsers[0]).toMatchObject({ name: 'Ada', conferenceId: 'conf' });
	});

	it('clears blank names', () => {
		const data = {
			...base,
			conferenceUsers: [
				{ id: 'u', conferenceUserType: 'TEAM' as const, userEmail: 'b@x', name: ' ' }
			]
		};
		expect(importRows({ data, creatorEmail: 'a@x' }).conferenceUsers[0].name).toBeNull();
	});

	it('orders request types by their position and fills the defaults', () => {
		const data = {
			...base,
			requestTypes: [
				{ name: 'Point of order' },
				{ name: 'Question', enabled: false, delegatesOnly: true }
			]
		};
		expect(importRows({ data, creatorEmail: 'a@x' }).requestTypes).toEqual([
			{
				id: undefined,
				conferenceId: 'conf',
				name: 'Point of order',
				icon: undefined,
				priority: 0,
				enabled: true,
				delegatesOnly: false
			},
			{
				id: undefined,
				conferenceId: 'conf',
				name: 'Question',
				icon: undefined,
				priority: 1,
				enabled: false,
				delegatesOnly: true
			}
		]);
	});
});

describe('speakersListsOf', () => {
	it('gives an agenda item a speakers list and a comment list', () => {
		expect(speakersListsOf('a')).toEqual([
			{ agendaItemId: 'a', speakingTime: 180, type: 'SPEAKERS_LIST' },
			{ agendaItemId: 'a', speakingTime: 30, type: 'COMMENT_LIST' }
		]);
	});
});
