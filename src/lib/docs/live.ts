import { LOCAL_CONFERENCE_ID } from '$lib/state/localDemo.svelte';

/**
 * Pages of the offline demo conference that manual pages can embed with
 * `:::live <id>`. They run the real components against in-browser demo data.
 */
const LIVE_DEMO_PATHS: Record<string, string> = {
	'chair/setup': 'localcommittee/setup',
	'chair/presence': 'localcommittee/presence',
	'chair/speakers-list': 'localcommittee/speakers-list',
	'chair/voting': 'localcommittee/voting',
	'chair/presentation': 'localcommittee',
	'admin/mission-control': 'mission-control'
};

export const liveDemoIds = Object.keys(LIVE_DEMO_PATHS);

export function liveDemoUrl(id: string) {
	const path = LIVE_DEMO_PATHS[id];
	return path ? `/app/${LOCAL_CONFERENCE_ID}/${path}` : undefined;
}
