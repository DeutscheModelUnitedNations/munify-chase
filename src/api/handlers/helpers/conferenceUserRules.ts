import { GraphQLError } from 'graphql';

type ConferenceUserType = 'ADMIN' | 'TEAM' | 'SPECTATOR' | 'DELEGATE' | 'NON_STATE_ACTOR';

/** An admin cannot take their own admin role away. */
export function assertNotDemotingSelf({
	conferenceUser,
	callerEmail,
	newType
}: {
	conferenceUser: { userEmail: string; conferenceUserType: ConferenceUserType };
	callerEmail: string | null | undefined;
	newType: ConferenceUserType;
}) {
	if (
		conferenceUser.userEmail === callerEmail &&
		conferenceUser.conferenceUserType === 'ADMIN' &&
		newType !== 'ADMIN'
	) {
		throw new GraphQLError('You cannot demote yourself from ADMIN');
	}
}

/**
 * The columns a role change writes. A name of only spaces clears it (back to the email fallback in
 * the UI), a left out name stays. A seat only a delegate holds (committeeMemberId) or only an NSA
 * holds (conferenceMemberId) is cleared when the role changes away from it.
 */
export function conferenceUserUpdate(args: {
	conferenceUserType: ConferenceUserType;
	committeeMemberId?: string | null;
	conferenceMemberId?: string | null;
	name?: string | null;
}) {
	const delegate = args.conferenceUserType === 'DELEGATE';
	const nsa = args.conferenceUserType === 'NON_STATE_ACTOR';
	return {
		conferenceUserType: args.conferenceUserType,
		...(args.name != null ? { name: args.name.trim() || null } : {}),
		...(!delegate || args.committeeMemberId !== undefined
			? { committeeMemberId: delegate ? args.committeeMemberId : null }
			: {}),
		...(!nsa || args.conferenceMemberId !== undefined
			? { conferenceMemberId: nsa ? args.conferenceMemberId : null }
			: {})
	};
}
