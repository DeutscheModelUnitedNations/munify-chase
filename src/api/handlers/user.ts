import { schemaBuilder } from '$api/rumble';
import { basics } from './basics';

const { arg, ref, pubsub } = basics('user');

schemaBuilder.mutationFields((t) => {
	return {
		dummy: t.drizzleField({
			type: ref,
			resolve: async (query, root, args, ctx, info) => {
				// pubsub.updated("1")
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
