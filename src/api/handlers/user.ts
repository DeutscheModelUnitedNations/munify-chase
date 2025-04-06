import { object, query, schemaBuilder } from '$api/rumble';

const UserRef = object({
	name: 'User',
	tableName: 'user'
});

query({
	tableName: 'user'
});

schemaBuilder.mutationFields((t) => {
	return {
		dummy: t.drizzleField({
			type: UserRef,
			resolve: async (query, root, args, ctx, info) => {
				// TODO
				return {
					id: '1',
					name: 'John Doe',
					createdAt: new Date(),
					email: 'FZVr1@example.com',
					familyName: 'Doe',
					givenName: 'John',
					locale: 'en',
					preferredUsername: 'johndoe',
					updatedAt: new Date()
				};
			}
		})
	};
});
