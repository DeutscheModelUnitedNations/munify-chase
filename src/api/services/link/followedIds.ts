/**
 * What the DELEGATOR tables a conference's mirror asks for by id follow from
 * (`conferenceTables.ts`): the seats, the participant rows the registrations name, the users the
 * participant rows and team members name.
 */

/** The seated delegations with their roles, as one comparable key. */
export function seatsKey(delegations: readonly { id: string; assignedRoleId?: string | null }[]) {
	return delegations
		.filter((row) => row.assignedRoleId)
		.map((row) => `${row.id}:${row.assignedRoleId}`)
		.sort()
		.join(',');
}

/** Distinct and sorted, so two lists compare with `sameIds`. */
export function idsOf(values: Iterable<string>) {
	return [...new Set(values)].sort();
}

export function sameIds(a: readonly string[], b: readonly string[]) {
	return a.length === b.length && a.every((id, i) => id === b[i]);
}

/** The participant rows that reach CHASE: seated members, seated single participants, supervisors. */
export function participantIdsOf({
	delegationMembers,
	singleParticipants,
	supervisors
}: {
	delegationMembers: readonly { conferenceParticipantId: string }[];
	singleParticipants: readonly {
		conferenceParticipantId: string;
		assignedRoleId?: string | null;
	}[];
	supervisors: readonly { conferenceParticipantId: string }[];
}) {
	return idsOf(
		[
			...delegationMembers,
			...singleParticipants.filter((row) => row.assignedRoleId),
			...supervisors
		].map((row) => row.conferenceParticipantId)
	);
}

/** The users behind the participant rows and the team. */
export function userIdsOf(rows: readonly { userId: string }[]) {
	return idsOf(rows.map((row) => row.userId));
}
