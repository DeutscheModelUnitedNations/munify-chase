import { m } from '#lib/paraglide/messages';
import { isLocalConferenceActive } from '#lib/state/localDemo.svelte';

export type ConferenceUserRole =
	'ADMIN' | 'TEAM' | 'DELEGATE' | 'NON_STATE_ACTOR' | 'SPECTATOR' | undefined | null;

export interface NavItem {
	key: string;
	icon: string;
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

type ActiveRoute = Pick<BuildArgs, 'activeRouteId' | 'activePathname'>;

function isOn(route: ActiveRoute, segmentPath: string) {
	return (
		hasRouteSegment(route.activeRouteId, segmentPath) ||
		hasRouteSegment(route.activePathname, segmentPath)
	);
}

function statisticsItem(conferenceId: string, route: ActiveRoute): NavItem {
	return {
		key: 'statistics',
		icon: 'chart-bar',
		title: m.statistics(),
		href: `/app/${conferenceId}/statistics`,
		active: isOn(route, 'statistics')
	};
}

function teamItems({
	conferenceId,
	route,
	isLocalDemo
}: {
	conferenceId: string;
	route: ActiveRoute;
	isLocalDemo: boolean;
}): NavItem[] {
	const items: NavItem[] = [
		{
			key: 'mission-control',
			icon: 'rocket-launch',
			title: m.missionControl(),
			href: `/app/${conferenceId}/mission-control`,
			active: !isOn(route, 'mission-control/config') && isOn(route, 'mission-control')
		}
	];
	if (isLocalDemo) return items;
	return [
		...items,
		{
			key: 'attendance',
			icon: 'identification-badge',
			title: m.attendance(),
			href: `/app/${conferenceId}/attendance`,
			active: isOn(route, 'attendance')
		},
		statisticsItem(conferenceId, route)
	];
}

function configurationItem(conferenceId: string, route: ActiveRoute): NavItem {
	return {
		key: 'configuration',
		icon: 'gear',
		title: m.configuration(),
		href: `/app/${conferenceId}/mission-control/config`,
		active: isOn(route, 'mission-control/config')
	};
}

export function buildConferenceNavItems({
	role,
	conferenceId,
	activeRouteId,
	activePathname,
	isGlobalAdmin
}: BuildArgs): NavItem[] {
	const route = { activeRouteId, activePathname };
	const isAdmin = role === 'ADMIN' || !!isGlobalAdmin;
	const isParticipant = role === 'DELEGATE' || role === 'NON_STATE_ACTOR';
	// Attendance (roll-call/check-in tracking) and statistics both aggregate data across
	// real devices/sessions that don't exist in the offline demo conference.
	const isLocalDemo = isLocalConferenceActive();

	return [
		...(isAdmin || role === 'TEAM' ? teamItems({ conferenceId, route, isLocalDemo }) : []),
		...(isParticipant && !isLocalDemo ? [statisticsItem(conferenceId, route)] : []),
		...(isAdmin ? [configurationItem(conferenceId, route)] : [])
	];
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
