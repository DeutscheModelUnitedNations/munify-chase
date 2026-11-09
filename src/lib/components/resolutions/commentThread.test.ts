import { describe, expect, it, vi } from 'vitest';

vi.mock('#lib/paraglide/runtime', async (importOriginal) => ({
	...(await importOriginal<typeof import('#lib/paraglide/runtime')>()),
	locales: ['de', 'en', 'pt'],
	getLocale: () => 'en'
}));

const { m } = await import('#lib/paraglide/messages');
const { commentAuthorDisplay, newCommentArgs, sendsOnKey } = await import('./commentThread');

describe('commentAuthorDisplay', () => {
	it('shows participants by their delegation', () => {
		const representation = { name: 'Germany', alpha3Code: 'DEU' };
		expect(
			commentAuthorDisplay({
				author: { conferenceUserType: 'DELEGATE', committeeMember: { representation } },
				viewerIsTeam: false
			})
		).toEqual({ name: 'Germany', representation });
	});

	it('translates an unnamed delegation and falls back to the conference membership', () => {
		const representation = { name: null, alpha3Code: 'FRA' };
		expect(
			commentAuthorDisplay({
				author: { conferenceUserType: 'NON_STATE_ACTOR', conferenceMember: { representation } },
				viewerIsTeam: false
			})
		).toEqual({ name: 'France', representation });
		expect(
			commentAuthorDisplay({ author: { conferenceUserType: 'DELEGATE' }, viewerIsTeam: false })
		).toEqual({ name: '?', representation: null });
	});

	it('names team members to the team only', () => {
		const author = {
			conferenceUserType: 'TEAM',
			user: { givenName: 'Ada', familyName: 'Lovelace' }
		};
		expect(commentAuthorDisplay({ author, viewerIsTeam: true }).name).toBe('Ada Lovelace');
		expect(commentAuthorDisplay({ author, viewerIsTeam: false }).name).toBe(m.roleTeam());
	});

	it('prefers the stored name, then username and email', () => {
		const display = (author: Parameters<typeof commentAuthorDisplay>[0]['author']) =>
			commentAuthorDisplay({ author, viewerIsTeam: true }).name;
		expect(display({ name: 'Chair', user: { givenName: 'Ada' } })).toBe('Chair');
		expect(display({ user: { preferredUsername: 'ada' } })).toBe('ada');
		expect(display({ userEmail: 'ada@example.org' })).toBe('ada@example.org');
		expect(display({})).toBe('?');
		expect(display(null)).toBe('?');
	});
});

describe('newCommentArgs', () => {
	it('builds a public top-level comment', () => {
		expect(
			newCommentArgs({
				id: 'c',
				paperId: 'p',
				content: 'Hi',
				clauseId: null,
				replyTo: null,
				teamOnly: false
			})
		).toEqual({
			id: 'c',
			paperId: 'p',
			content: 'Hi',
			clauseId: undefined,
			parentCommentId: undefined,
			visibility: 'PUBLIC'
		});
	});

	it('builds a team-only reply on a clause', () => {
		const args = newCommentArgs({
			id: 'c',
			paperId: 'p',
			content: 'Hi',
			clauseId: 'cl',
			replyTo: 'r',
			teamOnly: true
		});
		expect(args).toMatchObject({ clauseId: 'cl', parentCommentId: 'r', visibility: 'TEAM_ONLY' });
	});
});

describe('sendsOnKey', () => {
	const base = { key: 'Enter', shiftKey: false, sending: false, draft: 'text' };

	it('sends on Enter with a draft', () => {
		expect(sendsOnKey(base)).toBe(true);
	});

	it('does not send on other keys, Shift+Enter, while sending or without text', () => {
		expect(sendsOnKey({ ...base, key: 'a' })).toBe(false);
		expect(sendsOnKey({ ...base, shiftKey: true })).toBe(false);
		expect(sendsOnKey({ ...base, sending: true })).toBe(false);
		expect(sendsOnKey({ ...base, draft: '  ' })).toBe(false);
	});
});
