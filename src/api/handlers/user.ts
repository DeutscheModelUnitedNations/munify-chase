import { schema } from '$api/db/db';
import { abilityBuilder, schemaBuilder } from '$api/rumble';
import { basics } from './basics';
import { and, eq } from 'drizzle-orm';

const { arg, ref, pubsub, table } = basics('user');

abilityBuilder.user.allow('read').when(({ user }) => {
	if (user) {
		return {
			where: eq(schema.user.id, user.sub)
		};
	}
});

abilityBuilder.user.allow('read').when(({ user }) => {
	// TODO
	if (user) {
		return {};
	}
});
