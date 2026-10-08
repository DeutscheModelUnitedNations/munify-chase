type SpeakerRepresentation = {
	name?: string | null;
	alpha2Code?: string | null;
	alpha3Code?: string | null;
	faIcon?: string | null;
	type?: string | null;
};

type SpeakerMember = {
	id: string;
	representation?: SpeakerRepresentation | null;
};

/** A speaker on a list, with the fields the speakers list components display */
export type ListedSpeaker = {
	id: string;
	position: number;
	overwriteName?: string | null;
	committeeMember?: SpeakerMember | null;
	conferenceMember?: SpeakerMember | null;
};

/** The speakers or comment list shown in the chair navbar */
export type NavbarSpeakersList =
	| {
			id: string;
			type: string;
			speakingTime: number;
			startTimestamp?: Date | null;
			timeLeft: number;
			phase?: string | null;
			speakers: ListedSpeaker[];
	  }
	| null
	| undefined;
