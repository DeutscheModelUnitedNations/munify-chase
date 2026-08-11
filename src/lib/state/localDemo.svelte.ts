import { page } from '$app/state';

export const LOCAL_CONFERENCE_ID = 'localconference';

// `page.route.id` is the route *pattern* (e.g. "/app/[conferenceId]/mission-control"),
// never the resolved path, so it never starts with `/app/${LOCAL_CONFERENCE_ID}` for any
// real conference-scoped page. Match against the resolved pathname instead.
export function isLocalConferenceActive() {
	return page.url.pathname.startsWith(`/app/${LOCAL_CONFERENCE_ID}`);
}

export const LOCAL_DEMO_GUEST_CLAIMS = {
	id: 'local-demo-guest',
	givenName: 'Guest',
	familyName: null,
	email: null,
	preferredUsername: 'guest',
	locale: null
};
