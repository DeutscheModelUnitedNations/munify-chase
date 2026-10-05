import type { RouteId } from '$app/types';
import type { Tour } from './types';

type RouteHelp = {
	/** Manual page below `/docs`, see `src/lib/docs/nav.ts` */
	docs: string;
	/** Lazily loaded so tour copy isn't bundled into every page */
	tour?: () => Promise<Tour>;
};

/**
 * Help shown by the help button for each app route. Keyed by `RouteId`, so renaming
 * or removing a route breaks the typecheck until this map is updated. The docs test
 * checks that every `docs` slug exists.
 */
export const routeHelp: Partial<Record<RouteId, RouteHelp>> = {
	'/app/(launcher)': { docs: 'user-manual/participant/getting-started' },
	'/app/(launcher)/import': { docs: 'user-manual/admin/importing-delegator' },
	'/app/[conferenceId]/(committeeOverview)': { docs: 'user-manual/roles-overview' },
	'/app/[conferenceId]/attendance': { docs: 'user-manual/admin/attendance-statistics' },
	'/app/[conferenceId]/mission-control': { docs: 'user-manual/admin/mission-control' },
	'/app/[conferenceId]/mission-control/config': { docs: 'user-manual/admin/conference-setup' },
	'/app/[conferenceId]/statistics': {
		docs: 'user-manual/participant/statistics',
		tour: () => import('./shared/statistics.tour').then((m) => m.tour)
	},

	// Participants
	'/app/[conferenceId]/participant': {
		docs: 'user-manual/participant/getting-started',
		tour: () => import('./participant/overview.tour').then((m) => m.tour)
	},
	'/app/[conferenceId]/participant/[committeeId]': {
		docs: 'user-manual/participant/committee-overview',
		tour: () => import('./participant/committee.tour').then((m) => m.tour)
	},
	'/app/[conferenceId]/participant/[committeeId]/papers': {
		docs: 'user-manual/participant/resolutions-basics',
		tour: () => import('./participant/papers.tour').then((m) => m.tour)
	},
	'/app/[conferenceId]/participant/[committeeId]/papers/[paperId]': {
		docs: 'user-manual/participant/writing-resolutions',
		tour: () => import('./participant/paper.tour').then((m) => m.tour)
	},

	// Chairs
	'/app/[conferenceId]/[committeeId]/(presentation)': {
		docs: 'user-manual/chair/presentation-mode'
	},
	'/app/[conferenceId]/[committeeId]/(chairs)/setup': {
		docs: 'user-manual/chair/committee-setup',
		tour: () => import('./chair/setup.tour').then((m) => m.tour)
	},
	'/app/[conferenceId]/[committeeId]/(chairs)/presence': {
		docs: 'user-manual/chair/roll-call-attendance',
		tour: () => import('./chair/presence.tour').then((m) => m.tour)
	},
	'/app/[conferenceId]/[committeeId]/(chairs)/speakers-list': {
		docs: 'user-manual/chair/speakers-list',
		tour: () =>
			import('$lib/components/speakersList/speakersList.tour').then((m) => m.chairSpeakersListTour)
	},
	'/app/[conferenceId]/[committeeId]/(chairs)/voting': {
		docs: 'user-manual/chair/voting',
		tour: () => import('./chair/voting.tour').then((m) => m.tour)
	},
	'/app/[conferenceId]/[committeeId]/(chairs)/requests': {
		docs: 'user-manual/chair/requests',
		tour: () => import('./chair/requests.tour').then((m) => m.tour)
	},
	'/app/[conferenceId]/[committeeId]/(chairs)/resolutions': {
		docs: 'user-manual/chair/resolutions',
		tour: () => import('./chair/resolutions.tour').then((m) => m.tour)
	},
	'/app/[conferenceId]/[committeeId]/(chairs)/resolutions/[paperId]': {
		docs: 'user-manual/chair/amendments-review',
		tour: () => import('./chair/paper.tour').then((m) => m.tour)
	}
};
