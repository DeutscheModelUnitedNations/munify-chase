import type { RouteId } from '$app/types';
import type { Tour } from './types';

type RouteHelp = {
	/** Manual page below `/docs`, see `src/lib/docs/nav.ts` */
	docs: string;
	/** Lazily loaded so tour copy isn't bundled into every page */
	tour?: () => Promise<Tour>;
};

const lazy = (load: () => Promise<{ tour: Tour }>) => async () => (await load()).tour;

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
		tour: lazy(() => import('./shared/statistics.tour'))
	},

	// Participants
	'/app/[conferenceId]/participant': {
		docs: 'user-manual/participant/getting-started',
		tour: lazy(() => import('./participant/overview.tour'))
	},
	'/app/[conferenceId]/participant/[committeeId]': {
		docs: 'user-manual/participant/committee-overview',
		tour: lazy(() => import('./participant/committee.tour'))
	},
	'/app/[conferenceId]/participant/[committeeId]/papers': {
		docs: 'user-manual/participant/resolutions-basics',
		tour: lazy(() => import('./participant/papers.tour'))
	},
	'/app/[conferenceId]/participant/[committeeId]/papers/[paperId]': {
		docs: 'user-manual/participant/writing-resolutions',
		tour: lazy(() => import('./participant/paper.tour'))
	},

	// Chairs
	'/app/[conferenceId]/[committeeId]/(presentation)': {
		docs: 'user-manual/chair/presentation-mode'
	},
	'/app/[conferenceId]/[committeeId]/(chairs)/setup': {
		docs: 'user-manual/chair/committee-setup',
		tour: lazy(() => import('./chair/setup.tour'))
	},
	'/app/[conferenceId]/[committeeId]/(chairs)/presence': {
		docs: 'user-manual/chair/roll-call-attendance',
		tour: lazy(() => import('./chair/presence.tour'))
	},
	'/app/[conferenceId]/[committeeId]/(chairs)/speakers-list': {
		docs: 'user-manual/chair/speakers-list',
		tour: async () =>
			(await import('$lib/components/speakersList/speakersList.tour')).chairSpeakersListTour
	},
	'/app/[conferenceId]/[committeeId]/(chairs)/voting': {
		docs: 'user-manual/chair/voting',
		tour: lazy(() => import('./chair/voting.tour'))
	},
	'/app/[conferenceId]/[committeeId]/(chairs)/requests': {
		docs: 'user-manual/chair/requests',
		tour: lazy(() => import('./chair/requests.tour'))
	},
	'/app/[conferenceId]/[committeeId]/(chairs)/resolutions': {
		docs: 'user-manual/chair/resolutions',
		tour: lazy(() => import('./chair/resolutions.tour'))
	},
	'/app/[conferenceId]/[committeeId]/(chairs)/resolutions/[paperId]': {
		docs: 'user-manual/chair/amendments-review',
		tour: lazy(() => import('./chair/paper.tour'))
	}
};
