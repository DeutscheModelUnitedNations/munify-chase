import { schemaBuilder } from '$api/rumble';
import type { Context } from '$api/context';

schemaBuilder.queryFields((t) => {
	return {
		serverTime: t.field({
			type: 'DateTime',
			nullable: false,
			resolve: (_root, _args, ctx: Context) => {
				ctx.mustBeLoggedIn();
				return new Date();
			}
		})
	};
});
