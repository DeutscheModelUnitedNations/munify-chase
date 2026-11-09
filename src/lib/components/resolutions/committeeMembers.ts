import { client } from '#lib/api/rumbleClient/client';

/** What a flag and a delegation name need of a representation. */
export const representationSelection = {
	name: true,
	alpha2Code: true,
	alpha3Code: true,
	icon: true,
	type: true
} as const;

/** The committee's members with their representation, live. */
export function fetchCommitteeMembers(committeeId: string) {
	return client.liveQuery.committeeMembers({
		__args: { where: { committee: { id: { eq: committeeId } } } },
		id: true,
		representation: representationSelection
	});
}
