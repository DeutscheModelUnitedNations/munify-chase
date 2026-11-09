import { describe, expect, it } from 'vitest';
import { notificationRequesterLabel, requesterLabel } from './requesters';

const seat = (name: string | null, alpha3Code: string | null = null) => ({
	id: 's',
	representation: { name, alpha3Code }
});

describe('requesterLabel', () => {
	it('names the seat, with the person when they add something', () => {
		expect(
			requesterLabel({ committeeMember: seat('Peru'), conferenceUser: { name: 'Ana' } })
		).toEqual({ primary: 'Peru', secondary: 'Ana' });
		expect(requesterLabel({ committeeMember: seat('Ana'), conferenceUser: { name: 'Ana' } })).toEqual({
			primary: 'Ana',
			secondary: null
		});
	});

	it('falls back to the person, their email, then unknown', () => {
		expect(requesterLabel({ conferenceUser: { name: 'Ana' } }).primary).toBe('Ana');
		expect(requesterLabel({ conferenceUser: { userEmail: 'a@b.de' } }).primary).toBe('a@b.de');
		expect(requesterLabel({}).primary).toBeTruthy();
	});

	it('names a seat without a name by its country', () => {
		expect(requesterLabel({ conferenceMember: seat(null, null) }).primary).toBe('N/A');
	});
});

describe('notificationRequesterLabel', () => {
	it('names the person first, then the seat, then the email', () => {
		expect(
			notificationRequesterLabel({ committeeMember: seat('Peru'), conferenceUser: { name: 'Ana' } })
		).toBe('Ana');
		expect(notificationRequesterLabel({ committeeMember: seat('Peru') })).toBe('Peru');
		expect(notificationRequesterLabel({ conferenceUser: { userEmail: 'a@b.de' } })).toBe('a@b.de');
		expect(notificationRequesterLabel({})).toBeTruthy();
	});
});
