import type { LayoutLoad } from './$houdini';

export const load: LayoutLoad = async (event) => {
	return {
		conferenceId: event.params.conferenceId
	};
};
