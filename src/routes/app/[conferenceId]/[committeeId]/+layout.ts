import type { LayoutLoad } from './$houdini';

export const load: LayoutLoad = async (event) => {
	return {
		committeeId: event.params.committeeId
	};
};
