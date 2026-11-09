import { m } from '#lib/paraglide/messages';
import { requestRepresentation, type RequestLike } from '#lib/helpers/requests';
import { getTranslatedCountryNameFromAlpha3Code } from '#lib/utils/nationTranslationHelper.svelte';

type Requester = Pick<RequestLike, 'committeeMember' | 'conferenceMember' | 'conferenceUser'> & {
	conferenceUser?: { name?: string | null; userEmail?: string | null } | null;
};

/** The delegation or NSA a request was made for, if it names one. */
function seatName(req: Requester) {
	const rep = requestRepresentation(req);
	return rep ? (rep.name ?? getTranslatedCountryNameFromAlpha3Code(rep.alpha3Code)) : null;
}

/**
 * The delegation/NSA name is the primary label; the person's own name (when
 * set) is shown alongside it for context, but only if it adds information.
 */
export function requesterLabel(req: Requester) {
	const personName = req.conferenceUser?.name;
	const primary =
		seatName(req) ?? personName ?? req.conferenceUser?.userEmail ?? m.unknown();
	const secondary = personName && personName !== primary ? personName : null;
	return { primary, secondary };
}

/** The toast names the person first, then their seat. */
export function notificationRequesterLabel(req: Requester) {
	return (
		req.conferenceUser?.name ?? seatName(req) ?? req.conferenceUser?.userEmail ?? m.unknown()
	);
}
