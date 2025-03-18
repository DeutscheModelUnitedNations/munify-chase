import { object, query, schemaBuilder } from '$api/rumble';

const UserRef = object({
	name: 'User',
	tableName: 'users'
});

query({
	tableName: 'users'
});

schemaBuilder.mutationFields((t) => {
	return {
		upsertSelf: t.drizzleField({
			type: UserRef,
			resolve: async (query, root, args, ctx, info) => {
				// TODO:

				return {
					id: 1,
					name: 'John Doe'
				};
			}
		})
	};
});
