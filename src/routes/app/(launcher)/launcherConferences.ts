import type { ConferenceusertypeEnum } from '#lib/api/rumbleClient/client';
import type { LauncherConference, LauncherRepresentation } from '#lib/components/launcher/types';
import { badgeFor, deriveStatus, type LauncherStatus } from '#lib/helpers/launcher';

type ConferenceFields = {
	id: string;
	title: string;
	location?: string | null;
	startDate?: Date | string | null;
	endDate?: Date | string | null;
	committees?: ReadonlyArray<{ abbreviation: string }> | null;
};

type Representation = LauncherRepresentation & { name?: string | null };

/** One of the signed-in user's conference memberships, as the launcher queries it. */
export type LauncherConferenceUser = {
	conferenceUserType: ConferenceusertypeEnum;
	committeeMember?: {
		committeeId: string;
		committee?: { abbreviation: string } | null;
		representation?: Representation | null;
	} | null;
	conferenceMember?: { representation?: Representation | null } | null;
	conference: ConferenceFields;
};

/** Where a conference opens for a role: mission control for the team, else the participant view. */
export function conferenceHref(
	type: ConferenceusertypeEnum,
	id: string,
	committeeMember?: { committeeId: string } | null
): string {
	if (type === 'ADMIN' || type === 'TEAM') return `/app/${id}/mission-control`;
	if (type === 'DELEGATE' && committeeMember?.committeeId) {
		return `/app/${id}/participant/${committeeMember.committeeId}`;
	}
	return `/app/${id}/participant`;
}

/** The line under the role badge: whom a delegate represents where, the committee a chair runs. */
export function roleDetail(
	type: ConferenceusertypeEnum,
	representationName: string | null | undefined,
	committeeAbbreviation: string | null | undefined
): string | null {
	if (type === 'DELEGATE' || type === 'NON_STATE_ACTOR') {
		return [representationName, committeeAbbreviation].filter(Boolean).join(' · ') || null;
	}
	if (type === 'TEAM') return committeeAbbreviation || null;
	return null;
}

/** The date part of a date, a string is taken as it is. */
export function toIsoDate(d: Date | string | null | undefined): string | null {
	if (!d) return null;
	if (typeof d === 'string') return d;
	return d.toISOString().slice(0, 10);
}

function conferenceBase(c: ConferenceFields) {
	return {
		id: c.id,
		title: c.title,
		location: c.location,
		startDate: toIsoDate(c.startDate),
		endDate: toIsoDate(c.endDate),
		committees: c.committees ?? []
	};
}

function representationOf(cu: LauncherConferenceUser) {
	return cu.conferenceMember?.representation ?? cu.committeeMember?.representation;
}

/** A conference the user takes part in, opening where their role works. */
export function toUserConference(cu: LauncherConferenceUser): LauncherConference {
	const rep = representationOf(cu);
	const committeeMember = cu.committeeMember;
	return {
		...conferenceBase(cu.conference),
		role: badgeFor(cu.conferenceUserType),
		roleDetail: roleDetail(
			cu.conferenceUserType,
			rep?.name,
			committeeMember?.committee?.abbreviation
		),
		representation: rep,
		href: conferenceHref(cu.conferenceUserType, cu.conference.id, committeeMember),
		committeeId: committeeMember?.committeeId ?? null
	};
}

/** Any conference, as a global admin sees it: opening in mission control. */
export function toAdminConference(c: ConferenceFields): LauncherConference {
	return {
		...conferenceBase(c),
		role: 'ADMIN',
		roleDetail: null,
		representation: null,
		href: `/app/${c.id}/mission-control`
	};
}

/** Conferences whose title or location contain the search, ignoring case. */
export function searchConferences(conferences: LauncherConference[], query: string) {
	const q = query.trim().toLowerCase();
	if (!q) return conferences;
	return conferences.filter(
		(c) => c.title.toLowerCase().includes(q) || (c.location ?? '').toLowerCase().includes(q)
	);
}

const time = (date: string | null | undefined) => new Date(date ?? 0).getTime();

const sortByStatus: Record<
	LauncherStatus,
	(a: LauncherConference, b: LauncherConference) => number
> = {
	// Running ones by the soonest end, upcoming ones by the soonest start, past ones latest first
	active: (a, b) => time(a.endDate) - time(b.endDate),
	upcoming: (a, b) => time(a.startDate) - time(b.startDate),
	past: (a, b) => time(b.endDate) - time(a.endDate)
};

/** The conferences split into running, upcoming and past ones, each in its own order. */
export function groupByStatus(conferences: LauncherConference[], now: Date) {
	const groups: Record<LauncherStatus, LauncherConference[]> = {
		active: [],
		upcoming: [],
		past: []
	};
	for (const c of conferences) groups[deriveStatus(c, now)].push(c);
	for (const status of Object.keys(groups) as LauncherStatus[]) {
		groups[status].sort(sortByStatus[status]);
	}
	return groups;
}

/** Heading of the launcher: all conferences for a global admin, else one or several of the user's. */
export function launcherHeadingKind(isGlobalAdmin: boolean, userConferenceCount: number) {
	if (isGlobalAdmin) return 'all';
	return userConferenceCount === 1 ? 'one' : 'many';
}

/** ", Name" after the greeting, nothing without a first name. */
export function greetingSuffix(firstName: string | null | undefined) {
	return firstName ? `, ${firstName}` : '';
}
