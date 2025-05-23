import { schemaBuilder } from '$api/rumble';

schemaBuilder.queryFields((t) => {
	return {
		serverTime: t.field({
			type: 'DateTime',
			nullable: false,
			resolve: (root, args, ctx) => {
				ctx.mustBeLoggedIn();
				return new Date();
			}
		})
	};
});
