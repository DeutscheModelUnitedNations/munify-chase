import { describe, expect, it } from 'vitest';
import {
	assertPending,
	assertRequestTypeFor,
	isUniqueViolation,
	manualRequestSeat,
	requestSeats
} from './requestRules';

describe('assertRequestTypeFor', () => {
	it('keeps delegates-only types to delegates', () => {
		const requestType = { delegatesOnly: true };
		expect(() =>
			assertRequestTypeFor({ requestType, conferenceUserType: 'DELEGATE' })
		).not.toThrow();
		expect(() =>
			assertRequestTypeFor({ requestType, conferenceUserType: 'NON_STATE_ACTOR' })
		).toThrow('only available to delegates');
	});
	it('lets anybody use other types', () => {
		expect(() =>
			assertRequestTypeFor({ requestType: { delegatesOnly: false }, conferenceUserType: 'NSA' })
		).not.toThrow();
	});
});

describe('requestSeats', () => {
	it('lists the seats that are set', () => {
		expect(requestSeats({ committeeMemberId: 'c', conferenceMemberId: null })).toEqual([
			{ committeeMemberId: 'c' }
		]);
		expect(requestSeats({ committeeMemberId: 'c', conferenceMemberId: 'm' })).toEqual([
			{ committeeMemberId: 'c' },
			{ conferenceMemberId: 'm' }
		]);
		expect(requestSeats({ committeeMemberId: null, conferenceMemberId: null })).toEqual([]);
	});
});

describe('manualRequestSeat', () => {
	it('answers the one seat given', () => {
		expect(manualRequestSeat({ committeeMemberId: 'c' })).toEqual({ committeeMemberId: 'c' });
		expect(manualRequestSeat({ conferenceMemberId: 'm', committeeMemberId: null })).toEqual({
			conferenceMemberId: 'm'
		});
	});
	it('refuses none or both', () => {
		expect(() => manualRequestSeat({})).toThrow('exactly one');
		expect(() => manualRequestSeat({ committeeMemberId: 'c', conferenceMemberId: 'm' })).toThrow(
			'exactly one'
		);
	});
});

describe('isUniqueViolation', () => {
	it('recognises the unique violation code only', () => {
		expect(isUniqueViolation({ code: '23505' })).toBe(true);
		expect(isUniqueViolation({ code: '23503' })).toBe(false);
		expect(isUniqueViolation(new Error('x'))).toBe(false);
		expect(isUniqueViolation(null)).toBe(false);
	});
});

describe('assertPending', () => {
	it('passes pending requests and refuses the rest with the message', () => {
		expect(() => assertPending({ request: { status: 'PENDING' }, message: 'm' })).not.toThrow();
		expect(() => assertPending({ request: { status: 'RESOLVED' }, message: 'nope' })).toThrow(
			'nope'
		);
	});
});
