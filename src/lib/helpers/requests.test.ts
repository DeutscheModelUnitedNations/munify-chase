import { describe, expect, it } from 'vitest';
import {
	compareRequests,
	isPendingForSeat,
	isRequestTypeAvailable,
	manualRequestSeatArgs,
	requestRepresentation,
	requestSeat,
	seatAfterEnter,
	toPendingSeatRequest,
	typeEnterAction,
	type RequestLike
} from './requests';

const germany = { id: 'cm-de', representation: { name: 'Germany', alpha3Code: 'DEU' } };
const amnesty = { id: 'nsa-ai', representation: { name: 'Amnesty International' } };

const request = (overrides: Partial<RequestLike> = {}): RequestLike => ({
	createdAt: '2026-10-21T10:00:00Z',
	requestType: { id: 'rt-info', priority: 0 },
	...overrides
});

describe('compareRequests', () => {
	it('sorts by request type priority first', () => {
		const urgent = request({ requestType: { priority: 0 }, createdAt: '2026-10-21T12:00:00Z' });
		const later = request({ requestType: { priority: 3 }, createdAt: '2026-10-21T08:00:00Z' });
		expect([later, urgent].sort(compareRequests)).toEqual([urgent, later]);
	});

	it('sorts oldest first within the same priority', () => {
		const older = request({ createdAt: new Date('2026-10-21T08:00:00Z') });
		const newer = request({ createdAt: '2026-10-21T09:00:00Z' });
		expect([newer, older].sort(compareRequests)).toEqual([older, newer]);
	});

	it('treats a missing request type as priority 0', () => {
		const untyped = request({ requestType: null, createdAt: '2026-10-21T11:00:00Z' });
		const typed = request({ requestType: { priority: 1 } });
		expect([typed, untyped].sort(compareRequests)).toEqual([untyped, typed]);
	});
});

describe('requestSeat and requestRepresentation', () => {
	it('uses the seat a chair added the request for', () => {
		const req = request({ committeeMember: germany, conferenceUser: null });
		expect(requestSeat(req)).toEqual({ committeeMember: germany, conferenceMember: null });
		expect(requestRepresentation(req)).toBe(germany.representation);
	});

	it("falls back to the filing participant's seat", () => {
		const req = request({ conferenceUser: { conferenceMember: amnesty } });
		expect(requestSeat(req)).toEqual({ committeeMember: null, conferenceMember: amnesty });
		expect(requestRepresentation(req)).toBe(amnesty.representation);
	});

	it('returns null without any seat', () => {
		expect(requestRepresentation(request({ conferenceUser: {} }))).toBeNull();
	});
});

describe('toPendingSeatRequest', () => {
	it('reduces a request to its type and seat ids', () => {
		expect(toPendingSeatRequest(request({ conferenceUser: { committeeMember: germany } }))).toEqual(
			{ requestTypeId: 'rt-info', committeeMemberId: 'cm-de', conferenceMemberId: undefined }
		);
	});
});

describe('isPendingForSeat', () => {
	const pending = [
		{ requestTypeId: 'rt-info', committeeMemberId: 'cm-de' },
		{ requestTypeId: 'rt-order', conferenceMemberId: 'nsa-ai' }
	];

	it('matches type and seat', () => {
		expect(isPendingForSeat(pending, { id: 'cm-de', kind: 'committeeMember' }, 'rt-info')).toBe(
			true
		);
		expect(isPendingForSeat(pending, { id: 'nsa-ai', kind: 'conferenceMember' }, 'rt-order')).toBe(
			true
		);
	});

	it('does not match another type or another kind of seat with the same id', () => {
		expect(isPendingForSeat(pending, { id: 'cm-de', kind: 'committeeMember' }, 'rt-order')).toBe(
			false
		);
		expect(isPendingForSeat(pending, { id: 'cm-de', kind: 'conferenceMember' }, 'rt-info')).toBe(
			false
		);
	});
});

describe('isRequestTypeAvailable', () => {
	it('hides delegates-only types from NSAs only', () => {
		expect(isRequestTypeAvailable('conferenceMember', { delegatesOnly: true })).toBe(false);
		expect(isRequestTypeAvailable('conferenceMember', { delegatesOnly: false })).toBe(true);
		expect(isRequestTypeAvailable('committeeMember', { delegatesOnly: true })).toBe(true);
		expect(isRequestTypeAvailable(undefined, { delegatesOnly: true })).toBe(true);
	});
});

describe('manualRequestSeatArgs', () => {
	it('sets exactly the id for the seat kind', () => {
		expect(manualRequestSeatArgs({ id: 'cm-de', kind: 'committeeMember' })).toEqual({
			committeeMemberId: 'cm-de',
			conferenceMemberId: undefined
		});
		expect(manualRequestSeatArgs({ id: 'nsa-ai', kind: 'conferenceMember' })).toEqual({
			committeeMemberId: undefined,
			conferenceMemberId: 'nsa-ai'
		});
	});
});

describe('seatAfterEnter', () => {
	it('takes the best match for a search', () => {
		expect(seatAfterEnter('fra', 'cm-de', 'cm-fr')).toBe('cm-fr');
		expect(seatAfterEnter('', undefined, 'cm-al')).toBe('cm-al');
	});

	it('keeps a clicked seat when nothing is searched', () => {
		expect(seatAfterEnter('', 'cm-de', 'cm-al')).toBe('cm-de');
	});

	it('keeps the selection when the search matches nothing', () => {
		expect(seatAfterEnter('xyz', 'cm-de', undefined)).toBe('cm-de');
	});
});

describe('typeEnterAction', () => {
	const info = { id: 'rt-info' };
	const order = { id: 'rt-order' };
	const state = { canAdd: true, search: '', selectedId: 'rt-info', bestMatch: info };

	it('adds when the selection is what the search points at', () => {
		expect(typeEnterAction(state)).toEqual({ add: true });
		expect(typeEnterAction({ ...state, search: 'inf' })).toEqual({ add: true });
	});

	it('adds a clicked type when nothing is searched', () => {
		expect(typeEnterAction({ ...state, bestMatch: order })).toEqual({ add: true });
	});

	it('selects the best match when the search points elsewhere', () => {
		expect(typeEnterAction({ ...state, search: 'ord', bestMatch: order })).toEqual({
			select: 'rt-order'
		});
	});

	it('selects while the request cannot be added yet', () => {
		expect(typeEnterAction({ ...state, canAdd: false })).toEqual({ select: 'rt-info' });
	});

	it('keeps the selection when the search matches nothing', () => {
		expect(typeEnterAction({ ...state, search: 'xyz', bestMatch: undefined })).toEqual({
			select: 'rt-info'
		});
	});
});
