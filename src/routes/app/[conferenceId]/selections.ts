/** Query selections several pages of a conference share, so the cache holds one shape. */

/** A seat's delegation or NSA, as flags and names show it. */
export const seatRepresentation = {
	id: true,
	type: true,
	name: true,
	alpha2Code: true,
	alpha3Code: true,
	icon: true
} as const;

/** The caller's part in the conference, with their seat. */
export const participantSelection = {
	id: true,
	conferenceUserType: true,
	committeeMemberId: true,
	conferenceMemberId: true,
	committeeMember: {
		id: true,
		present: true,
		committeeId: true,
		representation: seatRepresentation
	},
	conferenceMember: { id: true, representation: seatRepresentation }
} as const;

const listRepresentation = { ...seatRepresentation, regionalGroup: true } as const;

/** What the chairs' layout and the presentation read of a speakers list. */
export const speakersListSelection = {
	id: true,
	type: true,
	isClosed: true,
	speakingTime: true,
	startTimestamp: true,
	timeLeft: true,
	speakers: {
		id: true,
		position: true,
		overwriteName: true,
		committeeMember: { id: true, representation: listRepresentation, present: true },
		conferenceMember: { id: true, representation: listRepresentation }
	}
} as const;

/** A speakers list someone can put themselves on or be put on. */
export const editableSpeakersListSelection = {
	id: true,
	type: true,
	isClosed: true,
	speakingTime: true,
	startTimestamp: true,
	timeLeft: true,
	phase: true,
	agendaItem: {
		id: true,
		committee: {
			id: true,
			allowDelegationsToAddThemselvesToSpeakersList: true,
			conferenceId: true
		}
	},
	speakers: {
		id: true,
		position: true,
		speakersListId: true,
		overwriteName: true,
		committeeMember: { id: true, representation: seatRepresentation },
		conferenceMember: { id: true, representation: seatRepresentation }
	}
} as const;
