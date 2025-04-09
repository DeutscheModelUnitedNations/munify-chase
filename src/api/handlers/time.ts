import { schemaBuilder } from '$api/rumble';

schemaBuilder.queryFields((t) => {
	return {
		serverTime: t.field({
			type: 'DateTime',
			resolve: (root, args, ctx) => {
				ctx.mustBeLoggedIn();
				return new Date();
			}
		})
	};
});
