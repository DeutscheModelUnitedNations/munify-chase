import { db, schema } from '$api/db/db';
import { abilityBuilder, object, pubsub, query, schemaBuilder } from '$api/rumble';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { and, eq } from 'drizzle-orm';

// TODO
abilityBuilder.message.allow('read');

const MessageRef = object({
	name: 'Message',
	tableName: 'message'
});

const messagePubSub = pubsub({ tableName: 'message' });

query({
	tableName: 'message'
});

schemaBuilder.mutationFields((t) => {
	return {
		postMessage: t.drizzleField({
			type: MessageRef,
			args: {
				content: t.arg.string({ required: true })
			},
			resolve: async (query, root, args, ctx, info) => {
				const user = ctx.mustBeLoggedIn();

				const newMessage = await db
					.insert(schema.message)
					.values({
						content: args.content,
						userId: user.sub
					})
					.returning({
						id: schema.message.id,
						createdAt: schema.message.createdAt,
						updatedAt: schema.message.updatedAt,
						content: schema.message.content,
						userId: schema.message.userId
					})
					.then(assertFirstEntryExists);

				messagePubSub.created();

				return db.query.message
					.findFirst(
						query({
							where: and(
								ctx.abilities.message.filter('read').where,
								eq(schema.message.id, newMessage.id)
							)
						})
					)
					.then(assertFindFirstExists);
			}
		})
	};
});
