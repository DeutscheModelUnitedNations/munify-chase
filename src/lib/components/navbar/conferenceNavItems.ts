import { m } from '$lib/paraglide/messages';

export type ConferenceUserRole =
	| 'ADMIN'
	| 'TEAM'
	| 'DELEGATE'
	| 'NON_STATE_ACTOR'
	| 'SPECTATOR'
	| undefined
	| null;

export interface NavItem {
	key: string;
	faIcon: string;
	title: string;
	href: string;
	active: boolean;
}

interface BuildArgs {
	role: ConferenceUserRole;
	conferenceId: string;
	activeRouteId?: string | null;
	activePathname?: string | null;
	isGlobalAdmin?: boolean;
}

function hasRouteSegment(value: string | null | undefined, segmentPath: string): boolean {
	if (!value) return false;
	const normalizedSegmentPath = segmentPath.replace(/^\/+|\/+$/g, '');
	if (!normalizedSegmentPath) return false;

	const marker = `/${normalizedSegmentPath}`;
	let markerStartIndex = value.indexOf(marker);

	while (markerStartIndex !== -1) {
		const markerEndIndex = markerStartIndex + marker.length;
		const nextChar = value.at(markerEndIndex);
		if (nextChar === undefined || nextChar === '/') return true;
		markerStartIndex = value.indexOf(marker, markerStartIndex + 1);
	}

	return false;
}

export function buildConferenceNavItems({
	role,
	conferenceId,
	activeRouteId,
	activePathname,
	isGlobalAdmin
}: BuildArgs): NavItem[] {
	const isAdmin = role === 'ADMIN' || !!isGlobalAdmin;
	const isTeamOrAdmin = isAdmin || role === 'TEAM';

	const items: NavItem[] = [];

	if (isTeamOrAdmin) {
		const onConfig =
			hasRouteSegment(activeRouteId, 'mission-control/config') ||
			hasRouteSegment(activePathname, 'mission-control/config');
		const onMissionControl =
			!onConfig &&
			(hasRouteSegment(activeRouteId, 'mission-control') ||
				hasRouteSegment(activePathname, 'mission-control'));

		items.push({
			key: 'mission-control',
			faIcon: 'fa-rocket-launch',
			title: m.missionControl(),
			href: `/app/${conferenceId}/mission-control`,
			active: onMissionControl
		});

		items.push({
			key: 'attendance',
			faIcon: 'fa-user-tag',
			title: m.attendance(),
			href: `/app/${conferenceId}/attendance`,
			active:
				hasRouteSegment(activeRouteId, 'attendance') ||
				hasRouteSegment(activePathname, 'attendance')
		});
	}

	if (isAdmin) {
		items.push({
			key: 'configuration',
			faIcon: 'fa-gear',
			title: m.configuration(),
			href: `/app/${conferenceId}/mission-control/config`,
			active:
				hasRouteSegment(activeRouteId, 'mission-control/config') ||
				hasRouteSegment(activePathname, 'mission-control/config')
		});
	}

	return items;
}

export function roleLabelFor(role: ConferenceUserRole): string | undefined {
	switch (role) {
		case 'ADMIN':
			return m.roleAdmin();
		case 'TEAM':
			return m.roleTeam();
		case 'DELEGATE':
			return m.roleDelegate();
		case 'NON_STATE_ACTOR':
			return m.roleNonStateActor();
		case 'SPECTATOR':
			return m.roleSpectator();
		default:
			return undefined;
	}
}

export function roleBadgeClassFor(role: ConferenceUserRole): string {
	switch (role) {
		case 'ADMIN':
			return 'badge-primary';
		case 'TEAM':
			return 'badge-secondary';
		default:
			return 'badge-ghost';
	}
}
