import { db, schema } from '$api/db/db';
import { schemaBuilder } from '$api/rumble';
import { assertFirstEntryExists } from '@m1212e/rumble';
import { ConferenceRef } from './conference';
import { GraphQLError } from 'graphql';

schemaBuilder.mutationFields((t) => ({
	importDelegatorConference: t.drizzleField({
		type: ConferenceRef,
		args: {
			data: t.arg({
				type: schemaBuilder.inputType('ImportData', {
					fields: (t) => ({
						title: t.string({ required: true }),
						committees: t.field({
							type: [
								schemaBuilder.inputType('ImportDataCommittee', {
									fields: (t) => ({
										name: t.string({ required: true }),
										abbreviation: t.string({ required: true })
									})
								})
							],
							required: true
						})
					})
				}),
				required: true
			})
		},
		resolve: async (query, root, args, ctx, info) => {
			if (!ctx.hasRole('admin')) {
				throw new GraphQLError('You must have the admin role!');
			}

			const conference = await db
				.insert(schema.conference)
				.values({
					title: args.data.title
				})
				.returning()
				.then(assertFirstEntryExists);

			const committees = await db
				.insert(schema.committee)
				.values(
					args.data.committees.map((committee) => ({
						name: committee.name,
						abbreviation: committee.abbreviation,
						conferenceId: conference.id
					}))
				)
				.returning()
				.then(assertFirstEntryExists);

			return db.query.conference.findFirst(
				query(
					ctx.abilities.conference.filter('read', {
						inject: {
							where: {
								id: conference.id
							}
						}
					}).query.single
				)
			);
		}
	})
}));
