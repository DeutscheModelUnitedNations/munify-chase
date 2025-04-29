import type { LauncherQueryVariables } from './$houdini';

export const _LauncherQueryVariables: LauncherQueryVariables = async (event) => {
	const { user } = await event.parent();

	return {
		userId: user.sub
	};
};
