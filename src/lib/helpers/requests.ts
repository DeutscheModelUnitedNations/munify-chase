type Representation = {
	name?: string | null;
	alpha2Code?: string | null;
	alpha3Code?: string | null;
	faIcon?: string | null;
	type?: string | null;
};

type SeatRef = { id: string; representation?: Representation | null } | null | undefined;

/**
 * The fields of a request the helpers below read. A request a participant filed points
 * at their conference user, one the chairs added points at the seat directly.
 */
export type RequestLike = {
	createdAt: string | Date;
	requestType?: { id?: string; priority?: number } | null;
	committeeMember?: SeatRef;
	conferenceMember?: SeatRef;
	conferenceUser?: { committeeMember?: SeatRef; conferenceMember?: SeatRef } | null;
};

/** The fields that locate a request's seat, see requestSeat */
type RequestSeatLike = Pick<RequestLike, 'committeeMember' | 'conferenceMember' | 'conferenceUser'>;

/** A pending request, reduced to its type and the seat it belongs to */
export type PendingSeatRequest = {
	requestTypeId?: string;
	committeeMemberId?: string;
	conferenceMemberId?: string;
};

/** Conference members are the NSAs, committee members the seated delegations */
export type SeatKind = 'committeeMember' | 'conferenceMember';

/** Queue order everywhere requests are listed: request type priority, then oldest first */
export function compareRequests(a: RequestLike, b: RequestLike): number {
	const priorityDiff = (a.requestType?.priority ?? 0) - (b.requestType?.priority ?? 0);
	return priorityDiff || new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
}

/** The seat a request belongs to, whether the chairs added it or a participant filed it */
export function requestSeat(req: RequestSeatLike) {
	return {
		committeeMember: req.committeeMember ?? req.conferenceUser?.committeeMember ?? null,
		conferenceMember: req.conferenceMember ?? req.conferenceUser?.conferenceMember ?? null
	};
}

/** The delegation or NSA a request is shown under */
export function requestRepresentation(req: RequestSeatLike): Representation | null {
	const { committeeMember, conferenceMember } = requestSeat(req);
	return (committeeMember ?? conferenceMember)?.representation ?? null;
}

export function toPendingSeatRequest(
	req: RequestSeatLike & Pick<RequestLike, 'requestType'>
): PendingSeatRequest {
	const { committeeMember, conferenceMember } = requestSeat(req);
	return {
		requestTypeId: req.requestType?.id,
		committeeMemberId: committeeMember?.id,
		conferenceMemberId: conferenceMember?.id
	};
}

/** Whether the seat already has a pending request of this type */
export function isPendingForSeat(
	pending: PendingSeatRequest[],
	seat: { id: string; kind: SeatKind },
	requestTypeId: string
): boolean {
	const seatField = seat.kind === 'committeeMember' ? 'committeeMemberId' : 'conferenceMemberId';
	return pending.some((req) => req.requestTypeId === requestTypeId && req[seatField] === seat.id);
}

/** NSAs never get delegates-only request types. Without a seat every type is open. */
export function isRequestTypeAvailable(
	seatKind: SeatKind | undefined,
	requestType: { delegatesOnly: boolean }
): boolean {
	return !(seatKind === 'conferenceMember' && requestType.delegatesOnly);
}

/** The seat arguments of createManualRequest, exactly one of which is set */
export function manualRequestSeatArgs(seat: { id: string; kind: SeatKind }) {
	return seat.kind === 'committeeMember'
		? { committeeMemberId: seat.id, conferenceMemberId: undefined }
		: { committeeMemberId: undefined, conferenceMemberId: seat.id };
}

/**
 * Enter in the delegation search takes the best match. With an empty search it keeps a
 * delegation that was clicked instead.
 */
export function seatAfterEnter(
	search: string,
	selectedId: string | undefined,
	bestMatchId: string | undefined
): string | undefined {
	if (search.length === 0 && selectedId) return selectedId;
	return bestMatchId ?? selectedId;
}

/**
 * Enter in the request type search adds the request once the selection is what the search
 * points at (or nothing is searched), and otherwise selects the best match.
 */
export function typeEnterAction(state: {
	canAdd: boolean;
	search: string;
	selectedId: string | undefined;
	bestMatch: { id: string } | undefined;
}): { add: true } | { select: string | undefined } {
	const bestMatchId = state.bestMatch?.id;
	const searchMatchesSelection = state.search.length === 0 || bestMatchId === state.selectedId;
	if (state.canAdd && searchMatchesSelection) return { add: true };
	return { select: bestMatchId ?? state.selectedId };
}
