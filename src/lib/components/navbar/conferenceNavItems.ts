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
}

function matches(activeRouteId: string | null | undefined, marker: string): boolean {
	if (!activeRouteId) return false;
	return activeRouteId.includes(marker);
}

export function buildConferenceNavItems({
	role,
	conferenceId,
	activeRouteId,
	activePathname
}: BuildArgs): NavItem[] {
	const isAdmin = role === 'ADMIN';
	const isTeamOrAdmin = role === 'ADMIN' || role === 'TEAM';

	const items: NavItem[] = [];

	if (isTeamOrAdmin) {
		const onConfig =
			matches(activeRouteId, 'mission-control/config') ||
			(activePathname?.endsWith('/mission-control/config') ?? false);
		const onMissionControl =
			!onConfig &&
			(matches(activeRouteId, 'mission-control') ||
				(activePathname?.endsWith('/mission-control') ?? false));

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
			href: `/app/${conferenceId}/nsa-attendance`,
			active:
				matches(activeRouteId, 'nsa-attendance') ||
				(activePathname?.includes('/nsa-attendance') ?? false)
		});
	}

	if (isAdmin) {
		items.push({
			key: 'configuration',
			faIcon: 'fa-gear',
			title: m.configuration(),
			href: `/app/${conferenceId}/mission-control/config`,
			active:
				matches(activeRouteId, 'mission-control/config') ||
				(activePathname?.endsWith('/mission-control/config') ?? false)
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
