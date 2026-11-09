import { GraphQLError } from 'graphql';

const DELEGATES_ONLY = 'This request type is only available to delegates.';

/** A delegates-only request type is refused to anybody but a delegate. */
export function assertRequestTypeFor({
	requestType,
	conferenceUserType
}: {
	requestType: { delegatesOnly: boolean };
	conferenceUserType: string;
}) {
	if (requestType.delegatesOnly && conferenceUserType !== 'DELEGATE') {
		throw new GraphQLError(DELEGATES_ONLY);
	}
}

/** The seats a conference user files requests for: their committee seat, their NSA membership. */
export function requestSeats(self: {
	committeeMemberId: string | null;
	conferenceMemberId: string | null;
}) {
	return [
		...(self.committeeMemberId ? [{ committeeMemberId: self.committeeMemberId }] : []),
		...(self.conferenceMemberId ? [{ conferenceMemberId: self.conferenceMemberId }] : [])
	];
}

/** The one seat a chair queues a request for. */
export function manualRequestSeat(args: {
	committeeMemberId?: string | null;
	conferenceMemberId?: string | null;
}): { committeeMemberId: string } | { conferenceMemberId: string } {
	if (args.committeeMemberId && !args.conferenceMemberId) {
		return { committeeMemberId: args.committeeMemberId };
	}
	if (args.conferenceMemberId && !args.committeeMemberId) {
		return { conferenceMemberId: args.conferenceMemberId };
	}
	throw new GraphQLError('Set exactly one of committeeMemberId and conferenceMemberId.');
}

/** Whether a database error is the unique violation of a second pending request. */
export function isUniqueViolation(err: unknown) {
	return (err as { code?: string } | null)?.code === '23505';
}

/** Only pending requests can still be resolved or withdrawn. */
export function assertPending({
	request,
	message
}: {
	request: { status: string };
	message: string;
}) {
	if (request.status !== 'PENDING') throw new GraphQLError(message);
}
