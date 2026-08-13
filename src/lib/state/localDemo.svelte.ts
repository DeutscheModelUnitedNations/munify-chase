import { page } from '$app/state';

export const LOCAL_CONFERENCE_ID = 'localconference';

// `page.route.id` is the route *pattern* (e.g. "/app/[conferenceId]/mission-control"),
// never the resolved path, so it never starts with `/app/${LOCAL_CONFERENCE_ID}` for any
// real conference-scoped page. Match against the resolved pathname instead.
// Matched by full segment (exact, or followed by `/`) — a plain `startsWith` would also
// match a differently-id'd real conference, e.g. "/app/localconference2/...".
export function isLocalConferencePath(pathname: string) {
	const prefix = `/app/${LOCAL_CONFERENCE_ID}`;
	return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isLocalConferenceActive() {
	return isLocalConferencePath(page.url.pathname);
}

export const LOCAL_DEMO_GUEST_CLAIMS = {
	id: 'local-demo-guest',
	givenName: 'Guest',
	familyName: null,
	email: null,
	preferredUsername: 'guest',
	locale: null
};
