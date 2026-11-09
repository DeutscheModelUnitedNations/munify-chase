import { describe, expect, it } from 'vitest';
import { assertNotDemotingSelf, conferenceUserUpdate } from './conferenceUserRules';

describe('assertNotDemotingSelf', () => {
	const admin = { userEmail: 'a@x', conferenceUserType: 'ADMIN' as const };
	it('refuses an admin demoting themselves', () => {
		expect(() =>
			assertNotDemotingSelf({ conferenceUser: admin, callerEmail: 'a@x', newType: 'TEAM' })
		).toThrow('demote yourself');
	});
	it('lets admins keep their role and demote others', () => {
		expect(() =>
			assertNotDemotingSelf({ conferenceUser: admin, callerEmail: 'a@x', newType: 'ADMIN' })
		).not.toThrow();
		expect(() =>
			assertNotDemotingSelf({ conferenceUser: admin, callerEmail: 'b@x', newType: 'TEAM' })
		).not.toThrow();
		expect(() =>
			assertNotDemotingSelf({
				conferenceUser: { ...admin, conferenceUserType: 'TEAM' },
				callerEmail: 'a@x',
				newType: 'DELEGATE'
			})
		).not.toThrow();
	});
});

describe('conferenceUserUpdate', () => {
	it('clears both seats for roles without one', () => {
		expect(conferenceUserUpdate({ conferenceUserType: 'TEAM', committeeMemberId: 'c' })).toEqual({
			conferenceUserType: 'TEAM',
			committeeMemberId: null,
			conferenceMemberId: null
		});
	});
	it('sets a delegate seat when given and leaves it otherwise', () => {
		expect(
			conferenceUserUpdate({ conferenceUserType: 'DELEGATE', committeeMemberId: 'c' })
		).toEqual({ conferenceUserType: 'DELEGATE', committeeMemberId: 'c', conferenceMemberId: null });
		expect(
			conferenceUserUpdate({ conferenceUserType: 'DELEGATE', committeeMemberId: null })
		).toEqual({
			conferenceUserType: 'DELEGATE',
			committeeMemberId: null,
			conferenceMemberId: null
		});
		expect(conferenceUserUpdate({ conferenceUserType: 'DELEGATE' })).toEqual({
			conferenceUserType: 'DELEGATE',
			conferenceMemberId: null
		});
	});
	it('sets an NSA membership when given and leaves it otherwise', () => {
		expect(
			conferenceUserUpdate({ conferenceUserType: 'NON_STATE_ACTOR', conferenceMemberId: 'm' })
		).toEqual({
			conferenceUserType: 'NON_STATE_ACTOR',
			committeeMemberId: null,
			conferenceMemberId: 'm'
		});
		expect(conferenceUserUpdate({ conferenceUserType: 'NON_STATE_ACTOR' })).toEqual({
			conferenceUserType: 'NON_STATE_ACTOR',
			committeeMemberId: null
		});
	});
	it('trims the name, clears a blank one and leaves a missing one', () => {
		expect(conferenceUserUpdate({ conferenceUserType: 'TEAM', name: ' Ada ' }).name).toBe('Ada');
		expect(conferenceUserUpdate({ conferenceUserType: 'TEAM', name: '  ' })).toHaveProperty(
			'name',
			null
		);
		expect(conferenceUserUpdate({ conferenceUserType: 'TEAM', name: null })).not.toHaveProperty(
			'name'
		);
	});
});
