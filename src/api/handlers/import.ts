import { db, schema } from '#api/db/db';
import { enum_, schemaBuilder } from '#api/rumble';
import { importDataSchema } from '#lib/utils/import';
import { ConferenceRef } from './conference';
import { GraphQLError } from 'graphql';
import { isGlobalAdmin } from '#api/services/authHelper';
import { assertFindFirstExists } from '@m1212e/rumble';
import { linkConfig } from '#api/services/link/linkAuth';
import type { PgInsertValue, PgTable } from 'drizzle-orm/pg-core';
import type { Transaction } from './helpers/scopedLookups';
import { importRows, speakersListsOf } from './helpers/importRows';

async function insertRows<T extends PgTable>(tx: Transaction, table: T, rows: PgInsertValue<T>[]) {
	if (rows.length > 0) await tx.insert(table).values(rows);
}

const Input = schemaBuilder.inputType('ImportData', {
	description: 'Import data. You can find the JSON schema here: /api/schema/import',
	fields: (t) => ({
		id: t.id({ required: true }),
		title: t.string({ required: true }),
		location: t.string(),
		startDate: t.field({ type: 'Date' }),
		endDate: t.field({ type: 'Date' }),
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
						icon: t.string(),
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
						name: t.string(),
						conferenceMemberId: t.id(),
						committeeMemberId: t.id()
					})
				})
			],
			required: false
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
		}),
		requestTypes: t.field({
			type: [
				schemaBuilder.inputType('ImportDataRequestType', {
					fields: (t) => ({
						id: t.id(),
						name: t.string({ required: true }),
						icon: t.string(),
						enabled: t.boolean(),
						delegatesOnly: t.boolean()
					})
				})
			],
			required: false
		})
	})
});

schemaBuilder.mutationFields((t) => ({
	importDelegatorConference: t.drizzleField({
		type: ConferenceRef,
		args: {
			data: t.arg({
				type: Input,
				required: true
			})
		},
		resolve: async (query, root, args, ctx) => {
			if (!isGlobalAdmin(ctx)) {
				throw new GraphQLError('You must be a global admin to create conferences!');
			}

			// a linked DELEGATOR brings its conferences itself (`docs/plans/delegator-link.md`)
			if (linkConfig()) {
				throw new GraphQLError(
					'This instance is linked to MUNify DELEGATOR: create the conference there.'
				);
			}

			// we want to ensure consistency between frontend and backend
			// therfore the explicit extra parsing
			const data = importDataSchema.parse(args.data);

			const rows = importRows({ data, creatorEmail: ctx.oidc!.user.email! });

			//TODO maybe use upserts instead?
			await db.transaction(async (tx) => {
				await tx.insert(schema.conference).values(rows.conference);
				await insertRows(tx, schema.committee, rows.committees);
				await insertRows(tx, schema.representation, rows.representations);
				await insertRows(tx, schema.conferenceMember, rows.conferenceMembers);
				await insertRows(tx, schema.committeeMember, rows.committeeMembers);
				await insertRows(tx, schema.conferenceUser, rows.conferenceUsers);
				await insertRows(tx, schema.conferenceUser, rows.creatorAdmin);

				if (rows.agendaItems.length > 0) {
					const agendaItems = await tx
						.insert(schema.agendaItem)
						.values(rows.agendaItems)
						.returning();
					await tx
						.insert(schema.speakersList)
						.values(agendaItems.flatMap((agendaItem) => speakersListsOf(agendaItem.id)));
				}

				await insertRows(tx, schema.requestType, rows.requestTypes);
			});

			return db.query.conference
				.findFirst(
					query(
						(await ctx.abilities.conference.filter('read')).merge({
							where: {
								id: data.id
							}
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	})
}));
