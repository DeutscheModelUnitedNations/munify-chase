import { describe, expect, it, vi } from 'vitest';

const conferenceUsers = vi.fn();
const getCurrentUser = vi.fn();
vi.mock('#lib/api/rumbleClient/client', () => ({
	client: { liveQuery: { conferenceUsers: (...args: unknown[]) => conferenceUsers(...args) } }
}));
vi.mock('#lib/state/currentUser.svelte', () => ({
	getCurrentUser: () => getCurrentUser()
}));

const { loadParticipantUser, participantRepresentation } = await import('./participantUser');

describe('loadParticipantUser', () => {
	it("asks for the signed-in user's part in the conference", async () => {
		getCurrentUser.mockResolvedValue({ id: 'user' });
		conferenceUsers.mockResolvedValue([{ id: 'cu' }, { id: 'other' }]);
		expect(await loadParticipantUser('conf')).toEqual({ id: 'cu' });
		const [args] = conferenceUsers.mock.calls[0];
		expect(args.__args.where).toEqual({
			conference: { id: { eq: 'conf' } },
			user: { id: { eq: 'user' } }
		});
	});

	it('is undefined without a result or a signed-in user', async () => {
		getCurrentUser.mockResolvedValue(undefined);
		conferenceUsers.mockResolvedValue(undefined);
		expect(await loadParticipantUser('conf')).toBeUndefined();
		expect(conferenceUsers.mock.lastCall?.[0].__args.where.user).toEqual({ id: { eq: '' } });
	});
});

describe('participantRepresentation', () => {
	const peru = { name: 'Peru' };
	const ngo = { name: 'NGO' };

	it('prefers the committee seat over the conference seat', () => {
		expect(
			participantRepresentation({
				committeeMember: { representation: peru },
				conferenceMember: { representation: ngo }
			})
		).toBe(peru);
		expect(participantRepresentation({ conferenceMember: { representation: ngo } })).toBe(ngo);
	});

	it('is undefined without a seat', () => {
		expect(participantRepresentation(undefined)).toBeUndefined();
		expect(participantRepresentation({ committeeMember: null })).toBeUndefined();
	});
});
