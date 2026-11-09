import { db, schema } from '#api/db/db';
import {
	abilityBuilder,
	enum_,
	schemaBuilder,
	object,
	pubsub as rumblePubsub,
	query
} from '#api/rumble';
import {
	isAdminInConference,
	isParticipantInConference,
	linkedDelegator,
	SYNCED_CONFERENCE
} from '#api/services/authHelper';
import {
	assertFindFirstExists,
	assertFirstEntryExists,
	mapNullFieldsToUndefined
} from '@m1212e/rumble';
import { eq } from 'drizzle-orm';
import { nanoidValidation } from '#lib/helpers/nanoid';
import { findUpdatableConference, type Transaction } from './helpers/scopedLookups';
import { NOT_MANAGED_BY_DELEGATOR } from '#api/services/link/managedRows';

// The linked DELEGATOR reads back the presence of its conferences (`docs/plans/delegator-link.md`).
abilityBuilder.representation.allow('read').when(
	linkedDelegator({
		where: { conference: SYNCED_CONFERENCE },
		columns: {
			id: true,
			conferenceId: true,
			type: true,
			alpha2Code: true,
			alpha3Code: true,
			name: true,
			icon: true
		}
	})
);

abilityBuilder.representation.allow('read').when((ctx) => {
	return {
		where: isParticipantInConference(ctx)
	};
});

abilityBuilder.representation.allow(['update', 'delete']).when((ctx) => {
	// a representation synced from a linked DELEGATOR is changed there
	return { where: { ...isAdminInConference(ctx), ...NOT_MANAGED_BY_DELEGATOR } };
});

const ref = object({ table: 'representation' });

const representationTypeEnum = enum_({
	tsName: 'representationType'
});

const pubsub = rumblePubsub({ table: 'representation' });
query({ table: 'representation' });

/** A delegation gets a seat in every committee of its conference. */
async function seatInEveryCommittee({
	tx,
	conferenceId,
	representationId
}: {
	tx: Transaction;
	conferenceId: string;
	representationId: string;
}) {
	const committees = await tx.query.committee.findMany({ where: { conferenceId } });
	if (committees.length === 0) return;
	await tx
		.insert(schema.committeeMember)
		.values(committees.map((c) => ({ committeeId: c.id, representationId })));
}

schemaBuilder.mutationFields((t) => ({
	createRepresentation: t.drizzleField({
		type: ref,
		args: {
			id: t.arg.id().validate(nanoidValidation),
			conferenceId: t.arg.id({ required: true }),
			type: t.arg({ type: representationTypeEnum, required: true }),
			name: t.arg.string(),
			alpha2Code: t.arg.string(),
			alpha3Code: t.arg.string(),
			icon: t.arg.string()
		},
		resolve: async (query, _root, args, ctx) => {
			await findUpdatableConference(ctx, args.conferenceId);

			const { conferenceId, type, name, alpha2Code, alpha3Code, icon } =
				mapNullFieldsToUndefined(args);
			const result = await db.transaction(async (tx) => {
				const rep = await tx
					.insert(schema.representation)
					.values({ id: args.id, conferenceId, type, name, alpha2Code, alpha3Code, icon })
					.returning()
					.then(assertFirstEntryExists);

				if (args.type === 'DELEGATION') {
					await seatInEveryCommittee({ tx, conferenceId, representationId: rep.id });
				}

				return rep;
			});

			pubsub.updated(result.id);

			return db.query.representation
				.findFirst(
					query(
						(await ctx.abilities.representation.filter('read')).merge({
							where: { id: result.id }
						}).query.single
					)
				)
				.then(assertFindFirstExists);
		}
	}),
	deleteRepresentation: t.field({
		type: 'Boolean',
		args: {
			id: t.arg.id({ required: true })
		},
		resolve: async (_root, args, ctx) => {
			await db.query.representation
				.findFirst(
					(await ctx.abilities.representation.filter('delete')).merge({ where: { id: args.id } })
						.query.single
				)
				.then(assertFindFirstExists);

			await db.transaction(async (tx) => {
				// Delete associated committee members first (FK may not cascade)
				await tx
					.delete(schema.committeeMember)
					.where(eq(schema.committeeMember.representationId, args.id));

				// Delete associated conference members
				await tx
					.delete(schema.conferenceMember)
					.where(eq(schema.conferenceMember.representationId, args.id));

				await tx.delete(schema.representation).where(eq(schema.representation.id, args.id));
			});

			pubsub.removed();

			return true;
		}
	})
}));
