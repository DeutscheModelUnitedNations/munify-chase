import { describe, expect, it } from 'vitest';
import { presenceIdentity, syncBadgeState, toFlagEmoji, uniqueByUser } from './presenceDisplay';

describe('syncBadgeState', () => {
	const state = (
		connectionState: Parameters<typeof syncBadgeState>[0]['connectionState'],
		persistenceLoaded = true,
		wsSynced = false
	) => syncBadgeState({ connectionState, persistenceLoaded, wsSynced });

	it('shows errors first, then loading', () => {
		expect(state('error', false, true)).toBe('error');
		expect(state('connected', false, true)).toBe('loading');
	});

	it('is synced once the server confirmed the document', () => {
		expect(state('disconnected', true, true)).toBe('synced');
	});

	it('is syncing while connecting or connected, offline otherwise', () => {
		expect(state('connected')).toBe('syncing');
		expect(state('connecting')).toBe('syncing');
		expect(state('disconnected')).toBe('offline');
	});
});

describe('presenceIdentity', () => {
	const user = { id: 'u1', name: 'Jane Doe', color: undefined };

	it('names people without metadata by their name', () => {
		expect(presenceIdentity({ presence: { user }, viewerIsTeam: false })).toEqual({
			kind: 'person',
			name: 'Jane Doe'
		});
		expect(
			presenceIdentity({ presence: { user: { ...user, name: '' } }, viewerIsTeam: false })
		).toEqual({ kind: 'person', name: '?' });
	});

	it('names participants by their nation', () => {
		const translated = presenceIdentity({
			presence: { user, userMeta: { conferenceUserType: 'DELEGATE', alpha3Code: 'DEU' } },
			viewerIsTeam: false
		});
		expect(translated).toMatchObject({ kind: 'participant' });
		expect(translated.kind === 'participant' && translated.name).not.toBe('?');

		expect(
			presenceIdentity({
				presence: { user, userMeta: { conferenceUserType: 'NON_STATE_ACTOR', nationName: 'WHO' } },
				viewerIsTeam: false
			})
		).toMatchObject({ kind: 'participant', name: 'WHO' });
		expect(
			presenceIdentity({
				presence: { user, userMeta: { conferenceUserType: 'DELEGATE' } },
				viewerIsTeam: false
			})
		).toMatchObject({ kind: 'participant', name: '?' });
	});

	it('shows team members by name to the team only', () => {
		const presence = { user, userMeta: { conferenceUserType: 'TEAM' as const } };
		expect(presenceIdentity({ presence, viewerIsTeam: true })).toEqual({
			kind: 'person',
			name: 'Jane Doe'
		});
		expect(presenceIdentity({ presence, viewerIsTeam: false })).toEqual({ kind: 'team' });
	});
});

describe('toFlagEmoji', () => {
	it('turns alpha-2 codes into flags', () => {
		expect(toFlagEmoji('de')).toBe('🇩🇪');
		expect(toFlagEmoji('DEU')).toBeNull();
		expect(toFlagEmoji(null)).toBeNull();
	});
});

describe('uniqueByUser', () => {
	it('keeps the first presence per user', () => {
		const a = { user: { id: 'a' }, tab: 1 };
		expect(uniqueByUser([a, { user: { id: 'b' }, tab: 1 }, { user: { id: 'a' }, tab: 2 }])).toEqual(
			[a, { user: { id: 'b' }, tab: 1 }]
		);
	});
});
