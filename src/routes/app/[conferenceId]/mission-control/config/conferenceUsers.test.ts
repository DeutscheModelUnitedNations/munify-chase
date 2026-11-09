import { describe, expect, it } from 'vitest';
import {
	assignmentCounts,
	assignmentRepresentation,
	committeeText,
	isAssignableRole,
	isValidEmail,
	matchesSearch,
	parseEmails,
	representationName,
	roleBadgeClass,
	roleLabel,
	seatOptionLabel,
	userDisplayName,
	userEditForm,
	userEditResult,
	visiblePages,
	withRoleAssignment,
	type ConferenceUserRow
} from './conferenceUsers';

const rep = { id: 'r', name: 'Peru', alpha2Code: 'PE', alpha3Code: 'PER', icon: null };
const row = (overrides: Partial<ConferenceUserRow> = {}): ConferenceUserRow => ({
	id: 'u',
	userEmail: 'a@b.de',
	name: null,
	conferenceUserType: 'DELEGATE',
	user: null,
	committeeMember: {
		id: 'cm',
		representation: rep,
		committee: { id: 'c', name: 'General Assembly', abbreviation: 'GA' }
	},
	conferenceMember: { id: 'm', representation: { ...rep, name: 'NGO', type: 'NSA' } },
	...overrides
});

describe('roles', () => {
	it('labels and colours roles, passing unknown ones through', () => {
		expect(roleBadgeClass('ADMIN')).toBe('badge-error');
		expect(roleBadgeClass('???')).toBe('badge-ghost');
		expect(roleLabel('ADMIN')).toBeTruthy();
		expect(roleLabel('???')).toBe('???');
	});

	it('assigns delegates and NSAs only', () => {
		expect(isAssignableRole('DELEGATE')).toBe(true);
		expect(isAssignableRole('NON_STATE_ACTOR')).toBe(true);
		expect(isAssignableRole('TEAM')).toBe(false);
	});
});

describe('assignments', () => {
	it('takes the seat the role uses', () => {
		expect(assignmentRepresentation(row())?.name).toBe('Peru');
		expect(assignmentRepresentation(row({ conferenceUserType: 'NON_STATE_ACTOR' }))?.name).toBe('NGO');
		expect(assignmentRepresentation(row({ conferenceUserType: 'TEAM' }))).toBeUndefined();
		expect(assignmentRepresentation(row({ committeeMember: null }))).toBeUndefined();
	});

	it('names a representation, else its country', () => {
		expect(representationName({ name: 'Peru', alpha3Code: null })).toBe('Peru');
		expect(representationName({ name: null, alpha3Code: null })).toBe('N/A');
	});

	it('shows the committee abbreviation', () => {
		expect(committeeText(row())).toBe('GA');
		expect(committeeText(row({ committeeMember: null }))).toBe('');
	});

	it('counts members per seat', () => {
		expect(assignmentCounts(['a', null, 'a', undefined, 'b'])).toEqual(
			new Map([
				['a', 2],
				['b', 1]
			])
		);
	});

	it('marks seats already held in the picker', () => {
		expect(seatOptionLabel({ representation: rep, assigned: 0 })).toBe('Peru');
		expect(seatOptionLabel({ representation: rep, assigned: 2 })).toMatch(/^Peru \(.+\)$/);
	});
});

describe('names and search', () => {
	it('prefers the name the admin gave', () => {
		expect(userDisplayName({ name: 'Set', user: { givenName: 'A', familyName: 'B' } })).toBe('Set');
		expect(userDisplayName({ name: null, user: { givenName: 'A', familyName: '' } })).toBe('A');
		expect(userDisplayName({ name: null, user: null })).toBe('');
	});

	it('searches the shown texts without case', () => {
		expect(matchesSearch({ texts: ['Peru', 'a@b.de'], search: 'PER' })).toBe(true);
		expect(matchesSearch({ texts: ['Peru'], search: 'chad' })).toBe(false);
	});
});

describe('visiblePages', () => {
	it('lists up to seven pages', () => {
		expect(visiblePages({ current: 0, total: 3 })).toEqual([0, 1, 2]);
	});

	it('shows the ends and the current neighbourhood of more', () => {
		expect(visiblePages({ current: 0, total: 10 })).toEqual([0, 1, 'ellipsis', 9]);
		expect(visiblePages({ current: 5, total: 10 })).toEqual([0, 'ellipsis', 4, 5, 6, 'ellipsis', 9]);
		expect(visiblePages({ current: 9, total: 10 })).toEqual([0, 'ellipsis', 8, 9]);
	});
});

describe('emails', () => {
	it('checks addresses', () => {
		expect(isValidEmail('a@b.de')).toBe(true);
		expect(isValidEmail('a b@c.de')).toBe(false);
	});

	it('splits, trims, lowercases and drops invalid ones', () => {
		expect(parseEmails(' A@B.de, x;\nc@d.org\n\n')).toEqual(['a@b.de', 'c@d.org']);
	});
});

describe('edit dialog', () => {
	it('starts from the member', () => {
		expect(userEditForm(row({ name: 'N' }))).toEqual({
			role: 'DELEGATE',
			committeeMemberId: 'cm',
			conferenceMemberId: 'm',
			name: 'N'
		});
		expect(userEditForm(row({ committeeMember: null, conferenceMember: null }))).toMatchObject({
			committeeMemberId: null,
			conferenceMemberId: null,
			name: ''
		});
	});

	it('keeps only the assignment the role uses', () => {
		const form = { role: 'NON_STATE_ACTOR' as const, committeeMemberId: 'cm', conferenceMemberId: 'm', name: ' ' };
		expect(withRoleAssignment(form)).toMatchObject({ committeeMemberId: null, conferenceMemberId: 'm' });
		expect(userEditResult(form)).toEqual({
			conferenceUserType: 'NON_STATE_ACTOR',
			committeeMemberId: null,
			conferenceMemberId: 'm',
			name: null
		});
		expect(userEditResult({ ...form, role: 'DELEGATE', name: ' X ' })).toEqual({
			conferenceUserType: 'DELEGATE',
			committeeMemberId: 'cm',
			conferenceMemberId: null,
			name: 'X'
		});
	});
});
