import { db, schema } from '#api/db/db';
import { abilityBuilder, schemaBuilder, object, pubsub as rumblePubsub, query } from '#api/rumble';
import { isAdminInConference, isParticipantInConference } from '#api/services/authHelper';
import { assertFindFirstExists, assertFirstEntryExists } from '@m1212e/rumble';
import { count, eq } from 'drizzle-orm';
import { GraphQLError } from 'graphql';
import { nanoidValidation } from '#lib/helpers/nanoid';
import { findUpdatableConference, type HandlerContext } from './helpers/scopedLookups';
import { givenFields, hasFields } from './helpers/givenFields';

abilityBuilder.requestType.allow('read').when((ctx) => ({
	where: isParticipantInConference(ctx)
}));

abilityBuilder.requestType.allow(['update', 'delete']).when((ctx) => ({
	where: isAdminInConference(ctx)
}));

const RequestTypeRef = object({ table: 'requestType' });

const pubsub = rumblePubsub({ table: 'requestType' });
query({ table: 'requestType' });

async function readableRequestType(ctx: HandlerContext, id: string) {
	return (await ctx.abilities.requestType.filter('read')).merge({ where: { id } }).query.single;
}

schemaBuilder.mutationFields((t) => ({
	createRequestType: t.drizzleField({
		type: RequestTypeRef,
		args: {
			id: t.arg.id().validate(nanoidValidation),
			conferenceId: t.arg.id({ required: true }),
			name: t.arg.string({ required: true }),
			icon: t.arg.string(),
			delegatesOnly: t.arg.boolean(),
			showOnPresentation: t.arg.boolean()
		},
		resolve: async (query, _root, args, ctx) => {
			await findUpdatableConference(ctx, args.conferenceId);

			const result = await db.transaction(async (tx) => {
				const priority = (
					await tx
						.select({ count: count() })
						.from(schema.requestType)
						.where(eq(schema.requestType.conferenceId, args.conferenceId))
						.then(assertFirstEntryExists)
				).count;

				return tx
					.insert(schema.requestType)
					.values({
						id: args.id,
						conferenceId: args.conferenceId,
						name: args.name,
						icon: args.icon ?? undefined,
						priority,
						delegatesOnly: args.delegatesOnly ?? undefined,
						showOnPresentation: args.showOnPresentation ?? undefined
					})
					.returning()
					.then(assertFirstEntryExists);
			});

			pubsub.created();

			return db.query.requestType
				.findFirst(query(await readableRequestType(ctx, result.id)))
				.then(assertFindFirstExists);
		}
	}),

	updateRequestType: t.drizzleField({
		type: RequestTypeRef,
		args: {
			id: t.arg.id({ required: true }),
			name: t.arg.string(),
			icon: t.arg.string(),
			priority: t.arg.int(),
			enabled: t.arg.boolean(),
			delegatesOnly: t.arg.boolean(),
			showOnPresentation: t.arg.boolean()
		},
		resolve: async (query, _root, args, ctx) => {
			await db.query.requestType
				.findFirst(
					(await ctx.abilities.requestType.filter('update')).merge({ where: { id: args.id } }).query
						.single
				)
				.then(assertFindFirstExists);

			const updateSet = givenFields({
				args,
				keys: ['name', 'priority', 'enabled', 'delegatesOnly', 'showOnPresentation'],
				clearable: ['icon']
			});

			if (hasFields(updateSet)) {
				await db
					.update(schema.requestType)
					.set(updateSet)
					.where(eq(schema.requestType.id, args.id));
			}

			pubsub.updated(args.id);

			return db.query.requestType
				.findFirst(query(await readableRequestType(ctx, args.id)))
				.then(assertFindFirstExists);
		}
	}),

	deleteRequestType: t.field({
		type: 'Boolean',
		args: {
			id: t.arg.id({ required: true })
		},
		resolve: async (_root, args, ctx) => {
			const requestType = await db.query.requestType
				.findFirst(
					(await ctx.abilities.requestType.filter('delete')).merge({ where: { id: args.id } }).query
						.single
				)
				.then(assertFindFirstExists);

			const referencing = await db
				.select({ count: count() })
				.from(schema.request)
				.where(eq(schema.request.requestTypeId, requestType.id))
				.then(assertFirstEntryExists);

			if (referencing.count > 0) {
				throw new GraphQLError(
					'Cannot delete a request type that already has requests. Disable it instead.'
				);
			}

			await db.delete(schema.requestType).where(eq(schema.requestType.id, args.id));

			pubsub.removed();

			return true;
		}
	})
}));
