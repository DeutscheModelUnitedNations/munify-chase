import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { and, eq } from 'drizzle-orm';
import * as schema from './schema';

/** Lookups the seed scripts (the dev seed, the docs screenshots' staging) share. */

/** A committee's members with the kind and country code of what they represent */
export function committeeMembersWithRepresentation(db: NodePgDatabase, committeeId: string) {
	return db
		.select({
			id: schema.committeeMember.id,
			representationType: schema.representation.type,
			alpha2: schema.representation.alpha2Code
		})
		.from(schema.committeeMember)
		.innerJoin(
			schema.representation,
			eq(schema.committeeMember.representationId, schema.representation.id)
		)
		.where(eq(schema.committeeMember.committeeId, committeeId));
}

/** The conference users seated as a member of the committee */
export function committeeDelegateUsers(db: NodePgDatabase, committeeId: string) {
	return db
		.select({ id: schema.conferenceUser.id })
		.from(schema.conferenceUser)
		.innerJoin(
			schema.committeeMember,
			eq(schema.conferenceUser.committeeMemberId, schema.committeeMember.id)
		)
		.where(eq(schema.committeeMember.committeeId, committeeId));
}

/** Any one admin of the conference */
export async function anyConferenceAdmin(db: NodePgDatabase, conferenceId: string) {
	const admins = await db
		.select()
		.from(schema.conferenceUser)
		.where(
			and(
				eq(schema.conferenceUser.conferenceId, conferenceId),
				eq(schema.conferenceUser.conferenceUserType, 'ADMIN')
			)
		)
		.limit(1);
	return admins.at(0);
}
