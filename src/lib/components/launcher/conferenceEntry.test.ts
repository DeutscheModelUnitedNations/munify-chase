import { describe, expect, it } from 'vitest';
import { conferenceEntry } from './conferenceEntry';

describe('conferenceEntry', () => {
	it('sends admins and chairs to mission control', () => {
		expect(conferenceEntry({ role: 'ADMIN' })).toEqual({ kind: 'missionControl' });
		expect(conferenceEntry({ role: 'CHAIR', committeeId: 'c' })).toEqual({
			kind: 'missionControl'
		});
	});

	it('sends a seated delegate to their committee', () => {
		expect(conferenceEntry({ role: 'DELEGATE', committeeId: 'c' })).toEqual({
			kind: 'committee',
			committeeId: 'c'
		});
	});

	it('sends everyone else to the participant view', () => {
		expect(conferenceEntry({ role: 'DELEGATE', committeeId: null })).toEqual({
			kind: 'participant'
		});
		expect(conferenceEntry({ role: 'SPECTATOR', committeeId: 'c' })).toEqual({
			kind: 'participant'
		});
	});
});
