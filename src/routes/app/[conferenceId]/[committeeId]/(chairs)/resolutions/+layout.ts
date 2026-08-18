import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { LOCAL_CONFERENCE_ID } from '$lib/state/localDemo.svelte';
import type { LayoutLoad } from './$types';

// The resolutions feature has no offline equivalent — bounce straight back out even
// if reached by a direct URL (the nav entry point is already hidden, see the chairs
// layout's dockItems).
export const load: LayoutLoad = ({ params }) => {
	if (params.conferenceId === LOCAL_CONFERENCE_ID) {
		redirect(
			302,
			resolve('/app/[conferenceId]/[committeeId]/(chairs)/speakers-list', {
				conferenceId: params.conferenceId,
				committeeId: params.committeeId
			})
		);
	}
};
