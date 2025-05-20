import { db, schema } from '$api/db/db';
import { enum_, schemaBuilder } from '$api/rumble';
import { ConferenceRef } from './conference';
import { GraphQLError } from 'graphql';

schemaBuilder.mutationFields((t) => ({
	importDelegatorConference: t.drizzleField({
		type: ConferenceRef,
		args: {
			data: t.arg({
				type: schemaBuilder.inputType('ImportData', {
					fields: (t) => ({
						id: t.id({ required: true }),
						title: t.string({ required: true }),
						committees: t.field({
							type: [
								schemaBuilder.inputType('ImportDataCommittee', {
									fields: (t) => ({
										id: t.id({ required: true }),
										name: t.string({ required: true }),
										abbreviation: t.string({ required: true })
									})
								})
							],
							required: true
						}),
						representations: t.field({
							type: [
								schemaBuilder.inputType('ImportDataRepresentation', {
									fields: (t) => ({
										id: t.id({ required: true }),
										name: t.string(),
										alpha2Code: t.string(),
										alpha3Code: t.string(),
										representationType: t.field({
											type: enum_({ tsName: 'representationType' }),
											required: true
										}),
										faIcon: t.string(),
										regionalGroup: t.field({
											type: enum_({ tsName: 'regionalGroup' })
										})
									})
								})
							],
							required: true
						}),
						conferenceMembers: t.field({
							type: [
								schemaBuilder.inputType('ImportDataConferenceMember', {
									fields: (t) => ({
										id: t.id({ required: true }),
										representationId: t.id({ required: true })
									})
								})
							],
							required: true
						}),
						committeeMembers: t.field({
							type: [
								schemaBuilder.inputType('ImportDataCommitteeMember', {
									fields: (t) => ({
										id: t.id({ required: true }),
										committeeId: t.id({ required: true }),
										representationId: t.id({ required: true })
									})
								})
							],
							required: true
						}),
						conferenceUsers: t.field({
							type: [
								schemaBuilder.inputType('ImportDataConferenceUser', {
									fields: (t) => ({
										id: t.id(),
										conferenceUserType: t.field({
											type: enum_({ tsName: 'conferenceUserType' }),
											required: true
										}),
										userEmail: t.string({ required: true }),
										conferenceMemberId: t.id(),
										committeeMemberId: t.id()
									})
								})
							],
							required: true
						}),
						agendaItems: t.field({
							type: [
								schemaBuilder.inputType('ImportDataAgendaItem', {
									fields: (t) => ({
										id: t.id(),
										committeeId: t.id({ required: true }),
										title: t.string({ required: true })
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

			//TODO maybe use upserts instead?
			await db.transaction(async (tx) => {
				await tx.insert(schema.conference).values({
					id: args.data.id,
					title: args.data.title
				});

				await tx.insert(schema.committee).values(
					args.data.committees.map((committee) => ({
						id: committee.id,
						name: committee.name,
						abbreviation: committee.abbreviation,
						conferenceId: args.data.id
					}))
				);

				await tx.insert(schema.representation).values(
					args.data.representations.map((representation) => ({
						id: representation.id,
						name: representation.name,
						alpha2Code: representation.alpha2Code,
						alpha3Code: representation.alpha3Code,
						type: representation.representationType,
						faIcon: representation.faIcon,
						regionalGroup: representation.regionalGroup,
						conferenceId: args.data.id
					}))
				);

				await tx.insert(schema.conferenceMember).values(
					args.data.conferenceMembers.map((member) => ({
						id: member.id,
						conferenceId: args.data.id,
						representationId: member.representationId
					}))
				);

				await tx.insert(schema.committeeMember).values(
					args.data.committeeMembers.map((member) => ({
						id: member.id,
						committeeId: member.committeeId,
						representationId: member.representationId
					}))
				);

				await tx.insert(schema.conferenceUser).values(
					args.data.conferenceUsers.map((user) => ({
						id: user.id ?? undefined,
						conferenceUserType: user.conferenceUserType,
						userEmail: user.userEmail,
						conferenceMemberId: user.conferenceMemberId,
						committeeMemberId: user.committeeMemberId,
						conferenceId: args.data.id
					}))
				);

				// if the creating user is not found in the dataset, we want to make them an admin anyway!
				if (!args.data.conferenceUsers.find((u) => u.userEmail === ctx.oidc!.user.email)) {
					await tx.insert(schema.conferenceUser).values({
						conferenceId: args.data.id,
						conferenceUserType: 'ADMIN',
						userEmail: ctx.oidc!.user.email!
					});
				}

				if (args.data.agendaItems && args.data.agendaItems.length > 0) {
					const agendaItems = await tx
						.insert(schema.agendaItem)
						.values(
							args.data.agendaItems.map((item) => ({
								id: item.id ?? undefined,
								committeeId: item.committeeId,
								title: item.title,
								conferenceId: args.data.id
							}))
						)
						.returning();

					for (const agendaItem of agendaItems) {
						await tx.insert(schema.speakersList).values({
							agendaItemId: agendaItem.id,
							speakingTime: 180,
							type: 'SPEAKERS_LIST'
						});
						await tx.insert(schema.speakersList).values({
							agendaItemId: agendaItem.id,
							speakingTime: 30,
							type: 'COMMENT_LIST'
						});
					}
				}
			});

			return db.query.conference.findFirst(
				query(
					ctx.abilities.conference.filter('read', {
						inject: {
							where: {
								id: args.data.id
							}
						}
					}).query.single
				)
			);
		}
	})
}));
