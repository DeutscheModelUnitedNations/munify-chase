export interface ListRepresentation {
	name?: string | null;
	alpha2Code?: string | null;
	alpha3Code?: string | null;
	icon?: string | null;
	type?: string | null;
}

export interface ListSpeaker {
	id: string;
	position: number;
	overwriteName?: string | null;
	committeeMember?: { id: string; representation?: ListRepresentation | null } | null;
	conferenceMember?: { id: string; representation?: ListRepresentation | null } | null;
}

/** A speakers or comment list as the chair views read it */
export interface SpeakersListData {
	id: string;
	type: string;
	isClosed: boolean;
	speakingTime: number;
	startTimestamp?: Date | null;
	timeLeft: number;
	speakers: ListSpeaker[];
}
