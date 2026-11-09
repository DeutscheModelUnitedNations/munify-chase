import { GraphQLError } from 'graphql';

/** A speaker is either a committee seat or a conference member (an NSA), never both. */
export function assertOneSpeakerSeat(args: {
	committeeMemberId?: string | null;
	conferenceMemberId?: string | null;
}) {
	if (args.committeeMemberId && args.conferenceMemberId) {
		throw new GraphQLError('Cannot set both committeeMemberId and conferenceMemberId');
	}
	if (!args.committeeMemberId && !args.conferenceMemberId) {
		throw new GraphQLError('Must set either committeeMemberId or conferenceMemberId');
	}
}

type SelfServiceList = {
	isClosed: boolean;
	agendaItem: {
		committee: {
			id: string;
			conferenceId: string;
			allowDelegationsToAddThemselvesToSpeakersList: boolean;
		} | null;
	} | null;
};

/**
 * The committee of a list delegates may add themselves to or remove themselves from. Only adding
 * is refused on a closed list.
 */
export function selfServiceCommittee<L extends SelfServiceList>({
	speakersList,
	action
}: {
	speakersList: L | undefined;
	action: 'add' | 'remove';
}) {
	if (!speakersList) throw new GraphQLError('Speakers list not found');
	if (action === 'add' && speakersList.isClosed) throw new GraphQLError('Speakers list is closed');

	const committee = speakersList.agendaItem?.committee;
	if (!committee) throw new GraphQLError('Committee not found for this speakers list');
	if (!committee.allowDelegationsToAddThemselvesToSpeakersList) {
		throw new GraphQLError(
			action === 'add'
				? 'Self-adding to speakers list is not enabled for this committee'
				: 'Self-removing from speakers list is not enabled for this committee'
		);
	}
	return committee;
}

type SelfAddingUser = {
	conferenceUserType: string;
	committeeMember: { id: string; present: boolean; committeeId: string } | null;
	conferenceMember: { id: string } | null;
};

/** Who may add themselves to a list at all. */
export function assertMayQueueThemselves(conferenceUser: { conferenceUserType: string }) {
	if (
		conferenceUser.conferenceUserType !== 'DELEGATE' &&
		conferenceUser.conferenceUserType !== 'NON_STATE_ACTOR'
	) {
		throw new GraphQLError('Only delegates and non-state actors can self-add to speakers lists');
	}
}

/**
 * The seat a delegate or NSA queues with: a delegate's own seat in the list's committee, where
 * they must be present, or an NSA's conference membership.
 */
export function selfAddSeat({
	conferenceUser,
	committeeId
}: {
	conferenceUser: SelfAddingUser;
	committeeId: string;
}) {
	if (conferenceUser.conferenceUserType !== 'DELEGATE') {
		if (!conferenceUser.conferenceMember) {
			throw new GraphQLError('Non-state actor is not assigned a conference member');
		}
		return { committeeMemberId: null, conferenceMemberId: conferenceUser.conferenceMember.id };
	}

	const seat = conferenceUser.committeeMember;
	if (!seat) throw new GraphQLError('Delegate is not assigned to a committee');
	if (!seat.present) {
		throw new GraphQLError('Delegate must be marked as present to add to speakers list');
	}
	if (seat.committeeId !== committeeId) {
		throw new GraphQLError('Delegate is not a member of this committee');
	}
	return { committeeMemberId: seat.id, conferenceMemberId: null };
}

/** The filter for a seat's entry on a list. */
export function seatEntryFilter({
	speakersListId,
	seat
}: {
	speakersListId: string;
	seat: { committeeMemberId: string | null; conferenceMemberId: string | null };
}) {
	return {
		speakersListId,
		...(seat.committeeMemberId ? { committeeMemberId: seat.committeeMemberId } : {}),
		...(seat.conferenceMemberId ? { conferenceMemberId: seat.conferenceMemberId } : {})
	};
}

/** A move target within the occupied positions, so a list never gets gaps. */
export function clampPosition({ target, max }: { target: number; max: number }) {
	return Math.max(0, Math.min(max, target));
}

/**
 * Which entries a move from one position to another shifts, in which order (so no two share a
 * position at any step), and by how much.
 */
export function moveShift({ from, to }: { from: number; to: number }) {
	if (to > from) {
		return { range: { gt: from, lte: to }, order: 'asc' as const, step: -1 as const };
	}
	if (to < from) {
		return { range: { lt: from, gte: to }, order: 'desc' as const, step: 1 as const };
	}
	return undefined;
}
