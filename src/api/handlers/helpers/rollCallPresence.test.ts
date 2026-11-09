import { describe, expect, it } from 'vitest';
import { presenceEventsFor } from './rollCallPresence';

const now = new Date(5);
const updated = [
	{ id: 'seat1', committeeId: 'c' },
	{ id: 'seat2', committeeId: 'c' }
];
const conferenceUsers = [{ id: 'u1', committeeMemberId: 'seat1' }];

describe('presenceEventsFor', () => {
	it('records an event for every seat a conference user holds', () => {
		expect(
			presenceEventsFor({ updated, conferenceUsers, rollCallSessionId: 'r', present: true, now })
		).toEqual([
			{
				conferenceUserId: 'u1',
				committeeId: 'c',
				rollCallSessionId: 'r',
				type: 'ROLL_CALL',
				present: true,
				timestamp: now
			}
		]);
	});
	it('marks changes outside a roll call as manual', () => {
		const [event] = presenceEventsFor({
			updated,
			conferenceUsers,
			rollCallSessionId: undefined,
			present: false,
			now
		});
		expect(event).toMatchObject({ rollCallSessionId: null, type: 'MANUAL', present: false });
	});
	it('records nothing for seats nobody holds', () => {
		expect(
			presenceEventsFor({
				updated,
				conferenceUsers: [],
				rollCallSessionId: null,
				present: true,
				now
			})
		).toEqual([]);
	});
});
