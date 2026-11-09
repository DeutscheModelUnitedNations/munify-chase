import { db, schema } from '#api/db/db';
import { and, count, eq } from 'drizzle-orm';
import type { schemaBuilder } from '#api/rumble';
import { assertFindFirstExists } from '@m1212e/rumble';

/** The context every resolver gets, abilities included. */
export type HandlerContext = typeof schemaBuilder.$inferSchemaTypes.Context;

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

/** For writes that do arithmetic on positions or counts: no concurrent write may interleave. */
export const SERIALIZABLE = { isolationLevel: 'serializable', deferrable: true } as const;

/** The conference, if the caller may change it; NOT_FOUND otherwise. */
export async function findUpdatableConference(ctx: HandlerContext, conferenceId: string) {
	return db.query.conference
		.findFirst(
			(await ctx.abilities.conference.filter('update')).merge({ where: { id: conferenceId } }).query
				.single
		)
		.then(assertFindFirstExists);
}

/** The committee, if the caller may change it; NOT_FOUND otherwise. */
export async function findUpdatableCommittee(ctx: HandlerContext, committeeId: string) {
	return db.query.committee
		.findFirst(
			(await ctx.abilities.committee.filter('update')).merge({ where: { id: committeeId } }).query
				.single
		)
		.then(assertFindFirstExists);
}

/** The committee, regardless of the caller; NOT_FOUND when there is none. */
export function findCommittee(committeeId: string) {
	return db.query.committee.findFirst({ where: { id: committeeId } }).then(assertFindFirstExists);
}

/** The caller's own seat in a conference, if they have one there. */
export function findOwnConferenceUser(ctx: HandlerContext, conferenceId: string) {
	return db.query.conferenceUser.findFirst({
		where: { userEmail: ctx.mustBeLoggedIn().email!, conferenceId }
	});
}

/** How many delegations (not NSAs or observers) are present in a committee. */
export function countPresentDelegations(committeeId: string) {
	return db
		.select({ count: count() })
		.from(schema.committeeMember)
		.innerJoin(
			schema.representation,
			eq(schema.committeeMember.representationId, schema.representation.id)
		)
		.where(
			and(
				eq(schema.committeeMember.committeeId, committeeId),
				eq(schema.committeeMember.present, true),
				eq(schema.representation.type, 'DELEGATION')
			)
		)
		.then(([r]) => r?.count ?? 0);
}
