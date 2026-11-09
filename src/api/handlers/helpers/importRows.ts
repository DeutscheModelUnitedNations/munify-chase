import type { importDataSchema } from '#lib/utils/import';
import type { z } from 'zod/v4';

type ImportData = z.infer<typeof importDataSchema>;

/** The rows an import of a DELEGATOR conference writes, by table. */
export function importRows({ data, creatorEmail }: { data: ImportData; creatorEmail: string }) {
	const conferenceId = data.id;
	const conferenceUsers = (data.conferenceUsers ?? []).map((user) => ({
		id: user.id,
		conferenceUserType: user.conferenceUserType,
		userEmail: user.userEmail,
		name: user.name?.trim() || null,
		conferenceMemberId: user.conferenceMemberId,
		committeeMemberId: user.committeeMemberId,
		conferenceId
	}));
	// whoever imports is made an admin when the data does not list them
	const creatorListed = conferenceUsers.some((user) => user.userEmail === creatorEmail);

	return {
		conference: {
			id: conferenceId,
			title: data.title,
			location: data.location,
			startDate: data.startDate,
			endDate: data.endDate
		},
		committees: data.committees.map(({ id, name, abbreviation }) => ({
			id,
			name,
			abbreviation,
			conferenceId
		})),
		representations: data.representations.map((representation) => ({
			id: representation.id,
			name: representation.name,
			alpha2Code: representation.alpha2Code,
			alpha3Code: representation.alpha3Code,
			type: representation.representationType,
			icon: representation.icon,
			regionalGroup: representation.regionalGroup,
			conferenceId
		})),
		conferenceMembers: data.conferenceMembers.map(({ id, representationId }) => ({
			id,
			conferenceId,
			representationId
		})),
		committeeMembers: data.committeeMembers.map(({ id, committeeId, representationId }) => ({
			id,
			committeeId,
			representationId
		})),
		conferenceUsers,
		creatorAdmin: creatorListed
			? []
			: [{ conferenceId, conferenceUserType: 'ADMIN' as const, userEmail: creatorEmail }],
		agendaItems: (data.agendaItems ?? []).map((item) => ({
			id: item.id,
			committeeId: item.committeeId,
			title: item.title,
			conferenceId
		})),
		requestTypes: (data.requestTypes ?? []).map((requestType, index) => ({
			id: requestType.id,
			conferenceId,
			name: requestType.name,
			icon: requestType.icon,
			// array order is the natural hierarchy of the request types
			priority: index,
			enabled: requestType.enabled ?? true,
			delegatesOnly: requestType.delegatesOnly ?? false
		}))
	};
}

/** Every agenda item starts with a speakers list and a comment list. */
export function speakersListsOf(agendaItemId: string) {
	return [
		{ agendaItemId, speakingTime: 180, type: 'SPEAKERS_LIST' as const },
		{ agendaItemId, speakingTime: 30, type: 'COMMENT_LIST' as const }
	];
}
