/** Pure helpers behind the delegations tab and its seat dialog. */

export interface Representation {
	id: string;
	name: string | null;
	alpha2Code: string | null;
	alpha3Code: string | null;
	type: string;
	icon: string | null;
}

export interface Committee {
	id: string;
	name: string;
	abbreviation: string;
	members: {
		id: string;
		representation: { id: string };
	}[];
}

/** The seat a representation holds in a committee, if any. */
export function seatOf({
	committee,
	representationId
}: {
	committee: Committee;
	representationId: string;
}) {
	return committee.members.find((cm) => cm.representation.id === representationId);
}

/** The committees a representation has a seat in. */
export function committeesSeating({
	committees,
	representationId
}: {
	committees: readonly Committee[];
	representationId: string;
}) {
	return committees.filter((committee) => seatOf({ committee, representationId }));
}

/** The seats to add and remove so the representation sits in exactly the wanted committees. */
export function seatChanges({
	committees,
	representationId,
	wanted
}: {
	committees: readonly Committee[];
	representationId: string;
	wanted: ReadonlySet<string>;
}) {
	const add: Committee[] = [];
	const remove: { committee: Committee; memberId: string }[] = [];
	for (const committee of committees) {
		const seat = seatOf({ committee, representationId });
		if (!seat && wanted.has(committee.id)) add.push(committee);
		if (seat && !wanted.has(committee.id)) remove.push({ committee, memberId: seat.id });
	}
	return { add, remove };
}
