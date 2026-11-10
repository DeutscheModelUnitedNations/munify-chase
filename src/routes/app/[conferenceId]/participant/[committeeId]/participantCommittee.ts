import { m } from '#lib/paraglide/messages';

type Role = string | null | undefined;

export function isParticipantRole(role: Role) {
	return role === 'DELEGATE' || role === 'NON_STATE_ACTOR';
}

/** Spectators follow the lists too, they just cannot put themselves on them. */
export function seesSpeakersLists(role: Role) {
	return isParticipantRole(role) || role === 'SPECTATOR';
}

/** Where the caller stands on a list, null when they are not on it. */
export function positionOnList({
	speakers,
	committeeMemberId,
	conferenceMemberId
}: {
	speakers: readonly {
		position: number;
		committeeMember?: { id: string } | null;
		conferenceMember?: { id: string } | null;
	}[];
	committeeMemberId: string | null | undefined;
	conferenceMemberId: string | null | undefined;
}): number | null {
	const isMine = (seat: { id: string } | null | undefined, mine: string | null | undefined) =>
		!!mine && seat?.id === mine;
	const speaker = speakers.find(
		(s) =>
			isMine(s.committeeMember, committeeMemberId) || isMine(s.conferenceMember, conferenceMemberId)
	);
	return speaker?.position ?? null;
}

export type SelfAddState = 'onList' | 'closed' | 'notPresent' | 'canAdd';

/** What the caller can do about a list: leave it, nothing (and why), or join it. */
export function selfAddState({
	myPosition,
	isClosed,
	role,
	present
}: {
	myPosition: number | null;
	isClosed: boolean;
	role: Role;
	present: boolean;
}): SelfAddState {
	if (myPosition !== null) return 'onList';
	if (isClosed) return 'closed';
	if (role === 'DELEGATE' && !present) return 'notPresent';
	return 'canAdd';
}

/** The caller's place on a list, in words. */
export function positionText(position: number) {
	return position === 0 ? m.youreUp() : m.onListPosition({ position: String(position) });
}

/** Read aloud whenever the caller's place on a list changes. */
export function positionAnnouncement({
	label,
	position
}: {
	label: string;
	position: number | null;
}) {
	return position === null ? '' : `${label}: ${positionText(position)}`;
}

/** The device vote dialog opens for present delegates while a timed device vote runs. */
export function showsDeviceVote({
	session,
	committeeMemberId,
	present
}: {
	session:
		| {
				mode: string;
				deviceVotingStartedAt?: unknown;
				deviceVotingWindowSeconds?: number | null;
		  }
		| null
		| undefined;
	committeeMemberId: string | null | undefined;
	present: boolean;
}) {
	return (
		session?.mode === 'DEVICE_BASED' &&
		!!session.deviceVotingStartedAt &&
		!!session.deviceVotingWindowSeconds &&
		!!committeeMemberId &&
		present
	);
}
