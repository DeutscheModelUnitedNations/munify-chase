import { redirect } from '@sveltejs/kit';
import { resolve } from '$app/paths';
import { LOCAL_CONFERENCE_ID } from '$lib/state/localDemo.svelte';
import type { LayoutLoad } from './$types';

// The resolutions feature has no offline equivalent — bounce straight back out even
// if reached by a direct URL (the nav entry points are already hidden, see the
// participant layout's dock and the committee overview page's Resolutions Card).
export const load: LayoutLoad = ({ params }) => {
	if (params.conferenceId === LOCAL_CONFERENCE_ID) {
		redirect(
			302,
			resolve('/app/[conferenceId]/participant/[committeeId]', {
				conferenceId: params.conferenceId,
				committeeId: params.committeeId
			})
		);
	}
};
